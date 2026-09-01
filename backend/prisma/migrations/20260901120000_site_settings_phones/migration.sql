-- CreateTable
CREATE TABLE `SiteSettingsPhone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `label` TEXT NOT NULL,
    `phone` TEXT NOT NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `siteSettingsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SiteSettingsPhone` ADD CONSTRAINT `SiteSettingsPhone_siteSettingsId_fkey` FOREIGN KEY (`siteSettingsId`) REFERENCES `SiteSettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing main phone as a labeled Primary number
INSERT INTO `SiteSettingsPhone` (`createdAt`, `updatedAt`, `label`, `phone`, `displayOrder`, `siteSettingsId`)
SELECT CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), 'Primary', `phone`, 0, `id`
FROM `SiteSettings`;
