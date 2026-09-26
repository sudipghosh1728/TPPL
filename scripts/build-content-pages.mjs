import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = JSON.parse(fs.readFileSync(path.join(root, 'content/site-content.json'), 'utf8'));
const assets = JSON.parse(fs.readFileSync(path.join(root, 'content/assets.json'), 'utf8'));
const local = (url) => assets[url]?.path || '';

const productOrder = [
  ['stator-frame-for-tdps-stator-frame', 'Stator Frame for TDPS'],
  ['stator-frame', 'Stator Frame'],
  ['nde-end-shield-for-td-power', 'NDE End Shield for TD Power'],
  ['de-end-shield-for-td-powers', 'DE End Shield for TD Power'],
  ['compression-plate', 'Compression Plate'],
  ['compression-laser-cut', 'Compression Laser Cut'],
  ['gear-case', 'Gear Case'],
  ['tool-drum', 'Tool Drum'],
  ['stator-frame-for-td-power', 'Stator Frame for TD Power'],
  ['roller-for-welding', 'Roller for Welding'],
  ['machine-base', 'Machine Base'],
  ['valve-body', 'Valve Body'],
  ['material-handling-product', 'Material Handling Product'],
  ['vaccum-chamber', 'Vacuum Chamber'],
  ['cnc-cutting-and-bending-part', 'CNC Cutting and Bending Part'],
  ['end-shield', 'End Shield'],
  ['valve-plate', 'Valve Plate'],
  ['water-jacket', 'Water Jacket'],
  ['platform-for', 'Platform'],
  ['profile-flange', 'Profile Flange'],
];
const serviceOrder = [
  ['cutting-facilities', 'Profile Cutting'],
  ['fabrication-facilities', 'Fabrication Facilities'],
  ['machining-facilities', 'Machining Facilities'],
  ['after-facilities', 'After Machining Facilities'],
];

const products = productOrder.map(([slug, name]) => {
  const found = source.find((item) => item.slug === slug);
  return found ? { ...found, name } : {
    slug, name, title: name, type: 'product', images: [], blocks: [],
    source: `https://www.tpplpune.com/${slug}.php`,
    unavailable: true,
  };
});
const services = serviceOrder.map(([slug, name]) => ({
  ...source.find((item) => item.slug === slug), name,
}));
const gallerySource = source.find((item) => item.slug === 'gallery');
const clientsSource = source.find((item) => item.slug === 'clients');
const aboutSource = source.find((item) => item.slug === 'about-us');
const contactSource = source.find((item) => item.slug === 'contact-us');

function mapEntry(entry) {
  return {
    ...entry,
    images: (entry.images || []).map((img) => ({ ...img, path: local(img.url) })).filter((img) => img.path),
    videos: (entry.videos || []).map((url) => ({ url, path: local(url) })).filter((video) => video.path),
    blocks: (entry.blocks || []).map((block) => block.type === 'image'
      ? { ...block, path: local(block.url) }
      : block).filter((block) => block.type !== 'image' || block.path),
  };
}

