-- CreateTable
CREATE TABLE "public"."HomePage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'default',
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "heroImageMediaId" INTEGER,
    "primaryCtaText" TEXT NOT NULL,
    "primaryCtaUrl" TEXT NOT NULL,
    "secondaryCtaText" TEXT NOT NULL,
    "secondaryCtaUrl" TEXT NOT NULL,
    "aboutPreviewTitle" TEXT NOT NULL,
    "aboutPreviewDescription" TEXT NOT NULL,
    "aboutPreviewImageMediaId" INTEGER,
    "aboutPreviewCtaText" TEXT NOT NULL,
    "aboutPreviewCtaUrl" TEXT NOT NULL,
    "partnersSectionTitle" TEXT NOT NULL,
    "partnersSectionDescription" TEXT,
    "productsSectionTitle" TEXT NOT NULL,
    "productsSectionDescription" TEXT,
    "servicesSectionTitle" TEXT NOT NULL,
    "servicesSectionDescription" TEXT,
    "whyTitle" TEXT NOT NULL,
    "whyDescription" TEXT NOT NULL,
    "whyImageMediaId" INTEGER,
    "contactSectionTitle" TEXT NOT NULL,
    "contactSectionDescription" TEXT,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutPage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "singletonKey" TEXT NOT NULL DEFAULT 'default',
    "overview" TEXT NOT NULL,
    "overviewImageMediaId" INTEGER,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "values" TEXT NOT NULL,
    "capabilities" TEXT NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_singletonKey_key" ON "public"."HomePage"("singletonKey");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_heroImageMediaId_key" ON "public"."HomePage"("heroImageMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_aboutPreviewImageMediaId_key" ON "public"."HomePage"("aboutPreviewImageMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_whyImageMediaId_key" ON "public"."HomePage"("whyImageMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "AboutPage_singletonKey_key" ON "public"."AboutPage"("singletonKey");

-- CreateIndex
CREATE UNIQUE INDEX "AboutPage_overviewImageMediaId_key" ON "public"."AboutPage"("overviewImageMediaId");

-- AddForeignKey
ALTER TABLE "public"."HomePage" ADD CONSTRAINT "HomePage_heroImageMediaId_fkey" FOREIGN KEY ("heroImageMediaId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HomePage" ADD CONSTRAINT "HomePage_aboutPreviewImageMediaId_fkey" FOREIGN KEY ("aboutPreviewImageMediaId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HomePage" ADD CONSTRAINT "HomePage_whyImageMediaId_fkey" FOREIGN KEY ("whyImageMediaId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutPage" ADD CONSTRAINT "AboutPage_overviewImageMediaId_fkey" FOREIGN KEY ("overviewImageMediaId") REFERENCES "public"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
