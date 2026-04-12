"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import axios from "axios";

export default function VerifiedPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/login");
      return;
    }

    const checkOrder = async () => {
      try {
        const res = await axios.get("/api/orders/me");
        if (res.data.order) {
          toast.success("E-posta doğrulandı!");
          router.push("/dashboard");
        } else {
          toast.success("E-posta doğrulandı! Şimdi paketinizi seçin.");
          router.push("/#fiyatlar");
        }
      } catch {
        toast.success("E-posta doğrulandı! Şimdi paketinizi seçin.");
        router.push("/#fiyatlar");
      }
    };

    checkOrder();
  }, [isPending, session, router]);

  return (
    <div className="h-svh flex items-center justify-center bg-[#252224]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
