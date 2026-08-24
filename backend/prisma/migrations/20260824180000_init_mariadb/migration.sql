-- CreateTable
CREATE TABLE `Media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `originalFileName` TEXT NOT NULL,
    `storedFileName` TEXT NOT NULL,
    `mimeType` TEXT NOT NULL,
    `byteSize` INTEGER NOT NULL,
    `storageKey` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Media_storageKey_key`(`storageKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `companyName` TEXT NOT NULL,
    `companyNameEnglish` TEXT NOT NULL,
    `companyNameArabic` TEXT NULL,
    `email` TEXT NOT NULL,
    `phone` TEXT NOT NULL,
    `whatsApp` TEXT NULL,
    `address` TEXT NULL,
    `logoMediaId` INTEGER NULL,
    `faviconMediaId` INTEGER NULL,
    `placeholderMediaId` INTEGER NULL,
    `primaryColor` VARCHAR(191) NULL,
    `accentColor` VARCHAR(191) NULL,
    `backgroundColor` VARCHAR(191) NULL,
    `textColor` VARCHAR(191) NULL,
    `secondaryColor` VARCHAR(191) NULL,
    `borderColor` VARCHAR(191) NULL,

    UNIQUE INDEX `SiteSettings_logoMediaId_key`(`logoMediaId`),
    UNIQUE INDEX `SiteSettings_faviconMediaId_key`(`faviconMediaId`),
    UNIQUE INDEX `SiteSettings_placeholderMediaId_key`(`placeholderMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `googleMapsUrl` TEXT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `isMapVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationPhone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `phone` TEXT NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `locationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `platform` TEXT NOT NULL,
    `url` TEXT NOT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Partner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `fullDescription` TEXT NULL,
    `specialization` TEXT NULL,
    `websiteUrl` TEXT NULL,
    `country` TEXT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `logoMediaId` INTEGER NULL,

    UNIQUE INDEX `Partner_logoMediaId_key`(`logoMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `description` TEXT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `color` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` TEXT NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `detailedDescription` TEXT NULL,
    `manufacturer` TEXT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `categoryId` INTEGER NOT NULL,
    `partnerId` INTEGER NULL,
    `imageMediaId` INTEGER NULL,

    UNIQUE INDEX `Product_imageMediaId_key`(`imageMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `isVisible` BOOLEAN NOT NULL DEFAULT true,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `imageMediaId` INTEGER NULL,

    UNIQUE INDEX `Service_imageMediaId_key`(`imageMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomePage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `singletonKey` VARCHAR(191) NOT NULL DEFAULT 'default',
    `heroTitle` TEXT NOT NULL,
    `heroDescription` TEXT NOT NULL,
    `heroImageMediaId` INTEGER NULL,
    `primaryCtaText` TEXT NOT NULL,
    `primaryCtaUrl` TEXT NOT NULL,
    `secondaryCtaText` TEXT NOT NULL,
    `secondaryCtaUrl` TEXT NOT NULL,
    `aboutPreviewTitle` TEXT NOT NULL,
    `aboutPreviewDescription` TEXT NOT NULL,
    `aboutPreviewImageMediaId` INTEGER NULL,
    `aboutPreviewCtaText` TEXT NOT NULL,
    `aboutPreviewCtaUrl` TEXT NOT NULL,
    `partnersSectionTitle` TEXT NOT NULL,
    `partnersSectionDescription` TEXT NULL,
    `productsSectionTitle` TEXT NOT NULL,
    `productsSectionDescription` TEXT NULL,
    `servicesSectionTitle` TEXT NOT NULL,
    `servicesSectionDescription` TEXT NULL,
    `whyTitle` TEXT NOT NULL,
    `whyDescription` TEXT NOT NULL,
    `whyEyebrow` TEXT NOT NULL DEFAULT 'Our identity',
    `whyReason1Title` TEXT NOT NULL DEFAULT 'Quality-Certified Portfolio',
    `whyReason1Description` TEXT NOT NULL DEFAULT 'Every product meets rigorous international pharmaceutical and healthcare quality standards.',
    `whyReason2Title` TEXT NOT NULL DEFAULT 'Trusted Global Partnerships',
    `whyReason2Description` TEXT NOT NULL DEFAULT 'Direct distribution agreements with leading European and international manufacturers.',
    `whyReason3Title` TEXT NOT NULL DEFAULT 'Decades of Regional Expertise',
    `whyReason3Description` TEXT NOT NULL DEFAULT 'Established networks and deep market knowledge across the MENA region since our founding.',
    `whyReason4Title` TEXT NOT NULL DEFAULT 'Reliable Supply Chain',
    `whyReason4Description` TEXT NOT NULL DEFAULT 'Consistent product availability backed by efficient logistics and responsive service.',
    `whyImageMediaId` INTEGER NULL,
    `heroEyebrow` TEXT NOT NULL DEFAULT 'FORMULATION / 01 — SYRIA',
    `aboutEyebrow` TEXT NOT NULL DEFAULT 'About us',
    `aboutMetric1Value` TEXT NOT NULL DEFAULT '40+',
    `aboutMetric1Label` TEXT NOT NULL DEFAULT 'Years in healthcare',
    `aboutMetric2Value` TEXT NOT NULL DEFAULT '300+',
    `aboutMetric2Label` TEXT NOT NULL DEFAULT 'Products & equipment',
    `aboutMetric3Value` TEXT NOT NULL DEFAULT '100%',
    `aboutMetric3Label` TEXT NOT NULL DEFAULT 'Syria coverage',
    `contactSectionTitle` TEXT NOT NULL,
    `contactSectionDescription` TEXT NULL,

    UNIQUE INDEX `HomePage_singletonKey_key`(`singletonKey`),
    UNIQUE INDEX `HomePage_heroImageMediaId_key`(`heroImageMediaId`),
    UNIQUE INDEX `HomePage_aboutPreviewImageMediaId_key`(`aboutPreviewImageMediaId`),
    UNIQUE INDEX `HomePage_whyImageMediaId_key`(`whyImageMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `singletonKey` VARCHAR(191) NOT NULL DEFAULT 'default',
    `overview` TEXT NOT NULL,
    `overviewImageMediaId` INTEGER NULL,
    `vision` TEXT NOT NULL,
    `mission` TEXT NOT NULL,
    `values` TEXT NOT NULL,
    `capabilities` TEXT NOT NULL,

    UNIQUE INDEX `AboutPage_singletonKey_key`(`singletonKey`),
    UNIQUE INDEX `AboutPage_overviewImageMediaId_key`(`overviewImageMediaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactInquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fullName` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `phone` TEXT NULL,
    `subject` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `emailDeliveryStatus` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `emailDeliveredAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SiteSettings` ADD CONSTRAINT `SiteSettings_logoMediaId_fkey` FOREIGN KEY (`logoMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteSettings` ADD CONSTRAINT `SiteSettings_faviconMediaId_fkey` FOREIGN KEY (`faviconMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteSettings` ADD CONSTRAINT `SiteSettings_placeholderMediaId_fkey` FOREIGN KEY (`placeholderMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LocationPhone` ADD CONSTRAINT `LocationPhone_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partner` ADD CONSTRAINT `Partner_logoMediaId_fkey` FOREIGN KEY (`logoMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ProductCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `Partner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_imageMediaId_fkey` FOREIGN KEY (`imageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_imageMediaId_fkey` FOREIGN KEY (`imageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomePage` ADD CONSTRAINT `HomePage_heroImageMediaId_fkey` FOREIGN KEY (`heroImageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomePage` ADD CONSTRAINT `HomePage_aboutPreviewImageMediaId_fkey` FOREIGN KEY (`aboutPreviewImageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomePage` ADD CONSTRAINT `HomePage_whyImageMediaId_fkey` FOREIGN KEY (`whyImageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AboutPage` ADD CONSTRAINT `AboutPage_overviewImageMediaId_fkey` FOREIGN KEY (`overviewImageMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

