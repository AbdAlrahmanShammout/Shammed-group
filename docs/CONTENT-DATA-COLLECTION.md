# Shammed Group — Content & Data Collection Sheet

Filled from the supplied Shammed Group profiles and corporate deck. All image fields are intentionally marked `UNKNOWN — needs client` because the supplied files contain local embedded images, not public HTTPS asset URLs.

## A. Company settings

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| companyName | TEXT | REQUIRED | Shammed Group |
| companyNameEnglish | TEXT | REQUIRED | Shammed Group |
| companyNameArabic | TEXT | OPTIONAL | مجموعة شاميد |
| phone (main) | TEXT | REQUIRED | +963 11 44699200-1 |
| email | TEXT | REQUIRED | info@shammed-group.com |
| whatsApp | TEXT | RECOMMENDED | 0049-17661877753 |
| address | TEXT | RECOMMENDED | Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001 |
| logo file path / notes | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| favicon file path / notes | IMAGE | RECOMMENDED | UNKNOWN — needs client |

STATUS: PARTIAL — logo and favicon public HTTPS URLs remain UNKNOWN — needs client.

---

## B. Homepage CMS

### B1. Hero

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| heroTitle | TEXT | REQUIRED | Medical Equipment and Pharmaceutical Services in Syria |
| heroDescription | TEXT | REQUIRED | Shammed Group provides medical equipment, technical services, operation supplies, medical consumables, and specialized pharmaceutical products to the healthcare market in Syria. |
| primaryCtaText | TEXT | REQUIRED | Explore Our Services |
| primaryCtaUrl | LINK | REQUIRED | /services |
| secondaryCtaText | TEXT | REQUIRED | Contact Shammed Group |
| secondaryCtaUrl | LINK | REQUIRED | /contact |
| heroImage | IMAGE | RECOMMENDED | UNKNOWN — needs client |

### B2. About preview

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| aboutPreviewTitle | TEXT | REQUIRED | About Shammed Group |
| aboutPreviewDescription | TEXT | REQUIRED | Established in Damascus in 2005, Shammed Group distributes and services medical equipment, supports turnkey hospital projects, and supplies technical equipment for pharmaceutical production and quality control. |
| aboutPreviewCtaText | TEXT | REQUIRED | Learn About Us |
| aboutPreviewCtaUrl | LINK | REQUIRED | /about |
| aboutPreviewImage | IMAGE | RECOMMENDED | UNKNOWN — needs client |

### B3. Partners section header

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| partnersSectionTitle | TEXT | REQUIRED | Our Partners |
| partnersSectionDescription | TEXT | OPTIONAL | Shammed Group works with international medical-equipment and pharmaceutical organizations. Current relationship and logo-use approvals must be confirmed for each partner before publication. |

### B4. Products section header

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| productsSectionTitle | TEXT | REQUIRED | Medical and Pharmaceutical Solutions |
| productsSectionDescription | TEXT | OPTIONAL | Explore Shammed Group's medical equipment, pharmaceutical equipment, operation supplies, medical consumables, and specialized pharmaceutical products. |

### B5. Services section header

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| servicesSectionTitle | TEXT | REQUIRED | Our Services |
| servicesSectionDescription | TEXT | OPTIONAL | From project planning and equipment distribution to installation, maintenance, and after-sales support, Shammed Group serves healthcare organizations across Syria. |

### B6. Why Shammed

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| whyTitle | TEXT | REQUIRED | Why Shammed Group |
| whyDescription | TEXT | REQUIRED | Shammed Group combines a distribution network throughout Syria with trained service engineers, international supplier connections, turnkey-project experience, and technical support for medical equipment and pharmaceutical operations. |
| whyImage | IMAGE | RECOMMENDED | UNKNOWN — needs client |

### B7. Contact section

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| contactSectionTitle | TEXT | REQUIRED | Talk to Our Team |
| contactSectionDescription | TEXT | OPTIONAL | Contact Shammed Group about medical equipment, pharmaceutical solutions, technical service, or distribution support in Syria. |

STATUS: PARTIAL — heroImage, aboutPreviewImage, and whyImage remain UNKNOWN — needs client.

---

