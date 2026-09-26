# TPPL corporate website

A responsive corporate website for Talegaonkar Profiles Private Limited, built with Vite, HTML, CSS and JavaScript.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. Build with `npm run build`; upload the contents of `dist` to a static web host. Use `npm run preview` to review the production build locally.

## Content and assets

- Company profile, six capability groups, manufacturing facilities, equipment details and photographs: supplied **PPT TPPL-Corporate Intro-SEPT 26.pdf**. The brochure was used as source material, not as instructions.
- Company overview: brochure page 2; areas and locations: pages 3–6; capabilities: page 9; machinery: pages 10–72; industries: page 73; quality: page 76; measurement infrastructure: page 79.
- Plant areas: Talawade 40,000 sq. ft.; Solu 160,000 sq. ft.; Chakan 46,000 sq. ft.; Khandala 70,000 sq. ft. Total: 316,000 sq. ft.
- Product names, five corresponding product images and contact details: https://www.tpplpune.com/.
- Original downloadable brochure: `public/assets/TPPL-Corporate-Profile.pdf`.
- Website copy and layout: `index.html`; capabilities, product and facility data: `main.js`; responsive styling: `style.css`.
- Photographs are local optimized WebP assets. Fonts use Google Fonts with local system fallbacks.

## Enquiries

The form validates required fields and prepares a mailto draft in the visitor's email application. It does not transmit, save, or claim to have sent enquiries. For direct submissions, connect a server-side endpoint or a form service before changing the form behavior. No credentials are required for the current implementation.

## Validation

Production build passed. Headless Edge browser checks covered desktop and 390px mobile layouts, horizontal overflow, capability dialogs, product filtering, facility tabs, mobile navigation, image loading, brochure availability, required form fields and JavaScript runtime errors.

The site has been built locally; the existing live website has not been changed.

Brand identity: original logo asset from https://www.tpplpune.com/assets/img/logo.png, used without redrawing in the header and footer. The site palette follows the company profile’s blue, orange and white theme.


Homepage hero: original three-image automatic slideshow from the existing homepage (`assets/img/hero/hero-img-1-1.png`, `hero-img-1-2.png`, `hero-img-1-3.png`). The press-brake image shown in the reference screenshot appears first. Includes pause/resume and respects reduced-motion preferences. The mistakenly added gallery video and its section have been removed.

## Engineering experience

`engineering.js` contains the SVG mechanical process explorer, the interactive capability meters and service-specific enquiry fields. The schematic is illustrative; measurements use documented Unit I brochure specifications rather than invented live production data. Animation supports pause/play and reduced-motion settings. Service enquiries include material, quantity, process-specific dimensions/specifications, delivery date, drawing reference and project details in the email draft. Capability dialog enquiry buttons select the matching service automatically.

The footer uses white as its logo background, with blue and orange accents. Numbered capability labels, the hero establishment badge and the decorative quality Q have been removed. Interactive cards and links use labelled hover/focus actions instead of arrow cues.

Additional browser checks passed for all five process modes, animation pause, reduced motion, measurement selection, seven service-specific forms, capability-to-enquiry selection, quantity validation and layouts at 390, 768, 1024 and 1440 pixels.

## Plant quality and customer content

`plant-quality.js` defines each plant's prime capabilities, documented specifications, machinery list and corresponding equipment photo. The quality dropdown and infrastructure tabs update each other. Sources: brochure pages 10–22 (Unit I), 23–48 (Unit II), 49–61 (Unit III), 62–72 (Unit IV). Unit III shows operating 10-tonne cranes; upcoming equipment is not presented as installed.

Testimonials reproduce the Nilesh and Mahendra feedback already published on the existing company homepage, without invented ratings or affiliations. The footer includes verified contact details, internal navigation, brochure download and the existing Google Maps embed. Map availability requires access to Google Maps. Browser checks cover all four plants, equipment image loading, selector synchronization, testimonials, map URL and responsive widths.

About Us section: company overview, mission and vision adapted from https://www.tpplpune.com/about-us.php, supplemented with the four-unit manufacturing footprint from the supplied brochure. Local facility and machinery photography is used. Header and footer About Us links target this section.

## Existing website migration

The existing website was crawled on 2026-09-26. The new multi-page structure includes 20 product entries, four service branches with their process descriptions and technical tables, 23 gallery images, three source videos, all 25 client logos, four manufacturing branches, and a standalone contact page. Product and service navigation trees retain the order used by the existing website.

The source website currently returns errors for `valve-body.php`, the capitalized `Machining-facilities.php` menu URL, and `nde-end-shield-for-to-power.php`. The available lowercase machining page was migrated. Valve Body remains visible in the product tree with a source-unavailable notice; specifications were not invented. Several source product image URLs also return 404, so their verified text and tables are shown without those broken images.

Run `node scripts/build-content-pages.mjs` after updating `content/site-content.json` or `content/assets.json`. Vite builds the homepage, six section pages, 20 product pages and four service pages. The full browser audit is in `review/full-site-check.mjs`.

## Offline media archive

Every photograph and video used by the website is stored below `public/assets`, so published pages do not depend on the original TPPL website for media delivery. `content/assets.json` preserves the source URL to local-file mapping for migrated media. The homepage process explorer uses the original TPPL machinery clip at `public/assets/videos/tppl-machinery-showcase.mp4`; the complete migrated source collection remains in `public/assets/migrated`.
