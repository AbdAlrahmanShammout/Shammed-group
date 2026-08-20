# Shammed Group — Content Media URLs

## Local import status (done)

Assets were **downloaded locally**, uploaded to `POST /admin/media`, and attached as **media IDs** (not hotlinked URLs).

| Asset | Local media ID | Attached to |
|-------|----------------|-------------|
| Home hero | `25` | Home → `heroImageMediaId` |
| Home About preview | `26` | Home → `aboutPreviewImageMediaId` (+ Turnkey service image) |
| Home Why | `27` | Home → `whyImageMediaId` (+ Installation service image) |
| About overview | `28` | About → `overviewImageMediaId` (+ Medical Equipment Distribution service image) |
| Service — Pharmaceutical Equipment and Distribution | `29` | Service image |
| Service — Operation Supplies and Medical Consumables | `30` | Service image |
| Partner — STORZ Medical AG logo | `31` | Partner `logoMediaId` |
| Partner — Technix logo | `32` | Partner `logoMediaId` |
| Partner — KARL STORZ logo | `33` | Partner `logoMediaId` |
| Partner — KLS Martin Group logo | `34` | Partner `logoMediaId` |
| Partner — Dialife Group logo | `35` | Partner `logoMediaId` |

Files were stored under the backend storage root via the media upload API. Working copies used for import: `backend/tmp/content-media/` (SVG partner logos converted to PNG because CMS accepts JPEG/PNG/WebP only).

Still missing (no upload): company logo, favicon, OES / SMD MEDICARE / Bistos logos.

Re-run importer (if needed):

```bash
cd backend && node scripts/import-content-media.mjs
```

---

## Summary

- **14 public HTTPS asset URLs selected by search:** five official partner-logo files and nine Pexels image placements (six distinct Pexels images reused where they fit).
- **0 assets generated:** generated assets were not used because this environment cannot publish them to a stable public HTTPS URL.
- **Still unknown:** Shammed Group’s own logo and favicon, plus official logo files and display permission for OES, SMD MEDICARE, and Bistos.
- **Product/SKU images:** intentionally not collected. The supplied materials do not identify specific products or models, and generic category photos must not be represented as product photos.