## C. About page CMS

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| overview | TEXT | REQUIRED | Shammed Group was established in Damascus, Syria, in 2005 as an independent branch company of the German Moramed-Con-b-Con GmbH. The company distributes and services high-quality medical equipment, operation supplies, and medical consumables, and has delivered turnkey projects for hospitals across Syria. Since 2013, its activities have also included technical equipment for pharmaceutical production and quality control. |
| overviewImage | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| vision | TEXT | REQUIRED | To be a leading provider by demonstrating medical excellence and superior customer service. |
| mission | TEXT | REQUIRED | Providing high-quality medical equipment and specialized pharmaceutical products to the healthcare market in Syria. |
| values | TEXT | REQUIRED | Quality and Patient Focus — Choose dependable healthcare and pharmaceutical solutions with patient care in mind. Reliability — Build trust through responsive communication, careful follow-up, and dependable support. Technical Expertise — Maintain knowledgeable service and engineering capability for equipment installation, maintenance, and preventive maintenance. Partnership — Work collaboratively with healthcare providers, suppliers, and international partners to support practical solutions. Continuous Improvement — Strengthen services, processes, and distribution capability as healthcare needs evolve. |
| capabilities | TEXT | REQUIRED | Medical-equipment distribution and servicing; turnkey hospital project planning; installation of used MRI, CT, and X-ray equipment; maintenance and preventive maintenance; distribution of operation supplies and medical consumables; pharmaceutical sourcing and distribution; and technical equipment for pharmaceutical production and quality control. |

STATUS: PARTIAL — overviewImage requires upload to a public CMS/storage URL. Formal company values are filled as launch-ready draft copy and should receive client approval before publication.

---

## D. Product categories

### Category 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Medical Equipment |
| description | TEXT | OPTIONAL | Medical equipment distributed, installed, and serviced for healthcare organizations. |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 1 |

### Category 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Pharmaceutical Equipment |
| description | TEXT | OPTIONAL | Technical equipment for pharmaceutical production and quality control. |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 2 |

### Category 3

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Medical Supplies and Consumables |
| description | TEXT | OPTIONAL | Operation supplies and medical consumables distributed by Shammed Group. |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 3 |

### Category 4

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Specialized Pharmaceutical Products |
| description | TEXT | OPTIONAL | Specialized pharmaceutical products supplied to the healthcare market in Syria. |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 4 |

STATUS: FILLED

---

## E. Partners

### Partner 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | STORZ Medical AG |
| shortDescription | TEXT | REQUIRED | Named in the supplied company profile as a Shammed Group partner since 2007; the profile states that more than 30 ESWL units are in Syria. |
| fullDescription | TEXT | OPTIONAL | The supplied profile describes STORZ MEDICAL as a medical technology company associated with shock-wave therapy and lithotripsy. Current relationship, territory, and exclusivity require client confirmation. |
| specialization | TEXT | OPTIONAL | Shock-wave therapy and lithotripsy |
| websiteUrl | LINK | OPTIONAL | https://www.storzmedical.com/en/ |
| country | TEXT | OPTIONAL | Switzerland |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 1 |

### Partner 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Technix |
| shortDescription | TEXT | REQUIRED | Named in the supplied company profile as a partner and described as a producer of radiography and fluoroscopy devices. |
| fullDescription | TEXT | OPTIONAL | The supplied profile describes Technix as a European producer of devices for radiography and fluoroscopy. Current relationship and territory require client confirmation. |
| specialization | TEXT | OPTIONAL | Radiography and fluoroscopy |
| websiteUrl | LINK | OPTIONAL | https://www.technix.it/ |
| country | TEXT | OPTIONAL | UNKNOWN — needs client |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 2 |

### Partner 3

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | KARL STORZ |
| shortDescription | TEXT | REQUIRED | Named in the supplied company profile and corporate deck as a medical-technology partner. |
| fullDescription | TEXT | OPTIONAL | The supplied profile describes KARL STORZ as a medical-technology company. The corporate deck places it under a heading for exclusive agencies; the individual appointment and current status require client confirmation. |
| specialization | TEXT | OPTIONAL | Medical technology and endoscopy |
| websiteUrl | LINK | OPTIONAL | https://www.karlstorz.com/us/en/ |
| country | TEXT | OPTIONAL | Germany |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 3 |

