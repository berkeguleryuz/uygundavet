import { NextResponse } from "next/server";
import { isAdminSession } from "@/src/lib/admin";

/**
 * Client tarafının admin durumunu öğrenmesi için kullandığı küçük
 * endpoint. Editor'daki "Şablon Olarak Kaydet" butonunu sadece admin'e
 * göstermek için bu endpoint tetiklenir. Asıl yetki kontrolü her admin
 * endpoint'inde server-side yapılıyor, bu sadece UI'yı şartlı render
 * etmek için. Cevap tek bir bool: { isAdmin: boolean }.
 */
export async function GET() {
  const session = await isAdminSession();
  return NextResponse.json({ isAdmin: !!session });
}
