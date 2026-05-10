/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `guest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "billing_transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "tier" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'try',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "promotionCode" TEXT,
    "appliedPercent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "billing_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_transaction_stripeSessionId_key" ON "billing_transaction"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_transaction_stripePaymentIntentId_key" ON "billing_transaction"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "billing_transaction_designId_idx" ON "billing_transaction"("designId");

-- CreateIndex
CREATE INDEX "billing_transaction_userId_idx" ON "billing_transaction"("userId");

-- CreateIndex
CREATE INDEX "billing_transaction_status_idx" ON "billing_transaction"("status");

-- CreateIndex
-- guest_token_key index'i geçmişte db push ile DB'ye eklenmiş ama
-- migration history'de yokmuş; idempotent olarak yarat (yoksa).
CREATE UNIQUE INDEX IF NOT EXISTS "guest_token_key" ON "guest"("token");

-- AddForeignKey
ALTER TABLE "billing_transaction" ADD CONSTRAINT "billing_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_transaction" ADD CONSTRAINT "billing_transaction_designId_fkey" FOREIGN KEY ("designId") REFERENCES "invitation_design"("id") ON DELETE CASCADE ON UPDATE CASCADE;