### Partner 4

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | KLS Martin Group |
| shortDescription | TEXT | REQUIRED | Named in the supplied company profile and corporate deck as a medical-technology partner. |
| fullDescription | TEXT | OPTIONAL | The supplied profile describes KLS Martin Group as a group of medical-technology companies. Current relationship, territory, and exclusivity require client confirmation. |
| specialization | TEXT | OPTIONAL | Medical technology |
| websiteUrl | LINK | OPTIONAL | https://www.klsmartin.com/en-na/ |
| country | TEXT | OPTIONAL | Germany |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 4 |

### Partner 5

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Dialife Group |
| shortDescription | TEXT | REQUIRED | Named in the supplied company profile and corporate deck as a partner; the profile describes Dialife as a provider of renal-care products, equipment, and services. |
| fullDescription | TEXT | OPTIONAL | The supplied profile describes Dialife as a global provider of products, equipment, and services for renal care and hemodialysis treatment. Current relationship and exclusivity require client confirmation. |
| specialization | TEXT | OPTIONAL | Renal care and hemodialysis |
| websiteUrl | LINK | OPTIONAL | https://www.dialifegroup.com/ |
| country | TEXT | OPTIONAL | Switzerland |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 5 |

### Partner 6

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | OES |
| shortDescription | TEXT | REQUIRED | Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation. |
| fullDescription | TEXT | OPTIONAL | UNKNOWN — needs client |
| specialization | TEXT | OPTIONAL | UNKNOWN — needs client |
| websiteUrl | LINK | OPTIONAL | UNKNOWN — needs client |
| country | TEXT | OPTIONAL | UNKNOWN — needs client |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 6 |

### Partner 7

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | SMD MEDICARE |
| shortDescription | TEXT | REQUIRED | Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation. |
| fullDescription | TEXT | OPTIONAL | UNKNOWN — needs client |
| specialization | TEXT | OPTIONAL | UNKNOWN — needs client |
| websiteUrl | LINK | OPTIONAL | UNKNOWN — needs client |
| country | TEXT | OPTIONAL | UNKNOWN — needs client |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 7 |

### Partner 8

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Bistos |
| shortDescription | TEXT | REQUIRED | Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation. |
| fullDescription | TEXT | OPTIONAL | UNKNOWN — needs client |
| specialization | TEXT | OPTIONAL | UNKNOWN — needs client |
| websiteUrl | LINK | OPTIONAL | UNKNOWN — needs client |
| country | TEXT | OPTIONAL | UNKNOWN — needs client |
| logo | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 8 |

### Partner 9

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Marinas Official |
| shortDescription | TEXT | REQUIRED | Public source site lists dietary supplements and personal-care products. The supplied Shammed materials refer to Earth Creation / MARRINAS; the exact current legal entity and the Shammed relationship require confirmation. |
| fullDescription | TEXT | OPTIONAL | Official source catalogue, product-source links, and a direct logo reference are recorded in `PARTNER-CATALOGUE-SOURCE-IMPORT.md`. The public site appears oriented to the Lebanon market; it does not establish Shammed distribution rights in Syria. |
| specialization | TEXT | OPTIONAL | Dietary supplements and personal care |
| websiteUrl | LINK | OPTIONAL | https://marinasofficial.com/ |
| country | TEXT | OPTIONAL | Lebanon — site market; legal manufacturing country needs client confirmation |
| logo | IMAGE | RECOMMENDED | https://marinasofficial.com/wp-content/uploads/2023/08/MarinasOfficial-1.png — verify logo-display permission before upload/publication |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 9 |

STATUS: PARTIAL — nine partner records are staged but hidden pending client confirmation of current relationship, exclusivity, territory, and logo permission. Marinas Official is a source-catalogue record only; missing websites, countries, descriptions, and logos remain UNKNOWN — needs client for OES, SMD MEDICARE, and Bistos.

---

## F. Products

### Source-catalogue update — 21 August 2026

The client supplied public partner/catalogue websites after this sheet was first prepared. A separate, traceable intake sheet now documents **50 source-catalogue candidates** — 30 from Marinas Official and 20 from STORZ MEDICAL — including the source page, source partner/manufacturer, and direct official image reference for every product:

