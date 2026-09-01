import { Prisma, PrismaClient } from '@prisma/client';

const HOME_PAGE_SINGLETON_KEY = 'default';
const ABOUT_PAGE_SINGLETON_KEY = 'default';
const PENDING_VALUES =
  'Formal company values pending client confirmation.';

type SeedPartner = {
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly specialization?: string;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

type SeedCategory = {
  readonly name: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

type SeedService = {
  readonly title: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

const PRODUCT_CATEGORIES: readonly SeedCategory[] = [
  {
    name: 'Pharmaceutical Equipment',
    description: 'Technical equipment for pharmaceutical production and quality control.',
    isVisible: true,
    displayOrder: 0,
  },
  {
    name: 'Medical Equipment',
    description: 'Medical equipment distributed, installed, and serviced for healthcare organizations.',
    isVisible: true,
    displayOrder: 1,
  },
];

const PARTNERS: readonly SeedPartner[] = [
  {
    name: 'STORZ Medical AG',
    shortDescription:
      'Named in the supplied company profile as a Shammed Group partner since 2007; the profile states that more than 30 ESWL units are in Syria.',
    fullDescription:
      'The supplied profile describes STORZ MEDICAL as a medical technology company associated with shock-wave therapy and lithotripsy. Current relationship, territory, and exclusivity require client confirmation.',
    specialization: 'Shock-wave therapy and lithotripsy',
    websiteUrl: 'https://www.storzmedical.com/en/',
    country: 'Switzerland',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Technix',
    shortDescription:
      'Named in the supplied company profile as a partner and described as a producer of radiography and fluoroscopy devices.',
    fullDescription:
      'The supplied profile describes Technix as a European producer of devices for radiography and fluoroscopy. Current relationship and territory require client confirmation.',
    specialization: 'Radiography and fluoroscopy',
    websiteUrl: 'https://www.technix.it/',
    isVisible: true,
    displayOrder: 2,
  },
  {
    name: 'KARL STORZ',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a medical-technology partner.',
    fullDescription:
      'The supplied profile describes KARL STORZ as a medical-technology company. The corporate deck places it under a heading for exclusive agencies; the individual appointment and current status require client confirmation.',
    specialization: 'Medical technology and endoscopy',
    websiteUrl: 'https://www.karlstorz.com/us/en/',
    country: 'Germany',
    isVisible: true,
    displayOrder: 3,
  },
  {
    name: 'KLS Martin Group',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a medical-technology partner.',
    fullDescription:
      'The supplied profile describes KLS Martin Group as a group of medical-technology companies. Current relationship, territory, and exclusivity require client confirmation.',
    specialization: 'Medical technology',
    websiteUrl: 'https://www.klsmartin.com/en-na/',
    country: 'Germany',
    isVisible: true,
    displayOrder: 4,
  },
  {
    name: 'Dialife Group',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a partner; the profile describes Dialife as a provider of renal-care products, equipment, and services.',
    fullDescription:
      'The supplied profile describes Dialife as a global provider of products, equipment, and services for renal care and hemodialysis treatment. Current relationship and exclusivity require client confirmation.',
    specialization: 'Renal care and hemodialysis',
    websiteUrl: 'https://www.dialifegroup.com/',
    country: 'Switzerland',
    isVisible: true,
    displayOrder: 5,
  },
  {
    name: 'OES',
    shortDescription:
      'Electronic Manufacturing Services (EMS) partner serving healthcare and medical-electronics applications.',
    fullDescription:
      'OES provides electronic manufacturing services for healthcare applications, including printed circuit board assemblies and box-build services. Its healthcare page references applications such as hospital bed controllers, programmable breathing simulators, and radiotherapy systems. This description is based on the public OES healthcare page and does not establish a Shammed agency, exclusivity, Syria availability, regulatory approval, or product authorization.\n\nRELATIONSHIP STATUS: unverified\nPARTNER WEBSITE: https://www.oes-ems.com/\nHEALTHCARE PAGE: https://www.oes-ems.com/healthcare/\nLOGO SOURCE (unapproved — permission required): https://www.oes-inc.com/app/uploads/sites/4/2020/08/OES-Manufacturing-Logo-WHT-noWhiteSpace.svg\nAPPLICATION REFERENCES (not products): hospital bed controllers, programmable breathing simulators, radiotherapy systems',
    specialization:
      'Electronic Manufacturing Services (EMS), PCB assemblies, box-build services, and healthcare electronic systems.',
    websiteUrl: 'https://www.oes-ems.com/',
    country: 'UNKNOWN — needs client confirmation',
    isVisible: false,
    displayOrder: 6,
  },
  {
    name: 'SMD Medicare',
    shortDescription:
      'Healthcare distribution and solutions company supplying medical equipment, professional devices, pharmaceuticals, and healthcare supplies.',
    fullDescription:
      'SMD Medicare is described in the supplied company profile as a healthcare distribution and solutions company headquartered in Roorkee, Uttarakhand, India. Its stated areas include diagnostic equipment, hospital furniture, surgical instruments, specialized medical consumables, professional medical devices, and pharmaceuticals. This information is currently an unverified company profile and does not establish a current Shammed Group agency, exclusivity, Syria distribution rights, product registration, or product availability.\n\nRELATIONSHIP STATUS: unverified\nHEADQUARTERS: Roorkee, Uttarakhand, India\nPHONE: +91-95554 22455\nCONTACT CHANNEL: WhatsApp / mobile — source provided, requires confirmation\nWEBSITE: UNKNOWN — needs official URL confirmation\nLOGO SOURCE: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo7L6Iqnx9E9v393KYdv1GvuskjUY4VVBqKrDRFAFU3A&s',
    specialization:
      'Healthcare distribution, diagnostic equipment, hospital furniture, surgical instruments, medical consumables, professional medical devices, and pharmaceuticals.',
    country: 'India',
    isVisible: false,
    displayOrder: 7,
  },
  {
    name: 'Bistos Co',
    shortDescription:
      'South Korean medical equipment manufacturer developing and manufacturing healthcare and biomedical equipment.',
    fullDescription:
      'Bistos Co., Ltd. is a South Korean medical equipment manufacturer that researches, develops, and manufactures medical equipment. Its official website presents solutions and equipment for fetal monitoring, patient monitoring, neonatal care, phototherapy, infant incubators, infant warmers, breast pumps, thermometers, head-worn lights, X-ray applications, and other healthcare-related equipment. This description is based on the official Bistos website and does not establish a current Shammed agency, exclusivity, Syria distribution rights, regulatory approval, or product availability.\n\nRELATIONSHIP STATUS: unverified\nHEADQUARTERS: 7th Fl., A Bldg., 302, Galmachi-ro, Jungwon-gu, Seongnam-si, Gyeonggi-do, Republic of Korea, Postal code 13201\nPHONE: +82-31-750-0340\nFAX: +82-31-750-0344\nEMAIL: bistos@bistos.co.kr\nLOGO SOURCE: https://www.bistos.co.kr/wp-content/uploads/2023/08/00.logo-bistos-1.png',
    specialization:
      'Medical equipment manufacturing, fetal monitoring, patient monitoring, neonatal care, infant care, biomedical diagnostic equipment, and healthcare devices.',
    websiteUrl: 'https://www.bistos.co.kr/',
    country: 'South Korea',
    isVisible: false,
    displayOrder: 8,
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
    isVisible: true,
    displayOrder: 9,
  },
];

const SERVICES: readonly SeedService[] = [
  {
    title: 'Medical Equipment Distribution',
    description:
      'Distribution of high-quality medical equipment for private clinics, hospitals, and healthcare organizations across Syria.',
    isVisible: true,
    displayOrder: 1,
  },
  {
    title: 'Installation, Maintenance, and After-Sales Support',
    description:
      'Technical service, installation, maintenance, preventive maintenance, and after-sales customer service delivered by trained service and engineering staff.',
    isVisible: true,
    displayOrder: 2,
  },
  {
    title: 'Pharmaceutical Equipment and Distribution',
    description:
      'Technical equipment for pharmaceutical production and quality control, together with specialized pharmaceutical products supplied to the healthcare market in Syria.',
    isVisible: true,
    displayOrder: 3,
  },
  {
    title: 'Turnkey Healthcare Projects',
    description:
      'Comprehensive project planning for hospital and healthcare projects, supported by international experts and suppliers of medical and pharmaceutical equipment.',
    isVisible: true,
    displayOrder: 4,
  },
  {
    title: 'Operation Supplies and Medical Consumables',
    description: 'Distribution of operation supplies and medical consumables for healthcare customers.',
    isVisible: true,
    displayOrder: 5,
  },
];

type SeedProduct = {
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription: string;
  readonly manufacturer: string;
  readonly categoryName: string;
  readonly partnerName?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

function makeProvenance(sourceUrl: string, imageUrl: string): string {
  return `SOURCE PAGE: ${sourceUrl}\nSOURCE IMAGE: ${imageUrl}\nIMPORT DATE: 2026-08-21\nNOTE: Source-catalogue reference only. Not approved for publication until relationship, territory, registration, and image permissions are confirmed.`;
}

/**
 * Source-catalogue products imported from Marinas Official and STORZ MEDICAL.
 * Images are attached separately by `pnpm restore` (downloaded from source URLs in detailedDescription).
 */
const CATALOGUE_PRODUCTS: readonly SeedProduct[] = [
  // ── Marinas Official — 30 products — Pharmaceutical Equipment ───────────────
  { name: 'ARTHRO-FORT / Glucosamine & Chondroitin', shortDescription: 'Supplement; joint & bone health; glucosamine and chondroitin capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/arthro-fort-glucosamine-chondroitin/', 'https://marinasofficial.com/wp-content/uploads/2025/12/ARTHRO-FORT.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 1 },
  { name: 'BIOCARE (Magnesium Glycinate + B6)', shortDescription: 'Supplement; vitamins & minerals; magnesium glycinate and vitamin B6 capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/biocare-magnesium-glycinate-b6/', 'https://marinasofficial.com/wp-content/uploads/2025/12/GLYCINATE.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 2 },
  { name: 'BIOTIN FORT 10,000', shortDescription: 'Supplement; vitamins & minerals; biotin 10,000 mcg capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/biotin-10000-2/', 'https://marinasofficial.com/wp-content/uploads/2023/07/BFort_F.jpg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 3 },
  { name: 'BIOTIN-FORT 5,000 mcg', shortDescription: 'Supplement; vitamins & minerals; biotin 5,000 mcg capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/biotin-fort-5000mcg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/BIOTIN-5000.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 4 },
  { name: 'CARDI-ENZYME (Co-Enzyme Q10) 100 mg', shortDescription: 'Supplement; heart & circulation; Co-Enzyme Q10 capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/kardi-enzyme-co-enzyme-q10-100-mg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/CARDI-ENZYME.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 5 },
  { name: 'CENTURY FORT (100)', shortDescription: 'Supplement; vitamins & minerals; multivitamin/mineral tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/century-fort-2/', 'https://marinasofficial.com/wp-content/uploads/2023/08/century-100-1.jpeg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 6 },
  { name: 'CENTURY FORT (ADULTS 50+)', shortDescription: 'Supplement; vitamins & minerals; 50+ multivitamin/mineral tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/century-fort-adults-50/', 'https://marinasofficial.com/wp-content/uploads/2025/12/CENTURY-FORT-50.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 7 },
  { name: 'Derma Herb Capsules', shortDescription: 'Supplement; skin & beauty; marine collagen capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/derma-herb-capsules-copy/', 'https://marinasofficial.com/wp-content/uploads/2023/07/Derma_F.jpg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 8 },
  { name: 'DHEA 25 mg Capsules', shortDescription: 'Supplement; hormonal & fertility; DHEA capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/dhea-25mg-capsules/', 'https://marinasofficial.com/wp-content/uploads/2025/12/DHEA.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 9 },
  { name: 'EXTRA OMEGA 3 EPA 1000 mg', shortDescription: 'Supplement; omega & fatty acids; EPA softgels.', detailedDescription: makeProvenance('https://marinasofficial.com/product/extra-omega-3-epa-1000mg-3/', 'https://marinasofficial.com/wp-content/uploads/2023/07/Omega_F.jpg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 10 },
  { name: 'EXTRA-FORT / NAD+ 300 mg', shortDescription: 'Supplement; energy & antioxidants; NAD+ capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/extra-fort-300mg-nad/', 'https://marinasofficial.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-24-at-4.07.54-PM.jpeg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 11 },
  { name: 'FERRO FORT / FERROUS +', shortDescription: 'Supplement; vitamins & minerals; iron, B vitamins, zinc, and copper capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/ferro-fort-ferrous/', 'https://marinasofficial.com/wp-content/uploads/2025/12/FERRO.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 12 },
  { name: 'GINKGO HERB (Ginkgo Biloba)', shortDescription: 'Supplement; brain & cognitive; ginkgo biloba capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/ginkgo-herb-ginkgo-biloba/', 'https://marinasofficial.com/wp-content/uploads/2025/12/GINKGO-BILOBA.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 13 },
  { name: 'GLUCO-HERB / Berberine 500 mg', shortDescription: 'Supplement; blood sugar & metabolic; berberine capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/gluco-herb-berberine-500mg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/WhatsApp-Image-2025-12-24-at-3.37.49-PM.jpeg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 14 },
  { name: 'GRAVI-HERB (ASHWAGANDHA)', shortDescription: 'Supplement; herbal & botanical; ashwagandha capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/1646/', 'https://marinasofficial.com/wp-content/uploads/2025/12/GRAVI.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 15 },
  { name: 'KIDS FORT OMEGA with DHA', shortDescription: "Supplement; children's health; omega-3 and DHA capsules.", detailedDescription: makeProvenance('https://marinasofficial.com/product/kids-fort-omega-with-dha/', 'https://marinasofficial.com/wp-content/uploads/2025/12/KIDS-FORT.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 16 },
  { name: 'L-CARNITINE-FORT', shortDescription: 'Supplement; energy & weight management; L-carnitine capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/l-carnitine-fort/', 'https://marinasofficial.com/wp-content/uploads/2025/12/L-CARNITINE.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 17 },
  { name: 'LAXA-HERB Capsules', shortDescription: 'Supplement; digestive health; herbal capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/laxa-herb-capsules/', 'https://marinasofficial.com/wp-content/uploads/2025/12/LAXA.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 18 },
  { name: 'LIFE HERB (Probiotics Plus 25 Billion CFU)', shortDescription: 'Supplement; digestive health; probiotic capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/life-herb-probiotics-plus-25-billion-cfu/', 'https://marinasofficial.com/wp-content/uploads/2025/12/PROBIOTIC.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 19 },
  { name: 'LIFE-HERB (Vitamin K2)', shortDescription: 'Supplement; vitamins & minerals; vitamin K2 capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/life-herb-vitamin-k2/', 'https://marinasofficial.com/wp-content/uploads/2025/12/K2.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 20 },
  { name: 'Marinas Twist-Off Capsules — SKINCARE', shortDescription: 'Personal care; skin & beauty; hyaluronic-acid and collagen twist-off capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/marinas-twist-off-capsules-skincare-copy/', 'https://marinasofficial.com/wp-content/uploads/2025/05/twist-capsules-1.jpeg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 21 },
  { name: 'Mega-Herb Advance', shortDescription: 'Supplement; joint & bone health; herbal capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/mega-herb-advance-copy/', 'https://marinasofficial.com/wp-content/uploads/2023/07/Mega_F.jpg'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 22 },
  { name: 'OSTEO-FORT (Calcium 800+)', shortDescription: 'Supplement; joint & bone health; calcium tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/osteo-fort-calcium-800/', 'https://marinasofficial.com/wp-content/uploads/2025/12/OSTEO.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 23 },
  { name: 'PRIME-HERB (Chromium 500 mcg)', shortDescription: 'Supplement; blood sugar & metabolic; chromium capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/prime-herb-chromium-500mcg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/CHROMIUN.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 24 },
  { name: 'SELENIUM 200 MCG', shortDescription: 'Supplement; vitamins & minerals; selenium tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/selenium-200-mcg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/SELENIUM.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 25 },
  { name: 'STAY-FORT (Folic Acid 5 mg)', shortDescription: 'Supplement; vitamins & minerals; folic-acid tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/stay-fort-folic-acid-5mg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/STAY-FORT.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 26 },
  { name: 'SUPER-FORT EYE VISION Capsules', shortDescription: 'Supplement; eye health; zeaxanthin, lutein, vitamins, and minerals capsules.', detailedDescription: makeProvenance('https://marinasofficial.com/product/super-fort-eye-vision-capsules/', 'https://marinasofficial.com/wp-content/uploads/2025/12/SUPER-FORT.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 27 },
  { name: 'TRIPLE OMEGA 3,6,9', shortDescription: 'Supplement; omega & fatty acids; flaxseed-oil softgels.', detailedDescription: makeProvenance('https://marinasofficial.com/product/triple-omega-369/', 'https://marinasofficial.com/wp-content/uploads/2025/12/TRIPLE-OMEGA-369.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 28 },
  { name: 'VIT E 400 IU Softgels', shortDescription: 'Supplement; vitamins & minerals; vitamin E softgels.', detailedDescription: makeProvenance('https://marinasofficial.com/product/vit-e-400-iu-softgels/', 'https://marinasofficial.com/wp-content/uploads/2025/12/VIT-E.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 29 },
  { name: 'ZINC 50 MG', shortDescription: 'Supplement; vitamins & minerals; zinc tablets.', detailedDescription: makeProvenance('https://marinasofficial.com/product/zinc-50-mg/', 'https://marinasofficial.com/wp-content/uploads/2025/12/ZINC.png'), manufacturer: 'Marinas Official', categoryName: 'Pharmaceutical Equipment', partnerName: 'Marinas Official', isVisible: true, displayOrder: 30 },
  // ── STORZ MEDICAL — 20 products — Medical Equipment ─────────────────────────
  { name: 'MASTERPULS® icon', shortDescription: 'Radial shock-wave therapy workstation; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-icon/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_icon_001.jpeg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 1 },
  { name: 'MASTERPULS® R-SW', shortDescription: 'Portable radial shock-wave therapy system; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-r-sw/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_r-sw_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 2 },
  { name: 'MASTERPULS® »ultra« line (MP100 / MP200)', shortDescription: 'Radial shock-wave therapy system line; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-ultra-line/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultra_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 3 },
  { name: 'MASTERPULS® ultra+', shortDescription: 'Radial shock-wave therapy system; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-ultra-plus/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultraplus_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 4 },
  { name: 'MASTERPULS® ONE', shortDescription: 'Radial shock-wave therapy system; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/masterpuls-one/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_one_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 5 },
  { name: 'DUOLITH® SD1 »ultra«', shortDescription: 'Combined radial and focused shock-wave therapy system; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/duolith-sd1-ultra/', 'https://www.storzmedical.com/images/slider/banner_duolith_ultra_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 6 },
  { name: 'DUOLITH® SD1 T-TOP »ultra«', shortDescription: 'Focused shock-wave therapy system; orthopaedics / sports medicine.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-musculoskeletal-disorders/duolith-sd1-t-top-ultra/', 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_002.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 7 },
  { name: 'MODULITH® SLX-F2 »connect«', shortDescription: 'Shock-wave lithotripsy and endourology workstation; urology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slx-f2-connect/', 'https://www.storzmedical.com/images/slider/banner_modulith_slx-f2_connect_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 8 },
  { name: 'MODULITH® SLX-F2 »FD21«', shortDescription: 'Shock-wave lithotripsy system; urology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slx-f2-fd21/', 'https://www.storzmedical.com/images/slider/banner_modulith_slx-f2_fd21_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 9 },
  { name: 'MODULITH® SLK »intelect«', shortDescription: 'Mobile shock-wave lithotripsy system; urology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slk-intelect/', 'https://www.storzmedical.com/images/slider/banner_modulith_slk_intelect_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 10 },
  { name: 'MODULITH® SLK »inline«', shortDescription: 'Mobile shock-wave lithotripsy and endourology system; urology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/swl-products-for-lithiases/modulith-slk-inline/', 'https://www.storzmedical.com/images/slider/banner_modulith_slk_inline_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 11 },
  { name: 'DUOLITH® SD1 T-TOP »ultra« URO', shortDescription: 'Focused low-intensity shock-wave therapy system; urology / urogynaecology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-cpps-ipp-ed/duolith-sd1-ultra-uro/', 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 12 },
  { name: 'NEUROLITH®', shortDescription: 'Transcranial pulse stimulation system; neurology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/tps-products-for-the-treatment-of-alzheimer-s-disease/neurolith/', 'https://www.storzmedical.com/images/slider/banner_neurolith_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 13 },
  { name: 'MODULITH® SLC', shortDescription: 'Cardiac shock-wave therapy system; cardiology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/cswt-products-for-the-treatment-of-angina-pectoris/modulith-slc/', 'https://www.storzmedical.com/images/slider/banner_modulith_slc_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 14 },
  { name: 'DUOLITH® SD1 »ultra« AWT', shortDescription: 'Acoustic-wave treatment system; aesthetics / dermatology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/awt-products-for-aesthetic-indications/duolith-sd1-ultra-awt/', 'https://www.storzmedical.com/images/slider/banner_duolith_ultra_awt_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 15 },
  { name: 'D-ACTOR® »ultra« line (100 / 200)', shortDescription: 'Acoustic-wave treatment system line; aesthetics / dermatology.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/awt-products-for-aesthetic-indications/d-actor-ultra-line/', 'https://www.storzmedical.com/images/slider/banner_d-actor_ultra_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 16 },
  { name: 'DUOLITH® SD1 T-TOP »ultra« DERMA', shortDescription: 'Focused shock-wave therapy system; dermatology / wound-healing.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-wound-healing/duolith-sd1-ultra-derma/', 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_003.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 17 },
  { name: 'DUOLITH® SD1 T-TOP VET »ultra«', shortDescription: 'Focused shock-wave therapy system; veterinary medicine.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-veterinary-medicine/duolith-sd1-t-top-vet-ultra/', 'https://www.storzmedical.com/images/slider/banner_duolith_tt_ultra_vet_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 18 },
  { name: 'MASTERPULS® MP100 VET »ultra«', shortDescription: 'Mobile radial shock-wave therapy system; veterinary medicine.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/eswt-products-for-veterinary-medicine/masterpuls-mp100-vet-ultra/', 'https://www.storzmedical.com/images/slider/banner_masterpuls_ultra_vet_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 19 },
  { name: 'MAGNETOLITH® ultra+', shortDescription: 'Extracorporeal magnetotransduction therapy system; orthopaedics / musculoskeletal.', detailedDescription: makeProvenance('https://www.storzmedical.com/en/disciplines/emtt-products-for-musculoskeletal-disorders/magnetolith/', 'https://www.storzmedical.com/images/slider/banner_magnetolith_001.jpg'), manufacturer: 'STORZ MEDICAL AG', categoryName: 'Medical Equipment', partnerName: 'STORZ Medical AG', isVisible: true, displayOrder: 20 },
];

/**
 * Seeds all CMS content: text data, locations, social links, and the
 * source-catalogue products. Media attachments (images) are handled
 * separately by `pnpm restore`.
 */
export async function executeSeed(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedSiteSettings(prisma);
    await seedHomePage(prisma);
    await seedAboutPage(prisma);
    // Products must be cleared before categories so FK constraints don't block
    // category deletions when running on a server with stale demo products.
    await prisma.product.deleteMany();
    await seedProductCategories(prisma);
    await seedPartners(prisma);
    await seedCatalogueProducts(prisma);
    await seedServices(prisma);
    await seedLocations(prisma);
    await seedSocialLinks(prisma);
  } finally {
    await prisma.$disconnect();
  }
}


async function seedSiteSettings(prisma: PrismaClient): Promise<void> {
  const data = {
    companyName: 'Shammed Group',
    companyNameEnglish: 'Shammed Group',
    companyNameArabic: 'مجموعة شاميد',
    email: 'info@shammed-group.com',
    phone: '+963 11 446992001',
    whatsApp: '0049-17661877753',
    address:
      "Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001",
  };
  const phones = {
    create: [{ label: 'Primary', phone: data.phone, displayOrder: 0 }],
  };
  const emails = {
    create: [{ label: 'Primary', email: data.email, displayOrder: 0 }],
  };
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettingsPhone.deleteMany({ where: { siteSettingsId: existing.id } });
    await prisma.siteSettingsEmail.deleteMany({ where: { siteSettingsId: existing.id } });
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: {
        ...data,
        phones,
        emails,
      },
    });
    return;
  }
  await prisma.siteSettings.create({ data: { ...data, phones, emails } });
}

async function seedHomePage(prisma: PrismaClient): Promise<void> {
  const data: Prisma.HomePageCreateWithoutHeroImageInput = {
    singletonKey: HOME_PAGE_SINGLETON_KEY,
    heroTitle: 'Medical Equipment and Pharmaceutical Services in Syria',
    heroDescription:
      'Shammed Group provides medical equipment, technical services, operation supplies, medical consumables, and specialized pharmaceutical products to the healthcare market in Syria.',
    primaryCtaText: 'Explore Our Services',
    primaryCtaUrl: '/services',
    secondaryCtaText: 'Contact Shammed Group',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About Shammed Group',
    aboutPreviewDescription:
      'Established in Damascus in 2005, Shammed Group distributes and services medical equipment, supports turnkey hospital projects, and supplies technical equipment for pharmaceutical production and quality control.',
    aboutPreviewCtaText: 'Learn About Us',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our Partners',
    partnersSectionDescription:
      'Shammed Group works with international medical-equipment and pharmaceutical organizations. Current relationship and logo-use approvals must be confirmed for each partner before publication.',
    productsSectionTitle: 'Medical and Pharmaceutical Solutions',
    productsSectionDescription:
      "Explore Shammed Group's medical equipment, pharmaceutical equipment, operation supplies, medical consumables, and specialized pharmaceutical products.",
    servicesSectionTitle: 'Our Services',
    servicesSectionDescription:
      'From project planning and equipment distribution to installation, maintenance, and after-sales support, Shammed Group serves healthcare organizations across Syria.',
    whyTitle: 'Why Shammed Group',
    whyDescription:
      'Shammed Group combines a distribution network throughout Syria with trained service engineers, international supplier connections, turnkey-project experience, and technical support for medical equipment and pharmaceutical operations.',
    whyEyebrow: 'Our identity',
    whyReason1Title: 'Quality-Certified Portfolio',
    whyReason1Description:
      'Every product meets rigorous international pharmaceutical and healthcare quality standards.',
    whyReason2Title: 'Trusted Global Partnerships',
    whyReason2Description:
      'Direct distribution agreements with leading European and international manufacturers.',
    whyReason3Title: 'Decades of Regional Expertise',
    whyReason3Description:
      'Established networks and deep market knowledge across Syria and the MENA region since our founding.',
    whyReason4Title: 'Reliable Supply Chain',
    whyReason4Description:
      'Consistent product availability backed by efficient logistics and responsive after-sales service.',
    heroEyebrow: 'FORMULATION / 01 — SYRIA',
    aboutEyebrow: 'About us',
    aboutMetric1Value: '40+',
    aboutMetric1Label: 'Years in healthcare',
    aboutMetric2Value: '300+',
    aboutMetric2Label: 'Products & equipment',
    aboutMetric3Value: '100%',
    aboutMetric3Label: 'Syria coverage',
    contactSectionTitle: 'Talk to Our Team',
    contactSectionDescription:
      'Contact Shammed Group about medical equipment, pharmaceutical solutions, technical service, or distribution support in Syria.',
  };
  await prisma.homePage.upsert({
    where: { singletonKey: HOME_PAGE_SINGLETON_KEY },
    create: data,
    update: data,
  });
}

async function seedAboutPage(prisma: PrismaClient): Promise<void> {
  const data: Prisma.AboutPageCreateWithoutOverviewImageInput = {
    singletonKey: ABOUT_PAGE_SINGLETON_KEY,
    overview:
      'Shammed Group was established in Damascus, Syria, in 2005 as an independent branch company of the German Moramed-Con-b-Con GmbH. The company distributes and services high-quality medical equipment, operation supplies, and medical consumables, and has delivered turnkey projects for hospitals across Syria. Since 2013, its activities have also included technical equipment for pharmaceutical production and quality control.',
    vision: 'To be a leading provider by demonstrating medical excellence and superior customer service.',
    mission:
      'Providing high-quality medical equipment and specialized pharmaceutical products to the healthcare market in Syria.',
    values: PENDING_VALUES,
    capabilities:
      'Medical-equipment distribution and servicing; turnkey hospital project planning; installation of used MRI, CT, and X-ray equipment; maintenance and preventive maintenance; distribution of operation supplies and medical consumables; pharmaceutical sourcing and distribution; and technical equipment for pharmaceutical production and quality control.',
  };
  await prisma.aboutPage.upsert({
    where: { singletonKey: ABOUT_PAGE_SINGLETON_KEY },
    create: data,
    update: data,
  });
}

async function seedProductCategories(prisma: PrismaClient): Promise<void> {
  const keptNames = PRODUCT_CATEGORIES.map((category) => category.name);
  await prisma.productCategory.deleteMany({
    where: { name: { notIn: [...keptNames] } },
  });
  for (const category of PRODUCT_CATEGORIES) {
    const existing = await prisma.productCategory.findFirst({ where: { name: category.name } });
    if (existing) {
      await prisma.productCategory.update({
        where: { id: existing.id },
        data: {
          description: category.description,
          isVisible: category.isVisible,
          displayOrder: category.displayOrder,
        },
      });
      continue;
    }
    await prisma.productCategory.create({ data: category });
  }
}

async function seedPartners(prisma: PrismaClient): Promise<void> {
  const keptNames = PARTNERS.map((partner) => partner.name);
  await prisma.partner.deleteMany({
    where: { name: { notIn: [...keptNames] } },
  });
  for (const partner of PARTNERS) {
    const data = {
      name: partner.name,
      shortDescription: partner.shortDescription,
      fullDescription: partner.fullDescription ?? null,
      specialization: partner.specialization ?? null,
      websiteUrl: partner.websiteUrl ?? null,
      country: partner.country ?? null,
      isVisible: partner.isVisible,
      displayOrder: partner.displayOrder,
    };
    const existing = await prisma.partner.findFirst({ where: { name: partner.name } });
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.partner.create({ data });
  }
}

async function seedServices(prisma: PrismaClient): Promise<void> {
  const keptTitles = SERVICES.map((service) => service.title);
  await prisma.service.deleteMany({
    where: { title: { notIn: [...keptTitles] } },
  });
  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({ where: { title: service.title } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          description: service.description,
          isVisible: service.isVisible,
          displayOrder: service.displayOrder,
        },
      });
      continue;
    }
    await prisma.service.create({ data: service });
  }
}

async function seedCatalogueProducts(prisma: PrismaClient): Promise<void> {
  const categories = await prisma.productCategory.findMany();
  const partners = await prisma.partner.findMany();
  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));
  const partnerIdByName = new Map(partners.map((partner) => [partner.name, partner.id]));
  // Products were already cleared in executeSeed before categories were seeded.
  // This guard handles any stragglers added between those two steps.
  for (const product of CATALOGUE_PRODUCTS) {
    const categoryId = categoryIdByName.get(product.categoryName);
    if (categoryId === undefined) {
      throw new Error(`Seed category missing for product "${product.name}": ${product.categoryName}`);
    }
    const partnerId =
      product.partnerName === undefined ? null : (partnerIdByName.get(product.partnerName) ?? null);
    if (product.partnerName !== undefined && partnerId === null) {
      throw new Error(`Seed partner missing for product "${product.name}": ${product.partnerName}`);
    }
    const data = {
      name: product.name,
      shortDescription: product.shortDescription,
      detailedDescription: product.detailedDescription,
      manufacturer: product.manufacturer,
      isVisible: product.isVisible,
      displayOrder: product.displayOrder,
      categoryId,
      partnerId,
    };
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.product.create({ data });
  }
}

type SeedLocation = {
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isVisible: boolean;
  readonly isMapVisible: boolean;
  readonly displayOrder: number;
  readonly phones: readonly { readonly phone: string; readonly displayOrder: number }[];
};

const LOCATIONS: readonly SeedLocation[] = [
  {
    name: 'Shammed Group Headquarters — Damascus - First branch',
    address:
      "Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001",
    googleMapsUrl: 'https://www.google.com/maps?q=33.52353,36.29287',
    latitude: 33.52353,
    longitude: 36.29287,
    isVisible: true,
    isMapVisible: true,
    displayOrder: 1,
    phones: [{ phone: '+963 11 44699201', displayOrder: 0 }],
  },
  {
    name: 'Shammed Group — Damascus - Second branch',
    address: 'Jul Jammal Street, Damascus, Syria, P.O. Box 8001',
    googleMapsUrl: 'https://www.google.com/maps?q=33.52178,36.29788',
    latitude: 33.52178,
    longitude: 36.29788,
    isVisible: true,
    isMapVisible: true,
    displayOrder: 2,
    phones: [{ phone: '+963 11 44699200', displayOrder: 0 }],
  },
];

async function seedLocations(prisma: PrismaClient): Promise<void> {
  const keptNames = LOCATIONS.map((l) => l.name);
  await prisma.location.deleteMany({ where: { name: { notIn: keptNames } } });
  for (const location of LOCATIONS) {
    const existing = await prisma.location.findFirst({ where: { name: location.name } });
    if (existing) {
      await prisma.locationPhone.deleteMany({ where: { locationId: existing.id } });
      await prisma.location.update({
        where: { id: existing.id },
        data: {
          address: location.address,
          googleMapsUrl: location.googleMapsUrl ?? null,
          latitude: location.latitude ?? null,
          longitude: location.longitude ?? null,
          isVisible: location.isVisible,
          isMapVisible: location.isMapVisible,
          displayOrder: location.displayOrder,
          phones: { create: location.phones.map((p) => ({ phone: p.phone, displayOrder: p.displayOrder })) },
        },
      });
      continue;
    }
    await prisma.location.create({
      data: {
        name: location.name,
        address: location.address,
        googleMapsUrl: location.googleMapsUrl ?? null,
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        isVisible: location.isVisible,
        isMapVisible: location.isMapVisible,
        displayOrder: location.displayOrder,
        phones: { create: location.phones.map((p) => ({ phone: p.phone, displayOrder: p.displayOrder })) },
      },
    });
  }
}

type SeedSocialLink = {
  readonly platform: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

const SOCIAL_LINKS: readonly SeedSocialLink[] = [
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/shammed.group/',
    isVisible: true,
    displayOrder: 1,
  },
];

async function seedSocialLinks(prisma: PrismaClient): Promise<void> {
  for (const link of SOCIAL_LINKS) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
    if (existing) {
      await prisma.socialLink.update({
        where: { id: existing.id },
        data: { url: link.url, isVisible: link.isVisible, displayOrder: link.displayOrder },
      });
      continue;
    }
    await prisma.socialLink.create({ data: link });
  }
}

if (require.main === module) {
  void executeSeed();
}
