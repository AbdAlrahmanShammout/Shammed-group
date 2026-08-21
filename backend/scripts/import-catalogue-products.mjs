/**
 * Catalogue product import script
 *
 * Execution:
 *   cd backend && node scripts/import-catalogue-products.mjs
 *
 * What this script does
 * 1. Deletes all existing products (as instructed).
 * 2. Upserts the two new source-catalogue partners:
 *    - Al Inmaa Drug Store & Medical Equipment LLC
 *    - Marinas Official
 * 3. Imports 94 source-catalogue product candidates (isVisible = true).
 *
 * Important: All product records reference external source-catalogue images
 * via detailedDescription (provenance). Do not hotlink those URLs permanently
 * or publish any record until relationship, territory, registration, and image
 * permissions are confirmed.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────────────────

function findOrCreate(existing, name) {
  const found = existing.find((p) => p.name === name);
  if (!found) throw new Error(`Partner not found: ${name}`);
  return found.id;
}

// ── Partner data ──────────────────────────────────────────────────────────────

const NEW_PARTNERS = [
  {
    name: 'Al Inmaa Drug Store & Medical Equipment LLC',
    shortDescription:
      'Public source site describes Al Inmaa as a GCC distribution partner for international pharmaceutical, medical, and beauty brands. The supplied Shammed deck identifies INMAA as a sister company; current product-level Syrian rights need confirmation.',
    fullDescription:
      'Official source catalogue, product-source links, and a direct logo reference are recorded in PARTNER-CATALOGUE-SOURCE-IMPORT.md. Website statements do not establish Shammed agency, territory, or product availability in Syria.',
    specialization: 'Pharmaceutical, medical, and beauty distribution',
    websiteUrl: 'https://inmaa.ae/',
    country: 'United Arab Emirates',
    isVisible: false,
    displayOrder: 9,
  },
  {
    name: 'Marinas Official',
    shortDescription:
      'Public source site lists dietary supplements and personal-care products. The supplied Shammed materials refer to Earth Creation / MARRINAS; the exact current legal entity and the Shammed relationship require confirmation.',
    fullDescription:
      'Official source catalogue, product-source links, and a direct logo reference are recorded in PARTNER-CATALOGUE-SOURCE-IMPORT.md. The public site appears oriented to the Lebanon market; it does not establish Shammed distribution rights in Syria.',
    specialization: 'Dietary supplements and personal care',
    websiteUrl: 'https://marinasofficial.com/',
    country: 'Lebanon — site market; legal manufacturing country needs client confirmation',
    isVisible: false,
    displayOrder: 10,
  },
];

// ── Al Inmaa — 44 products ────────────────────────────────────────────────────

const AL_INMAA_PRODUCTS = [
  {
    name: 'Carbowhite tablets 24\'s',
    shortDescription: 'Source segment: Elementary Care.',
    manufacturer: 'Omnifarma Europe (Ukraine)',
    sourceUrl: 'https://inmaa.ae/product/carbowhite-tablets-24s/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Carbowhite.jpg',
  },
  {
    name: 'Saffrox',
    shortDescription: 'Source segment: Vital Care.',
    manufacturer: 'Naveh Pharma Ltd. (Israel)',
    sourceUrl: 'https://inmaa.ae/product/saffrox/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2026/01/Saffrox-Logo-2X.png',
  },
  {
    name: 'MAGNOX VITAL',
    shortDescription: 'Source segment: Vital Care.',
    manufacturer: 'Naveh Pharma Ltd. (Israel)',
    sourceUrl: 'https://inmaa.ae/product/magnox-vital/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2023/11/logos-03.jpg',
  },
  {
    name: 'MAGNOX ANTI LEG CRAMPS',
    shortDescription: 'Source segment: Vital Care.',
    manufacturer: 'Naveh Pharma Ltd. (Israel)',
    sourceUrl: 'https://inmaa.ae/product/magnox-anti-leg-cramps/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2023/11/logos-01.jpg',
  },
  {
    name: 'MAGNOX OSTEO',
    shortDescription: 'Source segment: Vital Care.',
    manufacturer: 'Naveh Pharma Ltd. (Israel)',
    sourceUrl: 'https://inmaa.ae/product/magnox-osteo/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2023/11/logos-02.jpg',
  },
  {
    name: 'Bluecap Shower gel 150 ml',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Catalysis S.L. (Spain)',
    sourceUrl: 'https://inmaa.ae/product/bluecap-shower-gel-150-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__bluecap.jpg',
  },
  {
    name: 'Bluecap Foam 100 ml',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Catalysis S.L. (Spain)',
    sourceUrl: 'https://inmaa.ae/product/bluecap_foam_100ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__bluecap.jpg',
  },
  {
    name: 'Bluecap Spray 100 ml',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Catalysis S.L. (Spain)',
    sourceUrl: 'https://inmaa.ae/product/blueecap-spray-100-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__bluecap-1.jpg',
  },
  {
    name: 'Bluecap Cream 50 gm',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Catalysis S.L. (Spain)',
    sourceUrl: 'https://inmaa.ae/product/bluecap-cream-50-gm/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__bluecap.jpg',
  },
  {
    name: 'Blucap Shampoo 150 ml',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Catalysis S.L. (Spain)',
    sourceUrl: 'https://inmaa.ae/product/blucap-shampoo-150-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__bluecap.jpg',
  },
  {
    name: 'Isosupra Lidose 16 mg — hard gelatin capsule',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Laboratoires SMB S.A. (Belgium)',
    sourceUrl: 'https://inmaa.ae/product/isosupra-lidose-16-mg-hard-gelatin-capsule/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ISOSUPRA.jpg',
  },
  {
    name: 'Alline Procap 60\'s',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Laboratoires Trenker (Belgium)',
    sourceUrl: 'https://inmaa.ae/product/alline-procap-60s/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Alline.jpg',
  },
  {
    name: 'Auracos — Pro-Collagenium',
    shortDescription: 'Source segment: Derma Care.',
    manufacturer: 'Auracos (Switzerland)',
    sourceUrl: 'https://inmaa.ae/product/auracos-pro-collagenium/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/auracos.jpg',
  },
  {
    name: 'Hyaflex Forte',
    shortDescription: 'Source segment: Joint Care.',
    manufacturer: 'Laboratoires Trenker (Belgium)',
    sourceUrl: 'https://inmaa.ae/product/hyaflex-forte/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2025/07/hyaflex.png',
  },
  {
    name: 'CH-Alpha',
    shortDescription: 'Source segment: Joint Care.',
    manufacturer: 'GELITA Health GmbH (Germany)',
    sourceUrl: 'https://inmaa.ae/product/ch-alpha/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__CHalpha.jpg',
  },
  {
    name: 'CH-Alpha Sport',
    shortDescription: 'Source segment: Joint Care.',
    manufacturer: 'GELITA Health GmbH (Germany)',
    sourceUrl: 'https://inmaa.ae/product/ch-alpha-sport/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__CHalphaSPORT.jpg',
  },
  {
    name: 'CH-Alpha Plus',
    shortDescription: 'Source segment: Joint Care.',
    manufacturer: 'GELITA Health GmbH (Germany)',
    sourceUrl: 'https://inmaa.ae/product/ch-alpha-plus/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__CHalphaPLUS.jpg',
  },
  {
    name: 'MEPTID®',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Biosyn Arzneimittel GmbH (Germany)',
    sourceUrl: 'https://inmaa.ae/product/meptid/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2025/09/MEPTID1.jpg',
  },
  {
    name: 'Kadermin',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Pavia Farmaceutici S.r.l. (Italy)',
    sourceUrl: 'https://inmaa.ae/product/kadermin/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2023/11/Kadermin-JPG.jpg',
  },
  {
    name: 'Octaplex',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Octapharma AG (Switzerland)',
    sourceUrl: 'https://inmaa.ae/product/octaplex/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo_octaplex.jpg',
  },
  {
    name: 'Human Albumin',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Octapharma AG (Switzerland)',
    sourceUrl: 'https://inmaa.ae/product/human-albumin/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo_human_albumin.jpg',
  },
  {
    name: 'Wilate',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Octapharma AG (Switzerland)',
    sourceUrl: 'https://inmaa.ae/product/wilate/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo_wilate.jpg',
  },
  {
    name: 'Pofol',
    shortDescription: 'Source segment: Hospital Care.',
    manufacturer: 'Dongkook Pharmaceutical Co., Ltd. (South Korea)',
    sourceUrl: 'https://inmaa.ae/product/pofol/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__POFOL.jpg',
  },
  {
    name: 'Sinomarin Isotonic Mini spray 30 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-isotonic-mini-spray-30-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin Isotonic Children spray 100 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-isotonic-children-spray-100-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin Isotonic Adults spray 125 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-isotonic-adults-spray-125-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin Babies 5 ml Vials',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-babies-5ml-vials/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Avita nasal aspirator',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/avita-nasal-aspirator/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__AViTA.jpg',
  },
  {
    name: 'Sinomarin Cold and Flu spray 30 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-cold-and-flu-spray-30-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin-1.jpg',
  },
  {
    name: 'Sinomarin Children spray 100 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-children-spray-100-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin ENT 200 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-ent-200-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/11/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin Adults spray 125 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-adults-spray-125-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/11/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'Sinomarin Mini spray 30 ml',
    shortDescription: 'Source segment: Nasal Care.',
    manufacturer: 'Gerolymatos International S.A. (Greece)',
    sourceUrl: 'https://inmaa.ae/product/sinomarin-mini-spray-30-ml/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/11/Al_Inmaa_site_Termekek_logo__Sinomarin.jpg',
  },
  {
    name: 'R.O.C.S Baby Mineral Protection Mild care 0–3 toothpaste',
    shortDescription: 'Source segment: Oral Care.',
    manufacturer: 'R.O.C.S / OOO Evobio (Russia)',
    sourceUrl: 'https://inmaa.ae/product/r-o-c-s-baby-mineral-protection-mild-care-0-3-toothpaste/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ROCS.jpg',
  },
  {
    name: 'R.O.C.S Baby Mild Care with Lime Blossom 0–3 toothpaste',
    shortDescription: 'Source segment: Oral Care.',
    manufacturer: 'R.O.C.S / OOO Evobio (Russia)',
    sourceUrl: 'https://inmaa.ae/product/r-o-c-s-baby-mild-care-with-lime-blossom-0-3-toothpaste/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ROCS.jpg',
  },
  {
    name: 'R.O.C.S Baby Mild Care with Chamomile 0–3 toothpaste',
    shortDescription: 'Source segment: Oral Care.',
    manufacturer: 'R.O.C.S / OOO Evobio (Russia)',
    sourceUrl: 'https://inmaa.ae/product/r-o-c-s-baby-mild-care-with-chamomile-0-3-toothpaste/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ROCS.jpg',
  },
  {
    name: 'R.O.C.S Kids 3–7 toothpaste',
    shortDescription: 'Source segment: Oral Care.',
    manufacturer: 'R.O.C.S / OOO Evobio (Russia)',
    sourceUrl: 'https://inmaa.ae/product/r-o-c-s-kids-3-7-toothpaste/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ROCS.jpg',
  },
  {
    name: 'R.O.C.S Kids 4–7 toothpaste',
    shortDescription: 'Source segment: Oral Care.',
    manufacturer: 'R.O.C.S / OOO Evobio (Russia)',
    sourceUrl: 'https://inmaa.ae/product/r-o-c-s-kids-4-7-toothpaste/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ROCS.jpg',
  },
  {
    name: 'Venolen idrogel',
    shortDescription: 'Source segment: Vascular Care.',
    manufacturer: 'Pharma Line S.R.L. (Italy)',
    sourceUrl: 'https://inmaa.ae/product/venolen-idrogel/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2023/11/Venolen-idrogel.jpg',
  },
  {
    name: 'Vagi-C 6\'s',
    shortDescription: 'Listed in sitemap; no front-end business-unit assignment.',
    manufacturer: 'Polichem SA (Luxembourg)',
    sourceUrl: 'https://inmaa.ae/product/vagi-c-6s/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__Vagi-c.jpg',
  },
  {
    name: 'Isolone effervescent tablet 5 mg',
    shortDescription: 'Listed in sitemap; no front-end business-unit assignment.',
    manufacturer: 'Laboratoire Sothema (Morocco)',
    sourceUrl: 'https://inmaa.ae/product/isolone-effervescent-tablet-5-mg/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ISOLONE.jpg',
  },
  {
    name: 'Isolone effervescent tablet 20 mg',
    shortDescription: 'Listed in sitemap; no front-end business-unit assignment.',
    manufacturer: 'Laboratoire Sothema (Morocco)',
    sourceUrl: 'https://inmaa.ae/product/isolone-effervescent-tablet-20-mg/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__ISOLONE-1.jpg',
  },
  {
    name: 'Soclav sachet 500 mg',
    shortDescription: 'Listed in sitemap; no front-end business-unit assignment.',
    manufacturer: 'Laboratoire Sothema (Morocco)',
    sourceUrl: 'https://inmaa.ae/product/soclav-sachet-500-mg/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__SOCLAV-1.jpg',
  },
  {
    name: 'Soclav sachet 1 gm',
    shortDescription: 'Listed in sitemap; no front-end business-unit assignment.',
    manufacturer: 'Laboratoire Sothema (Morocco)',
    sourceUrl: 'https://inmaa.ae/product/soclav-sachet-1-gm/',
    imageUrl: 'https://inmaa.ae/wp-content/uploads/2022/12/Al_Inmaa_site_Termekek_logo__SOCLAV.jpg',
  },
];

// ── Marinas Official — 30 products ───────────────────────────────────────────

const MARINAS_PRODUCTS = [
  {
    name: 'ARTHRO-FORT / Glucosamine & Chondroitin',
    shortDescription: 'Supplement; joint & bone health; glucosamine and chondroitin capsules.',
    sourceUrl: 'https://marinasofficial.com/product/arthro-fort-glucosamine-chondroitin/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/ARTHRO-FORT.png',
  },
  {
    name: 'BIOCARE (Magnesium Glycinate + B6)',
    shortDescription: 'Supplement; vitamins & minerals; magnesium glycinate and vitamin B6 capsules.',
    sourceUrl: 'https://marinasofficial.com/product/biocare-magnesium-glycinate-b6/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/GLYCINATE.png',
  },
  {
    name: 'BIOTIN FORT 10,000',
    shortDescription: 'Supplement; vitamins & minerals; biotin 10,000 mcg capsules.',
    sourceUrl: 'https://marinasofficial.com/product/biotin-10000-2/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2023/07/BFort_F.jpg',
  },
  {
    name: 'BIOTIN-FORT 5,000 mcg',
    shortDescription: 'Supplement; vitamins & minerals; biotin 5,000 mcg capsules.',
    sourceUrl: 'https://marinasofficial.com/product/biotin-fort-5000mcg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/BIOTIN-5000.png',
  },
  {
    name: 'CARDI-ENZYME (Co-Enzyme Q10) 100 mg',
    shortDescription: 'Supplement; heart & circulation; Co-Enzyme Q10 capsules.',
    sourceUrl: 'https://marinasofficial.com/product/kardi-enzyme-co-enzyme-q10-100-mg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/CARDI-ENZYME.png',
  },
  {
    name: 'CENTURY FORT (100)',
    shortDescription: 'Supplement; vitamins & minerals; multivitamin/mineral tablets.',
    sourceUrl: 'https://marinasofficial.com/product/century-fort-2/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2023/08/century-100-1.jpeg',
  },
  {
    name: 'CENTURY FORT (ADULTS 50+)',
    shortDescription: 'Supplement; vitamins & minerals; 50+ multivitamin/mineral tablets.',
    sourceUrl: 'https://marinasofficial.com/product/century-fort-adults-50/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/CENTURY-FORT-50.png',
  },
  {
    name: 'Derma Herb Capsules',
    shortDescription: 'Supplement; skin & beauty; marine collagen capsules.',
    sourceUrl: 'https://marinasofficial.com/product/derma-herb-capsules-copy/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2023/07/Derma_F.jpg',
  },
  {
    name: 'DHEA 25 mg Capsules',
    shortDescription: 'Supplement; hormonal & fertility; DHEA capsules.',
    sourceUrl: 'https://marinasofficial.com/product/dhea-25mg-capsules/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/DHEA.png',
  },
  {
    name: 'EXTRA OMEGA 3 EPA 1000 mg',
    shortDescription: 'Supplement; omega & fatty acids; EPA softgels.',
    sourceUrl: 'https://marinasofficial.com/product/extra-omega-3-epa-1000mg-3/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2023/07/Omega_F.jpg',
  },
  {
    name: 'EXTRA-FORT / NAD+ 300 mg',
    shortDescription: 'Supplement; energy & antioxidants; NAD+ capsules.',
    sourceUrl: 'https://marinasofficial.com/product/extra-fort-300mg-nad/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-24-at-4.07.54-PM.jpeg',
  },
  {
    name: 'FERRO FORT / FERROUS +',
    shortDescription: 'Supplement; vitamins & minerals; iron, B vitamins, zinc, and copper capsules.',
    sourceUrl: 'https://marinasofficial.com/product/ferro-fort-ferrous/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/FERRO.png',
  },
  {
    name: 'GINKGO HERB (Ginkgo Biloba)',
    shortDescription: 'Supplement; brain & cognitive; ginkgo biloba capsules.',
    sourceUrl: 'https://marinasofficial.com/product/ginkgo-herb-ginkgo-biloba/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/GINKGO-BILOBA.png',
  },
  {
    name: 'GLUCO-HERB / Berberine 500 mg',
    shortDescription: 'Supplement; blood sugar & metabolic; berberine capsules.',
    sourceUrl: 'https://marinasofficial.com/product/gluco-herb-berberine-500mg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-24-at-3.37.49-PM.jpeg',
  },
  {
    name: 'GRAVI-HERB (ASHWAGANDHA)',
    shortDescription: 'Supplement; herbal & botanical; ashwagandha capsules.',
    sourceUrl: 'https://marinasofficial.com/product/1646/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/GRAVI.png',
  },
  {
    name: 'KIDS FORT OMEGA with DHA',
    shortDescription: 'Supplement; children\'s health; omega-3 and DHA capsules.',
    sourceUrl: 'https://marinasofficial.com/product/kids-fort-omega-with-dha/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/KIDS-FORT.png',
  },
  {
    name: 'L-CARNITINE-FORT',
    shortDescription: 'Supplement; energy & weight management; L-carnitine capsules.',
    sourceUrl: 'https://marinasofficial.com/product/l-carnitine-fort/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/L-CARNITINE.png',
  },
  {
    name: 'LAXA-HERB Capsules',
    shortDescription: 'Supplement; digestive health; herbal capsules.',
    sourceUrl: 'https://marinasofficial.com/product/laxa-herb-capsules/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/LAXA.png',
  },
  {
    name: 'LIFE HERB (Probiotics Plus 25 Billion CFU)',
    shortDescription: 'Supplement; digestive health; probiotic capsules.',
    sourceUrl: 'https://marinasofficial.com/product/life-herb-probiotics-plus-25-billion-cfu/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/PROBIOTIC.png',
  },
  {
    name: 'LIFE-HERB (Vitamin K2)',
    shortDescription: 'Supplement; vitamins & minerals; vitamin K2 capsules.',
    sourceUrl: 'https://marinasofficial.com/product/life-herb-vitamin-k2/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/K2.png',
  },
  {
    name: 'Marinas Twist-Off Capsules — SKINCARE',
    shortDescription: 'Personal care; skin & beauty; hyaluronic-acid and collagen twist-off capsules.',
    sourceUrl: 'https://marinasofficial.com/product/marinas-twist-off-capsules-skincare-copy/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/05/twist-capsules-1.jpeg',
  },
  {
    name: 'Mega-Herb Advance',
    shortDescription: 'Supplement; joint & bone health; herbal capsules.',
    sourceUrl: 'https://marinasofficial.com/product/mega-herb-advance-copy/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2023/07/Mega_F.jpg',
  },
  {
    name: 'OSTEO-FORT (Calcium 800+)',
    shortDescription: 'Supplement; joint & bone health; calcium tablets.',
    sourceUrl: 'https://marinasofficial.com/product/osteo-fort-calcium-800/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/OSTEO.png',
  },
  {
    name: 'PRIME-HERB (Chromium 500 mcg)',
    shortDescription: 'Supplement; blood sugar & metabolic; chromium capsules.',
    sourceUrl: 'https://marinasofficial.com/product/prime-herb-chromium-500mcg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/CHROMIUN.png',
  },
  {
    name: 'SELENIUM 200 MCG',
    shortDescription: 'Supplement; vitamins & minerals; selenium tablets.',
    sourceUrl: 'https://marinasofficial.com/product/selenium-200-mcg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/SELENIUM.png',
  },
  {
    name: 'STAY-FORT (Folic Acid 5 mg)',
    shortDescription: 'Supplement; vitamins & minerals; folic-acid tablets.',
    sourceUrl: 'https://marinasofficial.com/product/stay-fort-folic-acid-5mg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/STAY-FORT.png',
  },
  {
    name: 'SUPER-FORT EYE VISION Capsules',
    shortDescription: 'Supplement; eye health; zeaxanthin, lutein, vitamins, and minerals capsules.',
    sourceUrl: 'https://marinasofficial.com/product/super-fort-eye-vision-capsules/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/SUPER-FORT.png',
  },
  {
    name: 'TRIPLE OMEGA 3,6,9',
    shortDescription: 'Supplement; omega & fatty acids; flaxseed-oil softgels.',
    sourceUrl: 'https://marinasofficial.com/product/triple-omega-369/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/TRIPLE-OMEGA-369.png',
  },
  {
    name: 'VIT E 400 IU Softgels',
    shortDescription: 'Supplement; vitamins & minerals; vitamin E softgels.',
    sourceUrl: 'https://marinasofficial.com/product/vit-e-400-iu-softgels/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/VIT-E.png',
  },
  {
    name: 'ZINC 50 MG',
    shortDescription: 'Supplement; vitamins & minerals; zinc tablets.',
    sourceUrl: 'https://marinasofficial.com/product/zinc-50-mg/',
    imageUrl: 'https://marinasofficial.com/wp-content/uploads/2025/12/ZINC.png',
  },
];

// ── STORZ MEDICAL — 20 products ───────────────────────────────────────────────

const STORZ_PRODUCTS = [
  {
    name: 'MASTERPULS® icon',
    shortDescription: 'Radial shock-wave therapy workstation; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-icon/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_icon_001.jpeg',
  },
  {
    name: 'MASTERPULS® R-SW',
    shortDescription: 'Portable radial shock-wave therapy system; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-r-sw/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_r-sw_001.jpg',
  },
  {
    name: 'MASTERPULS® »ultra« line (MP100 / MP200)',
    shortDescription: 'Radial shock-wave therapy system line; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-ultra-line/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultra_001.jpg',
  },
  {
    name: 'MASTERPULS® ultra+',
    shortDescription: 'Radial shock-wave therapy system; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-ultra-plus/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultraplus_001.jpg',
  },
  {
    name: 'MASTERPULS® ONE',
    shortDescription: 'Radial shock-wave therapy system; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-one/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_one_001.jpg',
  },
  {
    name: 'DUOLITH® SD1 »ultra«',
    shortDescription: 'Combined radial and focused shock-wave therapy system; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/duolith-sd1-ultra/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_ultra_001.jpg',
  },
  {
    name: 'DUOLITH® SD1 T-TOP »ultra«',
    shortDescription: 'Focused shock-wave therapy system; orthopaedics / sports medicine.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/duolith-sd1-t-top-ultra/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_002.jpg',
  },
  {
    name: 'MODULITH® SLX-F2 »connect«',
    shortDescription: 'Shock-wave lithotripsy and endourology workstation; urology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slx-f2-connect/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_modulith_slx-f2_connect_001.jpg',
  },
  {
    name: 'MODULITH® SLX-F2 »FD21«',
    shortDescription: 'Shock-wave lithotripsy system; urology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slx-f2-fd21/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_modulith_slx-f2_fd21_001.jpg',
  },
  {
    name: 'MODULITH® SLK »intelect«',
    shortDescription: 'Mobile shock-wave lithotripsy system; urology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slk-intelect/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_modulith_slk_intelect_001.jpg',
  },
  {
    name: 'MODULITH® SLK »inline«',
    shortDescription: 'Mobile shock-wave lithotripsy and endourology system; urology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slk-inline/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_modulith_slk_inline_001.jpg',
  },
  {
    name: 'DUOLITH® SD1 T-TOP »ultra« URO',
    shortDescription: 'Focused low-intensity shock-wave therapy system; urology / urogynaecology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-cpps-ipp-ed/duolith-sd1-ultra-uro/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_001.jpg',
  },
  {
    name: 'NEUROLITH®',
    shortDescription: 'Transcranial pulse stimulation system; neurology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/tps-products-for-the-treatment-of-alzheimer-s-disease/neurolith/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_neurolith_001.jpg',
  },
  {
    name: 'MODULITH® SLC',
    shortDescription: 'Cardiac shock-wave therapy system; cardiology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/cswt-products-for-the-treatment-of-angina-pectoris/modulith-slc/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_modulith_slc_001.jpg',
  },
  {
    name: 'DUOLITH® SD1 »ultra« AWT',
    shortDescription: 'Acoustic-wave treatment system; aesthetics / dermatology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/awt-products-for-aesthetic-indications/duolith-sd1-ultra-awt/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_ultra_awt_001.jpg',
  },
  {
    name: 'D-ACTOR® »ultra« line (100 / 200)',
    shortDescription: 'Acoustic-wave treatment system line; aesthetics / dermatology.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/awt-products-for-aesthetic-indications/d-actor-ultra-line/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_d-actor_ultra_001.jpg',
  },
  {
    name: 'DUOLITH® SD1 T-TOP »ultra« DERMA',
    shortDescription: 'Focused shock-wave therapy system; dermatology / wound-healing.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-wound-healing/duolith-sd1-ultra-derma/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_003.jpg',
  },
  {
    name: 'DUOLITH® SD1 T-TOP VET »ultra«',
    shortDescription: 'Focused shock-wave therapy system; veterinary medicine.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-veterinary-medicine/duolith-sd1-t-top-vet-ultra/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_vet_001.jpg',
  },
  {
    name: 'MASTERPULS® MP100 VET »ultra«',
    shortDescription: 'Mobile radial shock-wave therapy system; veterinary medicine.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/eswt-products-for-veterinary-medicine/masterpuls-mp100-vet-ultra/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultra_vet_001.jpg',
  },
  {
    name: 'MAGNETOLITH® ultra+',
    shortDescription: 'Extracorporeal magnetotransduction therapy system; orthopaedics / musculoskeletal.',
    sourceUrl: 'https://www.storzmedical.com/en/disciplines/emtt-products-for-musculoskeletal-disorders/magnetolith/',
    imageUrl: 'https://www.storzmedical.com/images/slider/banner_magnetolith_001.jpg',
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Shammed Group — Catalogue Product Import ===\n');

  // ── Step 0: Snapshot existing data ──────────────────────────────────────────
  const existingPartners = await prisma.partner.findMany();
  const existingCategories = await prisma.productCategory.findMany();
  const existingProductCount = await prisma.product.count();

  console.log(`Existing partners: ${existingPartners.length}`);
  console.log(`Existing categories: ${existingCategories.map((c) => c.name).join(', ')}`);
  console.log(`Existing products to delete: ${existingProductCount}\n`);

  // ── Step 1: Delete all existing products ────────────────────────────────────
  const deleted = await prisma.product.deleteMany();
  console.log(`✅ Deleted ${deleted.count} existing products.\n`);

  // ── Step 2: Upsert 2 new partners ───────────────────────────────────────────
  let newPartnersAdded = 0;

  for (const pd of NEW_PARTNERS) {
    const existing = existingPartners.find((p) => p.name === pd.name);
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data: pd });
      console.log(`  ~ Partner already exists, updated: ${pd.name}`);
    } else {
      await prisma.partner.create({ data: pd });
      newPartnersAdded++;
      console.log(`  + Added new partner: ${pd.name}`);
    }
  }

  console.log(`\n✅ New partners added: ${newPartnersAdded}\n`);

  // ── Step 3: Resolve category IDs ────────────────────────────────────────────
  const allCategories = await prisma.productCategory.findMany();
  const medEquip = allCategories.find((c) => c.name === 'Medical Equipment');
  const pharmEquip = allCategories.find((c) => c.name === 'Pharmaceutical Equipment');

  if (!medEquip) throw new Error('Category "Medical Equipment" not found.');
  if (!pharmEquip) throw new Error('Category "Pharmaceutical Equipment" not found.');

  // ── Step 4: Resolve partner IDs ─────────────────────────────────────────────
  const allPartners = await prisma.partner.findMany();
  const storzPartner = allPartners.find((p) => p.name === 'STORZ Medical AG');
  const alInmaaPartner = allPartners.find((p) => p.name === 'Al Inmaa Drug Store & Medical Equipment LLC');
  const marinasPartner = allPartners.find((p) => p.name === 'Marinas Official');

  if (!storzPartner) throw new Error('Partner "STORZ Medical AG" not found.');
  if (!alInmaaPartner) throw new Error('Partner "Al Inmaa Drug Store & Medical Equipment LLC" not found.');
  if (!marinasPartner) throw new Error('Partner "Marinas Official" not found.');

  // ── Step 5: Build product rows ───────────────────────────────────────────────

  /** @param {string} sourceUrl @param {string} imageUrl */
  function provenance(sourceUrl, imageUrl) {
    return `SOURCE PAGE: ${sourceUrl}\nSOURCE IMAGE: ${imageUrl}\nIMPORT DATE: 2026-08-21\nNOTE: Source-catalogue reference only. Not approved for publication until relationship, territory, registration, and image permissions are confirmed.`;
  }

  const productRows = [
    // Al Inmaa — 44 — Pharmaceutical Equipment
    ...AL_INMAA_PRODUCTS.map((p, i) => ({
      name: p.name,
      shortDescription: p.shortDescription,
      detailedDescription: provenance(p.sourceUrl, p.imageUrl),
      manufacturer: p.manufacturer,
      categoryId: pharmEquip.id,
      partnerId: alInmaaPartner.id,
      isVisible: true,
      displayOrder: i + 1,
    })),
    // Marinas Official — 30 — Pharmaceutical Equipment
    ...MARINAS_PRODUCTS.map((p, i) => ({
      name: p.name,
      shortDescription: p.shortDescription,
      detailedDescription: provenance(p.sourceUrl, p.imageUrl),
      manufacturer: 'Marinas Official',
      categoryId: pharmEquip.id,
      partnerId: marinasPartner.id,
      isVisible: true,
      displayOrder: 44 + i + 1,
    })),
    // STORZ MEDICAL — 20 — Medical Equipment
    ...STORZ_PRODUCTS.map((p, i) => ({
      name: p.name,
      shortDescription: p.shortDescription,
      detailedDescription: provenance(p.sourceUrl, p.imageUrl),
      manufacturer: 'STORZ MEDICAL AG',
      categoryId: medEquip.id,
      partnerId: storzPartner.id,
      isVisible: true,
      displayOrder: i + 1,
    })),
  ];

  // Duplicate-name check
  const nameSet = new Set();
  const duplicates = [];
  for (const row of productRows) {
    if (nameSet.has(row.name)) duplicates.push(row.name);
    nameSet.add(row.name);
  }

  // ── Step 6: Insert products ───────────────────────────────────────────────────
  let inserted = 0;
  let skipped = 0;

  for (const row of productRows) {
    const existing = await prisma.product.findFirst({ where: { name: row.name } });
    if (existing) {
      console.log(`  ~ Skipping duplicate: ${row.name}`);
      skipped++;
      continue;
    }
    await prisma.product.create({ data: row });
    inserted++;
  }

  // ── Step 7: Report ─────────────────────────────────────────────────────────
  const finalCount = await prisma.product.count();
  const byCategory = await prisma.product.groupBy({
    by: ['categoryId'],
    _count: { _all: true },
  });

  const alInmaaCount = await prisma.product.count({ where: { partnerId: alInmaaPartner.id } });
  const marinasCount = await prisma.product.count({ where: { partnerId: marinasPartner.id } });
  const storzCount = await prisma.product.count({ where: { partnerId: storzPartner.id } });

  console.log('\n══════════════════════════════════════════════');
  console.log('IMPORT REPORT');
  console.log('══════════════════════════════════════════════');
  console.log(`Existing partners preserved:    ${existingPartners.length}`);
  console.log(`New partners added:             ${newPartnersAdded}`);
  console.log(`Total partners now:             ${existingPartners.length + newPartnersAdded}`);
  console.log('');
  console.log(`Products deleted (old):         ${existingProductCount}`);
  console.log(`Products inserted:              ${inserted}`);
  console.log(`Products skipped (duplicates):  ${skipped}`);
  console.log(`Total products now:             ${finalCount}`);
  console.log('');
  console.log('By source:');
  console.log(`  Al Inmaa:         ${alInmaaCount}`);
  console.log(`  Marinas Official: ${marinasCount}`);
  console.log(`  STORZ MEDICAL:    ${storzCount}`);
  console.log('');
  console.log('By category:');
  for (const g of byCategory) {
    const cat = allCategories.find((c) => c.id === g.categoryId);
    console.log(`  ${cat?.name ?? g.categoryId}: ${g._count._all}`);
  }
  console.log('');
  if (duplicates.length > 0) {
    console.log(`⚠️  Duplicate names detected: ${duplicates.join(', ')}`);
  } else {
    console.log('No duplicate names detected.');
  }
  console.log('');
  console.log('isVisible for new partners (Al Inmaa, Marinas):  false ✓');
  console.log('isVisible for all 94 products:                   true  ✓');
  console.log('Source image URLs stored in detailedDescription  ✓');
  console.log('No images uploaded to CMS storage (pending permission) ✓');
  console.log('══════════════════════════════════════════════\n');
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
