-- AlterTable: add dynamic section-label and content fields to HomePage
ALTER TABLE "HomePage"
  ADD COLUMN "heroEyebrow"           TEXT NOT NULL DEFAULT 'FORMULATION / 01 — SYRIA',
  ADD COLUMN "whyEyebrow"            TEXT NOT NULL DEFAULT 'Our identity',
  ADD COLUMN "whyReason1Title"       TEXT NOT NULL DEFAULT 'Quality-Certified Portfolio',
  ADD COLUMN "whyReason1Description" TEXT NOT NULL DEFAULT 'Every product meets rigorous international pharmaceutical and healthcare quality standards.',
  ADD COLUMN "whyReason2Title"       TEXT NOT NULL DEFAULT 'Trusted Global Partnerships',
  ADD COLUMN "whyReason2Description" TEXT NOT NULL DEFAULT 'Direct distribution agreements with leading European and international manufacturers.',
  ADD COLUMN "whyReason3Title"       TEXT NOT NULL DEFAULT 'Decades of Regional Expertise',
  ADD COLUMN "whyReason3Description" TEXT NOT NULL DEFAULT 'Established networks and deep market knowledge across the MENA region since our founding.',
  ADD COLUMN "whyReason4Title"       TEXT NOT NULL DEFAULT 'Reliable Supply Chain',
  ADD COLUMN "whyReason4Description" TEXT NOT NULL DEFAULT 'Consistent product availability backed by efficient logistics and responsive service.',
  ADD COLUMN "aboutEyebrow"          TEXT NOT NULL DEFAULT 'About us',
  ADD COLUMN "aboutMetric1Value"     TEXT NOT NULL DEFAULT '40+',
  ADD COLUMN "aboutMetric1Label"     TEXT NOT NULL DEFAULT 'Years in healthcare',
  ADD COLUMN "aboutMetric2Value"     TEXT NOT NULL DEFAULT '300+',
  ADD COLUMN "aboutMetric2Label"     TEXT NOT NULL DEFAULT 'Products & equipment',
  ADD COLUMN "aboutMetric3Value"     TEXT NOT NULL DEFAULT '100%',
  ADD COLUMN "aboutMetric3Label"     TEXT NOT NULL DEFAULT 'Syria coverage';
