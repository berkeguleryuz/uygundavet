import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET ?? "davety-assets";
const publicBase = process.env.R2_PUBLIC_URL;

export const R2_ENABLED = Boolean(
  accountId && accessKeyId && secretAccessKey && publicBase
);

export const r2 = R2_ENABLED
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

export async function uploadToR2(args: {
  key: string;
  body: Uint8Array | Buffer | Blob;
  contentType: string;
}): Promise<{ url: string; key: string }> {
  if (!R2_ENABLED || !r2) {
    throw new Error("R2 not configured. Set R2_* env variables.");
  }
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: args.key,
      Body: args.body as Buffer,
      ContentType: args.contentType,
    })
  );
  return { url: `${publicBase!.replace(/\/$/, "")}/${args.key}`, key: args.key };
}

export function r2PublicUrl(key: string): string {
  if (!publicBase) throw new Error("R2_PUBLIC_URL not set");
  return `${publicBase.replace(/\/$/, "")}/${key}`;
}

/**
 * Toplu silme. Verilen anahtarları tek bir DeleteObjects çağrısıyla
 * temizler. R2/S3 API'si tek istekte 1000 anahtara izin veriyor, daha
 * büyük listeler için chunk'lara bölüyoruz.
 *
 * Hata durumunda throw ETMEZ, silinemeyenleri döndürür ki çağıran
 * tarafta loglanabilsin. R2 silmesi başarısız olsa bile DB temizliği
 * (davetiye silme) durmasın.
 */
export async function deleteR2Keys(keys: string[]): Promise<{
  ok: boolean;
  deleted: number;
  errors: { key: string; message: string }[];
}> {
  if (!R2_ENABLED || !r2 || keys.length === 0) {
    return { ok: true, deleted: 0, errors: [] };
  }
  const errors: { key: string; message: string }[] = [];
  let deleted = 0;
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    try {
      const res = await r2.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: chunk.map((k) => ({ Key: k })),
            Quiet: true,
          },
        })
      );
      deleted += chunk.length - (res.Errors?.length ?? 0);
      for (const e of res.Errors ?? []) {
        errors.push({ key: e.Key ?? "?", message: e.Message ?? "unknown" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      for (const k of chunk) errors.push({ key: k, message: msg });
    }
  }
  return { ok: errors.length === 0, deleted, errors };
}

/**
 * Bir prefix altındaki TÜM nesneleri sil. Davetiye silindiğinde
 * `users/{userId}/designs/{designId}/` prefix'i altında ne varsa
 * (orijinal + thumb/md/lg varyantları + DB'de Asset row'u kalmamış
 * olası orphan dosyalar) tek seferde temizlenir.
 *
 * Pagination: ListObjectsV2 bir seferde max 1000 anahtar veriyor;
 * NextContinuationToken ile döngüde tüm sayfaları topluyoruz.
 */
/** Silinmesi YASAK olan kalıcı sistem prefix'leri. `system/` altında
 *  template-images, default ön-yükleme avatarları gibi tüm uygulamanın
 *  ortak olarak referans verdiği immutable içerik var. Bir bug ya da
 *  yanlış cron çağrısı bu klasörü silmesin diye guard.
 */
const PROTECTED_R2_PREFIXES = ["system/", "system"] as const;

export async function deleteR2Prefix(prefix: string): Promise<{
  ok: boolean;
  deleted: number;
  errors: { key: string; message: string }[];
}> {
  if (!R2_ENABLED || !r2 || !prefix) {
    return { ok: true, deleted: 0, errors: [] };
  }
  // Boş prefix bucket'ı silebilir, system/ altı kalıcı içerik. İkisi de
  // engellenmeli.
  const normalized = prefix.replace(/^\/+/, "");
  if (
    !normalized ||
    PROTECTED_R2_PREFIXES.some(
      (p) => normalized === p || normalized.startsWith(p + "/") || normalized === p.replace(/\/$/, ""),
    )
  ) {
    console.error(`[deleteR2Prefix] BLOCKED protected prefix: "${prefix}"`);
    return {
      ok: false,
      deleted: 0,
      errors: [
        { key: prefix, message: "Protected system prefix — refusing to delete" },
      ],
    };
  }
  const allKeys: string[] = [];
  let continuationToken: string | undefined;
  do {
    const res = await r2.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) allKeys.push(obj.Key);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);
  return deleteR2Keys(allKeys);
}