`PARTNER-CATALOGUE-SOURCE-IMPORT.md`

These are **not approved CMS products** yet. Website listings do not prove Shammed's current agency rights, territory, registration, availability, or licence to reuse the product images. Keep each imported record hidden until the client confirms the product-level relationship and publication approvals.

The legacy staging records below remain superseded placeholders and must not be published.

### Product 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | UNKNOWN — needs client |
| shortDescription | TEXT | REQUIRED | UNKNOWN — needs client |
| detailedDescription | TEXT | OPTIONAL | UNKNOWN — needs client |
| manufacturer | TEXT | OPTIONAL | UNKNOWN — needs client |
| categoryName | CONFIG | REQUIRED | Medical Equipment |
| partnerName | CONFIG | OPTIONAL | UNKNOWN — needs client |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 1 |

### Product 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | UNKNOWN — needs client |
| shortDescription | TEXT | REQUIRED | UNKNOWN — needs client |
| detailedDescription | TEXT | OPTIONAL | UNKNOWN — needs client |
| manufacturer | TEXT | OPTIONAL | UNKNOWN — needs client |
| categoryName | CONFIG | REQUIRED | Pharmaceutical Equipment |
| partnerName | CONFIG | OPTIONAL | UNKNOWN — needs client |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 2 |

STATUS: PARTIAL — 50 source-catalogue candidates with manufacturer/source-partner, product-page, and direct image references are documented in `PARTNER-CATALOGUE-SOURCE-IMPORT.md`. The two legacy blank records are hidden placeholders and must not be published. No source-catalogue candidate is approved for publication until relationship, Syria territory, registration, claims, image permission, and availability are confirmed.

---

## G. Services

### Service 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| title | TEXT | REQUIRED | Medical Equipment Distribution |
| description | TEXT | REQUIRED | Distribution of high-quality medical equipment for private clinics, hospitals, and healthcare organizations across Syria. |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 1 |

### Service 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| title | TEXT | REQUIRED | Installation, Maintenance, and After-Sales Support |
| description | TEXT | REQUIRED | Technical service, installation, maintenance, preventive maintenance, and after-sales customer service delivered by trained service and engineering staff. |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 2 |

### Service 3

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| title | TEXT | REQUIRED | Pharmaceutical Equipment and Distribution |
| description | TEXT | REQUIRED | Technical equipment for pharmaceutical production and quality control, together with specialized pharmaceutical products supplied to the healthcare market in Syria. |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 3 |

### Service 4

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| title | TEXT | REQUIRED | Turnkey Healthcare Projects |
| description | TEXT | REQUIRED | Comprehensive project planning for hospital and healthcare projects, supported by international experts and suppliers of medical and pharmaceutical equipment. |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 4 |

### Service 5

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| title | TEXT | REQUIRED | Operation Supplies and Medical Consumables |
| description | TEXT | REQUIRED | Distribution of operation supplies and medical consumables for healthcare customers. |
| image | IMAGE | RECOMMENDED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 5 |

STATUS: PARTIAL — service copy is filled; all service images remain UNKNOWN — needs client.

---

## H. Locations / branches

### Location 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Shammed Group Headquarters — Damascus |
| address | TEXT | REQUIRED | Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001 |
| phone 1 | TEXT | REQUIRED | +963 11 44699200 |
| phone 2 | TEXT | OPTIONAL | +963 11 44699201 |
| phone 3 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | https://www.google.com/maps?q=33.52353,36.29287 |
| latitude | CONFIG | OPTIONAL | 33.52353 |
| longitude | CONFIG | OPTIONAL | 36.29287 |
| isVisible | CONFIG | REQUIRED | true |
| displayOrder | CONFIG | REQUIRED | 1 |

### Location 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Aleppo Branch |
| address | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 1 | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 2 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 2 |

### Location 3

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Homs Branch |
| address | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 1 | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 2 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 3 |

### Location 4

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Latakia Branch |
| address | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 1 | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 2 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 4 |

### Location 5

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Daraa Branch |
| address | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 1 | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 2 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 5 |