| Asset | Used for | Source (search / generate) | Image URL (https://...) | Notes |
|-------|----------|----------------------------|-------------------------|-------|
| Shammed Group company logo | Settings | search | UNKNOWN — needs official logo permission | The supplied corporate PDF contains a logo, but no official public HTTPS logo file was found. Request the approved SVG or PNG directly from Shammed Group. |
| Shammed Group favicon | Settings | search | UNKNOWN — needs official logo permission | Create only from the approved company-logo mark after the client supplies a master logo and permission. |
| Home hero image — unbranded hospital environment | Home hero background | search | https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/236380/ . Use an overlay for headline readability. Review final crop and Pexels License: https://www.pexels.com/license/ . Alt text: “Hospital room with medical equipment.” |
| Home About preview image — healthcare facility | Home About preview | search | https://images.pexels.com/photos/9741487/pexels-photo-9741487.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/9741487/ . Generic healthcare facility image only; do not imply it is a Shammed Group site. Pexels License: https://www.pexels.com/license/ . Alt text: “Modern healthcare facility exterior.” |
| Home Why Shammed image — clinical equipment handling | Home Why section | search | https://images.pexels.com/photos/9951400/pexels-photo-9951400.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/9951400/ . Suitable for technical care and equipment-support context, not a claim of Shammed staff or equipment. Pexels License: https://www.pexels.com/license/ . Alt text: “Healthcare professional handling sterilized equipment.” |
| About overview image — examination room | About Us overview | search | https://images.pexels.com/photos/8460220/pexels-photo-8460220.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/8460220/ . Generic clinical environment; do not present as a Shammed project. Pexels License: https://www.pexels.com/license/ . Alt text: “Clinical examination room with diagnostic equipment.” |
| STORZ Medical AG logo | Partners | search | https://www.storzmedical.com/images/logo.svg | Official website header asset; source page: https://www.storzmedical.com/en/ . Confidence: high. Permission note: official source confirms brand mark, but client must confirm current partner status and permission to display it. |
| Technix logo | Partners | search | https://www.technix.it/wp-content/uploads/2026/02/Logo-Technix-45esimo.webp | Official website header asset; source page: https://www.technix.it/ . Confidence: high. Permission note: client must confirm current partner status and permission to display it. |
| KARL STORZ logo | Partners | search | https://www.karlstorz.com/static_2x/static/file_img/logo-ks-white-revamp_small%20(1)%20(1).svg | Official website header asset; source page: https://www.karlstorz.com/us/en/ . Confidence: high. Permission note: client must confirm current partner status and permission to display it. This is a reversed logo, so test it only on a compatible background. |
| KLS Martin Group logo | Partners | search | https://www.klsmartin.com/typo3conf/ext/contentelements/Resources/Public/img/logo.svg | Official website header asset; source page: https://www.klsmartin.com/en-na/ . Confidence: high. Permission note: client must confirm current partner status and permission to display it. |
| Dialife Group logo | Partners | search | https://www.dialifegroup.com/wp-content/uploads/2019/08/Dialife_Logo-big.png | Official website header asset; source page: https://www.dialifegroup.com/ . Confidence: high. Permission note: client must confirm current partner status and permission to display it. |
| OES logo | Partners | search | UNKNOWN — needs official logo permission | The supplied deck gives insufficient company detail to identify the correct organization with confidence. |
| SMD MEDICARE logo | Partners | search | UNKNOWN — needs official logo permission | No confident official logo source was identified from the supplied company name. |
| Bistos logo | Partners | search | UNKNOWN — needs official logo permission | Third-party logo copies exist, but no official public source was confidently verified for website use. |
| Service image — Medical Equipment Distribution | Medical Equipment Distribution | search | https://images.pexels.com/photos/8460220/pexels-photo-8460220.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/8460220/ . This is generic category imagery, not a product or client-site image. Pexels License: https://www.pexels.com/license/ . Alt text: “Clinical room equipped with diagnostic devices.” |
| Service image — Installation, Maintenance, and After-Sales Support | Installation, Maintenance, and After-Sales Support | search | https://images.pexels.com/photos/9951400/pexels-photo-9951400.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/9951400/ . Use only as generic service imagery. Pexels License: https://www.pexels.com/license/ . Alt text: “Healthcare professional handling sterilized equipment.” |
| Service image — Pharmaceutical Equipment and Distribution | Pharmaceutical Equipment and Distribution | search | https://images.pexels.com/photos/10514768/pexels-photo-10514768.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/10514768/ . Generic cleanroom context only; do not imply it depicts Shammed Group operations. Pexels License: https://www.pexels.com/license/ . Alt text: “Sterile pharmaceutical manufacturing environment.” |
| Service image — Turnkey Healthcare Projects | Turnkey Healthcare Projects | search | https://images.pexels.com/photos/9741487/pexels-photo-9741487.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/9741487/ . Generic healthcare-facility exterior only; do not represent it as a completed Shammed Group project. Pexels License: https://www.pexels.com/license/ . Alt text: “Modern healthcare facility exterior.” |
| Service image — Operation Supplies and Medical Consumables | Operation Supplies and Medical Consumables | search | https://images.pexels.com/photos/6129576/pexels-photo-6129576.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pexels stock image; source page: https://www.pexels.com/photo/6129576/ . Generic supplies-management image; not a specific Shammed product. Pexels License: https://www.pexels.com/license/ . Alt text: “Healthcare professional organizing medical supplies.” |

## Ready to upload into admin

### Settings

- [ ] Company logo — **hold** until Shammed Group provides an approved master logo and permission.
- [ ] Favicon — **hold** until the approved logo mark is received.

### Home Page CMS

- [ ] Hero image — use the Pexels hospital-environment URL above.
- [ ] About preview image — use the Pexels healthcare-facility URL above.
- [ ] Why Shammed image — use the Pexels clinical-equipment URL above.

### About CMS

- [ ] Overview image — use the Pexels examination-room URL above.

### Partners

- [ ] STORZ Medical AG, Technix, KARL STORZ, KLS Martin Group, and Dialife Group — URLs are ready technically, **but keep partner cards hidden until the client confirms current relationship and logo-display permission**.
- [ ] OES, SMD MEDICARE, and Bistos — **hold** until official logo files and permission are supplied.

### Services

- [ ] Medical Equipment Distribution — use the generic clinical-equipment URL above.
- [ ] Installation, Maintenance, and After-Sales Support — use the generic sterilized-equipment URL above.
- [ ] Pharmaceutical Equipment and Distribution — use the generic cleanroom URL above.
- [ ] Turnkey Healthcare Projects — use the generic healthcare-facility URL above.
- [ ] Operation Supplies and Medical Consumables — use the generic medical-supplies URL above.

## Guardrails

- Do not place any generic stock image inside a named product detail as if it depicts that product.
- Do not publish a partner logo until current relationship and logo-use permission are confirmed.
- Download the selected assets into the CMS/storage layer before launch rather than depending indefinitely on a third-party direct image URL.
