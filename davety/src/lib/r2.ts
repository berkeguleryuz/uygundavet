import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    throw new Error("R2 not configured — set R2_* env variables");
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