### Location 6

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| name | TEXT | REQUIRED | Deir Al-Zour Branch |
| address | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 1 | TEXT | REQUIRED | UNKNOWN — needs client |
| phone 2 | TEXT | OPTIONAL | UNKNOWN — needs client |
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 6 |

STATUS: PARTIAL — headquarters is filled and visible with coordinates from the supplied Shahbandar Square screenshot. Branches are named in the supplied deck but remain hidden until addresses, phones, and current active status are confirmed. The separate Jul Jammal Street pin in the other screenshot is recorded as an alternate candidate and should not replace the Shahbandar Square headquarters pin without client confirmation.

---

## I. Social media links

### Social link 1

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| platform | TEXT | REQUIRED | UNKNOWN — needs client |
| url | LINK | REQUIRED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 1 |

### Social link 2

| Field | Type | Priority | Value to fill |
|-------|------|----------|---------------|
| platform | TEXT | REQUIRED | UNKNOWN — needs client |
| url | LINK | REQUIRED | UNKNOWN — needs client |
| isVisible | CONFIG | REQUIRED | false |
| displayOrder | CONFIG | REQUIRED | 2 |

STATUS: PARTIAL — no verified social-media URLs were supplied.

---

## J. SEO (not CMS — frontend config)

| Page | Preferred title | Preferred meta description |
|------|-----------------|----------------------------|
| Home | Shammed Group | Medical Equipment and Pharmaceutical Services in Syria | Shammed Group distributes and services medical equipment, pharmaceutical equipment, medical supplies, and specialized pharmaceutical products across Syria. |
| About | About Shammed Group | Medical Equipment and Pharmaceutical Services | Learn about Shammed Group, established in Damascus in 2005 to distribute and service medical equipment and support pharmaceutical operations in Syria. |
| Partners | Shammed Group Partners | International Medical and Pharmaceutical Partners | Explore the international medical-equipment and pharmaceutical organizations named in Shammed Group's supplied company materials. Current relationships require confirmation. |
| Products | Medical and Pharmaceutical Solutions | Shammed Group | Discover Shammed Group's medical equipment, pharmaceutical equipment, medical supplies, consumables, and specialized pharmaceutical products for the Syrian healthcare market. |
| Services | Shammed Group Services | Medical Equipment and Pharmaceutical Support | From distribution and turnkey project planning to installation, maintenance, and after-sales support, Shammed Group serves healthcare organizations in Syria. |
| Contact | Contact Shammed Group in Syria | Medical Equipment and Pharmaceutical Services | Contact Shammed Group in Damascus about medical equipment, pharmaceutical solutions, technical service, and healthcare distribution support. |

Also confirm production site URL for canonical tags: `VITE_PUBLIC_SITE_URL` = UNKNOWN — needs client

STATUS: PARTIAL — preferred page copy is filled; production canonical URL remains UNKNOWN — needs client.

---

## K. Navigation & legal (no CMS fields)

| Label | Path |
|-------|------|
| Home | `/` |
| About Us | `/about` |
| Partners | `/partners` |
| Products | `/products` |
| Services | `/services` |
| Contact Us | `/contact` |

Privacy Policy / Terms / Cookie pages: not in this project. No CMS fields added.

STATUS: FILLED

---

## L. Media asset list (attach or path references)

