"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function FeatureLockedPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-sm w-full">
        <CardContent className="flex flex-col items-center text-center gap-5">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="size-7 text-[#d5d1ad]" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-chakra font-semibold uppercase tracking-wider">
              {t("featureLocked")}
            </h2>
            <p className="text-sm text-muted-foreground font-sans">
              {t("featureLocked")}
            </p>
          </div>
          <Link
            href="/#fiyatlar"
            className={cn(
              buttonVariants(),
              "bg-[#d5d1ad] text-[#252224] hover:bg-[#d5d1ad]/90"
            )}
          >
            {t("upgradePackage")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
