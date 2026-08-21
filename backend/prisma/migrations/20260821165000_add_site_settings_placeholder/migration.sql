-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "placeholderMediaId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_placeholderMediaId_key" ON "SiteSettings"("placeholderMediaId");

-- AddForeignKey
ALTER TABLE "SiteSettings" ADD CONSTRAINT "SiteSettings_placeholderMediaId_fkey" FOREIGN KEY ("placeholderMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