| Asset | Needed for | Image URL (https://...) |
|-------|------------|-------------------------|
| Company logo | Settings | UNKNOWN — needs client |
| Favicon | Settings | UNKNOWN — needs client |
| Home hero image | Home CMS | UNKNOWN — needs client |
| Home about preview image | Home CMS | UNKNOWN — needs client |
| Home why image | Home CMS | UNKNOWN — needs client |
| About overview image | About CMS | UNKNOWN — needs client |
| Marinas Official partner logo | Partners (hidden source record) | https://marinasofficial.com/wp-content/uploads/2023/08/MarinasOfficial-1.png — verify relationship and logo-display permission |
| Source-catalogue product images | Products (hidden source candidates) | 50 direct official source-image references are listed per product in `PARTNER-CATALOGUE-SOURCE-IMPORT.md`; do not hotlink permanently or publish before permission |
| Service images | Services (list) | UNKNOWN — needs client |

STATUS: PARTIAL — original company media still requires approved assets. Official public source references were added for one hidden partner record and 50 hidden source-catalogue candidates; each must be licensed/approved and copied to Shammed storage before publication.

---

## M. Production configuration (ops — not website copy)

Do not commit these values to git. Populate them through the deployment secret manager and environment configuration.

| Variable | Value / notes |
|----------|---------------|
| DATABASE_URL | UNKNOWN — needs client |
| ADMIN_PASSWORD | UNKNOWN — needs client |
| TOKEN_SECRET_KEY | UNKNOWN — needs client |
| ALLOWED_ORIGINS | UNKNOWN — needs client |
| SMTP_HOST | mail.shammed-group.com |
| SMTP_PORT | 465 |
| SMTP_USER | info@shammed-group.com |
| SMTP_PASSWORD | UNKNOWN — needs client |
| SMTP_SECURE | true |
| SMTP_FROM | info@shammed-group.com |
| CONTACT_EMAIL | info@shammed-group.com |
| STORAGE_ROOT_PATH | UNKNOWN — needs client |
| STORAGE_MAX_FILE_BYTES | 5242880 (5 MB) |
| VITE_API_BASE_URL | UNKNOWN — needs client |
| VITE_PUBLIC_SITE_URL | UNKNOWN — needs client |

STATUS: PARTIAL — SMTP host, port, username, secure mode, sender, CONTACT_EMAIL, and the supplied storage limit are filled. The mailbox password and remaining deployment values remain UNKNOWN — needs client.

---

## N. Do not collect (unsupported by this project)

- Product slug, SKU, model, gallery, datasheet/brochure PDFs, specifications tables, related products
- Category images / icons / banners / category SEO fields
- Separate Manufacturer, Brand, Supplier, Agency, or Distributor entities
- Working hours, branch email, branch city field, branch photos
- Homepage statistics counters / timeline / awards entities
- Privacy Policy, Terms, Cookie Policy CMS pages
- Videos
- Open Graph / Twitter share image CMS fields
- CMS-managed navigation

---

## O. Handoff checklist for the filling agent

- [x] Every REQUIRED field has a value or is explicitly marked `UNKNOWN — needs client`
- [x] No placeholder copy remains as publishable content
- [x] Every staged product references a real category name from section D
- [x] Every source-catalogue product documents its source partner and page in `PARTNER-CATALOGUE-SOURCE-IMPORT.md`; all remain hidden pending relationship confirmation
- [x] At least one visible location is provided
- [x] No fake social URL or example URL was used
- [x] Every image/logo/favicon cell has a full HTTPS URL or is explicitly marked `UNKNOWN — needs client`
- [x] No color values were added without an approved HEX value
- [x] Invented medical and regulatory claims were avoided

## Summary

### Filled

- Company identity, English and Arabic names, founding year, contact email, phone, WhatsApp, and headquarters address.
- Homepage copy for hero, About preview, partners, products, services, Why Shammed, and contact sections.
- About overview, mission, vision, capabilities, and all four source-supported product categories.
- Five source-supported services.
- Nine partner records, staged as hidden until current relationships and logo permissions are confirmed.
- A 50-record, source-traceable product-catalogue intake sheet with official product-page and image references from Marinas Official and STORZ MEDICAL.
- One visible Damascus headquarters location and five hidden branch records using the branch names supplied in the corporate deck.
- Navigation paths and preferred SEO titles/meta descriptions.
- `CONTACT_EMAIL` and the existing 5 MB storage limit.

### Remains `UNKNOWN — needs client`

- Approved company logo, favicon, hero/about/why image, and service-image URLs.
- Formal company values.
- Approved product catalog, product-to-partner authorisation, Syria territory, regulatory status, approved local descriptions, and approved product media.
- Current partner status, exclusivity, territories, countries, missing websites, and logo permissions.
- Branch addresses, phones, Google Maps links, coordinates, and active status.
- Verified social-media accounts.
- Production site URL, API URL, database configuration, SMTP configuration, and deployment secrets.

### Image URLs used

Official source-image references for one hidden partner record and 50 hidden source-catalogue candidates are listed in `PARTNER-CATALOGUE-SOURCE-IMPORT.md`. They are not Shammed-hosted assets and must not be treated as publication approval.