const siteData = {
  products: products.map(mapEntry),
  services: services.map(mapEntry),
  gallery: mapEntry(gallerySource),
  clients: mapEntry(clientsSource),
  about: mapEntry(aboutSource),
  contact: mapEntry(contactSource),
  audit: {
    checkedRoutes: 32,
    checkedAt: '2026-09-26',
    unavailableSourcePages: ['Machining-facilities.php', 'valve-body.php', 'nde-end-shield-for-to-power.php'],
    note: 'The lowercase machining page is available and has been migrated. Valve Body has no accessible detail page on the source website.',
  },
};
fs.mkdirSync(path.join(root, 'public/content'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/content/site-data.json'), JSON.stringify(siteData, null, 2));

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const productTree = productOrder.map(([slug, name]) => `<a href="/products/${slug}.html">${esc(name)}</a>`).join('');
const serviceTree = serviceOrder.map(([slug, name]) => `<a href="/services/${slug}.html">${esc(name)}</a>`).join('');

function shell({ title, description, page, slug = '' }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#081a29"><meta name="description" content="${esc(description)}"><title>${esc(title)} | TPPL</title><link rel="icon" type="image/png" href="/assets/tppl-logo.png"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/pages.css"><link rel="stylesheet" href="/about-contact.css"><link rel="stylesheet" href="/spacing-fix.css"><link rel="stylesheet" href="/nav-clean.css"><link rel="stylesheet" href="/dark-theme.css"></head>
<body class="inner-page" data-page="${page}" data-slug="${slug}">
<div class="topbar"><span>TALEGAONKAR PROFILES PRIVATE LIMITED</span><span>PUNE, INDIA <i></i> ENGINEERING SINCE 1997</span></div>
<header class="site-header"><a class="brand" href="/" aria-label="TPPL home"><img class="brand-logo" src="/assets/tppl-logo.png" alt="Talegaonkar Profiles Pvt. Ltd." width="400" height="111"></a><button class="menu-toggle" aria-expanded="false" aria-controls="inner-navigation">Menu <span>☰</span></button><nav id="inner-navigation" aria-label="Main navigation"><a href="/">Home</a><div class="nav-group"><a href="/products.html">Products</a><button type="button" aria-expanded="false" aria-label="Show product pages">+</button><div class="nav-tree product-tree">${productTree}</div></div><div class="nav-group"><a href="/services.html">Services</a><button type="button" aria-expanded="false" aria-label="Show service pages">+</button><div class="nav-tree service-tree">${serviceTree}</div></div><a href="/gallery.html">Gallery</a><a href="/clients.html">Clients</a><a href="/#infrastructure">Infrastructure</a><a href="/contact-us.html" class="nav-cta">Contact Us</a></nav></header>
<main id="page-content"><div class="page-loading">Loading company content…</div></main>
<footer class="page-footer"><div><img src="/assets/tppl-logo.png" alt="TPPL" width="400" height="111"><p>Steel fabrication and engineering solutions since 1997.</p></div><div><strong>Explore</strong><a href="/about-us.html">About us</a><a href="/products.html">Products</a><a href="/services.html">Services</a><a href="/gallery.html">Gallery</a><a href="/clients.html">Clients</a></div><div><strong>Contact</strong><a href="/contact-us.html">Project enquiry</a><a href="tel:+919096163333">+91 90961 63333</a><a href="mailto:vinayak@tpplpune.com">vinayak@tpplpune.com</a><span>Talawade, Pune 412114</span></div></footer>
<script type="module" src="/site-pages.js"></script></body></html>`;
}

const pages = [
  ['products.html', shell({ title:'Products', description:'Complete TPPL product portfolio.', page:'products' })],
  ['services.html', shell({ title:'Manufacturing Services', description:'Complete TPPL cutting, fabrication, machining and finishing capabilities.', page:'services' })],
  ['gallery.html', shell({ title:'Gallery', description:'TPPL manufacturing and product gallery.', page:'gallery' })],
  ['clients.html', shell({ title:'Clients', description:'TPPL customer portfolio.', page:'clients' })],
  ['about-us.html', shell({ title:'About Us', description:'TPPL history, mission, vision and manufacturing branches.', page:'about' })],
  ['contact-us.html', shell({ title:'Contact Us', description:'Contact TPPL for manufacturing and engineering enquiries.', page:'contact' })],
];
for (const [file, html] of pages) fs.writeFileSync(path.join(root, file), html);
for (const product of siteData.products) {
  const dir = path.join(root, 'products'); fs.mkdirSync(dir, { recursive:true });
  fs.writeFileSync(path.join(dir, `${product.slug}.html`), shell({ title:product.name, description:`TPPL ${product.name} product details and specifications.`, page:'product', slug:product.slug }));
}
for (const service of siteData.services) {
  const dir = path.join(root, 'services'); fs.mkdirSync(dir, { recursive:true });
  fs.writeFileSync(path.join(dir, `${service.slug}.html`), shell({ title:service.name, description:`TPPL ${service.name} capabilities and technical specifications.`, page:'service', slug:service.slug }));
}
console.log(`Generated ${pages.length + products.length + services.length} content pages.`);
