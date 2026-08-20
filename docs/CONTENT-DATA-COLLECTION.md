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
| values | TEXT | REQUIRED | UNKNOWN — needs client |
| capabilities | TEXT | REQUIRED | Medical-equipment distribution and servicing; turnkey hospital project planning; installation of used MRI, CT, and X-ray equipment; maintenance and preventive maintenance; distribution of operation supplies and medical consumables; pharmaceutical sourcing and distribution; and technical equipment for pharmaceutical production and quality control. |

STATUS: PARTIAL — overviewImage and formal company values remain UNKNOWN — needs client.

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

STATUS: PARTIAL — partner records are staged but hidden pending client confirmation of current relationship, exclusivity, territory, and logo permission. Missing websites, countries, descriptions, and logos remain UNKNOWN — needs client for OES, SMD MEDICARE, and Bistos.

---

## F. Products

No individual product catalog, product names, models, SKUs, specifications, or approved product images were supplied. The following hidden staging records preserve the CMS structure without inventing products.

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

STATUS: PARTIAL — no individual products, manufacturers, partner assignments, descriptions, or product images were supplied. The two records are hidden and must not be published.

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
| googleMapsUrl | LINK | RECOMMENDED | UNKNOWN — needs client |
| latitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
| longitude | CONFIG | OPTIONAL | UNKNOWN — needs client |
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

STATUS: PARTIAL — headquarters is filled and visible. Branches are named in the supplied deck but remain hidden until addresses, phones, and current active status are confirmed. Google Maps URL and coordinates remain UNKNOWN — needs client.

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
| Partner logos | Partners (list) | UNKNOWN — needs client |
| Product images | Products (list) | UNKNOWN — needs client |
| Service images | Services (list) | UNKNOWN — needs client |

STATUS: PARTIAL — no public HTTPS image URLs were supplied. Local PDF-embedded images were not converted into public URLs or used as if they were hosted assets.

---

## M. Production configuration (ops — not website copy)

Do not commit these values to git. Populate them through the deployment secret manager and environment configuration.

| Variable | Value / notes |
|----------|---------------|
| DATABASE_URL | UNKNOWN — needs client |
| ADMIN_PASSWORD | UNKNOWN — needs client |
| TOKEN_SECRET_KEY | UNKNOWN — needs client |
| ALLOWED_ORIGINS | UNKNOWN — needs client |
| SMTP_HOST | UNKNOWN — needs client |
| SMTP_PORT | UNKNOWN — needs client |
| SMTP_USER | UNKNOWN — needs client |
| SMTP_PASSWORD | UNKNOWN — needs client |
| SMTP_SECURE | UNKNOWN — needs client |
| SMTP_FROM | UNKNOWN — needs client |
| CONTACT_EMAIL | info@shammed-group.com |
| STORAGE_ROOT_PATH | UNKNOWN — needs client |
| STORAGE_MAX_FILE_BYTES | 5242880 (5 MB) |
| VITE_API_BASE_URL | UNKNOWN — needs client |
| VITE_PUBLIC_SITE_URL | UNKNOWN — needs client |

STATUS: PARTIAL — CONTACT_EMAIL and the supplied storage limit are filled; deployment values and secrets remain UNKNOWN — needs client.

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
- [x] Every staged product partner reference is explicitly marked `UNKNOWN — needs client`; no unverified partner has been attached
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
- Eight partner records, staged as hidden until current relationships and logo permissions are confirmed.
- One visible Damascus headquarters location and five hidden branch records using the branch names supplied in the corporate deck.
- Navigation paths and preferred SEO titles/meta descriptions.
- `CONTACT_EMAIL` and the existing 5 MB storage limit.

### Remains `UNKNOWN — needs client`

- Public HTTPS URLs for every logo, favicon, hero/about/why image, partner logo, product image, and service image.
- Formal company values.
- Individual product catalog, manufacturers, descriptions, product-to-partner links, and approved product media.
- Current partner status, exclusivity, territories, countries, missing websites, and logo permissions.
- Branch addresses, phones, Google Maps links, coordinates, and active status.
- Verified social-media accounts.
- Production site URL, API URL, database configuration, SMTP configuration, and deployment secrets.

### Image URLs used

None. No public image URLs were supplied, so every media field is explicitly marked `UNKNOWN — needs client` rather than using local filenames or inventing hosted URLs.
