const body = document.body;
const content = document.querySelector('#page-content');
const response = await fetch('/content/site-data.json');
if (!response.ok) throw new Error('Unable to load TPPL site content.');
const data = await response.json();
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const clean = (value = '') => value.replaceAll('�', '—').replace(/\s+/g, ' ').trim();
const slugify = (value = '') => clean(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

function hero(kicker, title, intro) {
  return `<section class="inner-hero"><p>${esc(kicker)}</p><h1>${esc(title)}</h1><span>${esc(intro)}</span></section>`;
}
function cardImage(item, fallback = '/assets/machining.webp') {
  return item.images?.[0]?.path || fallback;
}
function renderBlocks(blocks) {
  let html = '';
  for (const block of blocks || []) {
    if (block.type === 'image') html += `<img class="detail-image" src="${esc(block.path)}" alt="${esc(block.alt)}" loading="lazy">`;
    else if (block.type === 'h2') html += `<h2 id="${slugify(block.text)}">${esc(clean(block.text))}</h2>`;
    else if (['h3','h4'].includes(block.type)) html += `<h3>${esc(clean(block.text))}</h3>`;
    else if (block.type === 'p') html += `<p>${esc(clean(block.text))}</p>`;
    else if (block.type === 'list') html += `<ul class="detail-list">${block.items.map((item) => `<li>${esc(clean(item))}</li>`).join('')}</ul>`;
    else if (block.type === 'table') html += `<div class="table-scroll"><table>${block.rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? 'th':'td'}>${esc(clean(cell))}</${index === 0 ? 'th':'td'}>`).join('')}</tr>`).join('')}</table></div>`;
  }
  return html;
}
function productSidebar(active = '') {
  return `<aside class="detail-tree"><h2>Product range</h2>${data.products.map((p) => `<a class="${p.slug === active ? 'active':''}" href="/products/${p.slug}.html">${esc(p.name)}</a>`).join('')}</aside>`;
}
function serviceSidebar(active = '') {
  return `<aside class="detail-tree"><h2>Services</h2>${data.services.map((s) => `<a class="${s.slug === active ? 'active':''}" href="/services/${s.slug}.html">${esc(s.name)}</a>`).join('')}</aside>`;
}
function renderProducts() {
  content.innerHTML = hero('COMPLETE PRODUCT PORTFOLIO', 'Products engineered for industry.', 'Twenty engineered product categories for demanding industrial applications.') + `<section class="page-section"><div class="catalog-grid">${data.products.map((p) => `<a class="catalog-card" href="/products/${p.slug}.html"><img src="${cardImage(p, '/assets/product-1.webp')}" alt="${esc(p.name)}" loading="lazy"><div><span>${p.unavailable ? 'PROJECT-SPECIFIC PRODUCT':'ENGINEERED PRODUCT'}</span><h2>${esc(p.name)}</h2><p>${p.unavailable ? 'Contact our engineering team for specifications, configurations and application support.' : esc(clean(p.blocks.find((b) => b.type === 'p')?.text || 'View product description, specifications and benefits.'))}</p><strong>View details</strong></div></a>`).join('')}</div></section>`;
}
function renderServices() {
  content.innerHTML = hero('END-TO-END MANUFACTURING', 'Services from first cut to final finish.', 'Integrated processes, technical capabilities and production specifications.') + `<section class="page-section"><div class="service-index">${data.services.map((s) => `<a href="/services/${s.slug}.html"><img src="${cardImage(s, '/assets/cutting.webp')}" alt="${esc(s.name)}" loading="lazy"><div><span>MANUFACTURING SERVICE</span><h2>${esc(s.name)}</h2><p>${s.blocks.filter((b) => b.type === 'h2').length} documented processes</p><strong>Explore capabilities</strong></div></a>`).join('')}</div></section>`;
}
function renderProduct() {
  const item = data.products.find((p) => p.slug === body.dataset.slug);
  if (!item) return notFound();
  const detail = item.unavailable
    ? `<div class="source-notice"><strong>Engineered to requirement</strong><p>Valve Body configurations are developed for project-specific applications. Share your drawings, material grade and operating requirements with our engineering team.</p></div>`
    : renderBlocks(item.blocks);
  content.innerHTML = hero('PRODUCT DETAIL', item.name, 'Description, technical specifications and product benefits.') + `<section class="page-section detail-layout">${productSidebar(item.slug)}<article class="detail-content">${item.images?.[0] ? `<img class="detail-cover" src="${item.images[0].path}" alt="${esc(item.name)}">` : ''}<p class="source-label">TPPL ENGINEERED PRODUCT</p>${detail}<div class="detail-cta"><h2>Discuss your component requirement.</h2><a href="/#contact">Send a project enquiry</a></div></article></section>`;
}
function renderService() {
  const item = data.services.find((s) => s.slug === body.dataset.slug);
  if (!item) return notFound();
  content.innerHTML = hero('SERVICE DETAIL', item.name, 'Process descriptions, applications and technical specifications.') + `<section class="page-section detail-layout">${serviceSidebar(item.slug)}<article class="detail-content service-detail"><nav class="on-page" aria-label="Processes on this page">${item.blocks.filter((b) => b.type === 'h2').map((b) => `<a href="#${slugify(b.text)}">${esc(clean(b.text))}</a>`).join('')}</nav>${renderBlocks(item.blocks)}<div class="detail-cta"><h2>Have drawings or a specific process requirement?</h2><a href="/#contact">Send a service enquiry</a></div></article></section>`;
}
function renderGallery() {
  content.innerHTML = hero('OUR WORK', 'Manufacturing gallery.', 'A closer look at TPPL facilities, processes and engineered components.') + `<section class="page-section"><div class="gallery-grid">${data.gallery.images.map((img, i) => `<button type="button" data-gallery="${i}" aria-label="Open gallery image ${i+1}"><img src="${img.path}" alt="${esc(img.alt || `TPPL gallery image ${i+1}`)}" loading="lazy"></button>`).join('')}</div>${data.gallery.videos.length ? `<div class="video-gallery"><h2>Our videos</h2>${data.gallery.videos.map((video) => `<video controls preload="metadata" playsinline><source src="${video.path}" type="video/mp4">Your browser does not support video.</video>`).join('')}</div>`:''}</section><dialog class="gallery-dialog"><button type="button" aria-label="Close image">×</button><img alt=""></dialog>`;
  const dialog = content.querySelector('.gallery-dialog');
  content.querySelectorAll('[data-gallery]').forEach((button) => button.addEventListener('click', () => {
    const img = data.gallery.images[Number(button.dataset.gallery)]; dialog.querySelector('img').src = img.path; dialog.querySelector('img').alt = img.alt || 'TPPL gallery image'; dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
}
function renderClients() {
  content.innerHTML = hero('CUSTOMER PORTFOLIO', 'Trusted across industries.', 'Partnerships supporting leading manufacturers and engineering businesses.') + `<section class="page-section"><div class="all-client-grid">${data.clients.images.map((img, i) => `<div><img src="${img.path}" alt="Client logo ${i+1}" loading="lazy"></div>`).join('')}</div><p class="client-note">Company marks are presented as part of TPPL’s customer portfolio.</p></section>`;
}
function renderAbout() {
  const images = data.about.images || [];
  const branches = [
    ['Solu, Alandi, Pune', '160,000 sq. ft.', 'Gate No. 97/4, Solu Markal Road, Alandi, Pune 412105', images[2]?.path || '/assets/solu.webp'],
    ['Khandala, Satara', '70,000 sq. ft.', 'Plot No. PAP 72/4, Khandala Industrial Area, PH-1, Village Kesudi, Satara 412802', images[3]?.path || '/assets/khandala.webp'],
    ['Talawade, Pune', '40,000 sq. ft.', 'Gat No. 79/80, Bhalekar Chowk, Jyotiba Nagar, Talawade, Pune 412114', images[4]?.path || '/assets/talawade.webp'],
    ['Chakan, Wasuli, Pune', '46,000 sq. ft.', 'Plot No. PAP-V/154, Chakan Industrial Area, Phase II, Wasuli, Pune 410501', '/assets/chakan.webp'],
  ];
  content.innerHTML = hero('ABOUT TPPL', 'Engineering with purpose since 1997.', 'Company history, mission, vision and manufacturing footprint.') + `<section class="page-section about-page"><div class="about-page-intro"><div><p class="source-label">TALEGAONKAR PROFILES PRIVATE LIMITED</p><h2>One partner for integrated steel manufacturing.</h2></div><div><p>Established in 1997 and headquartered in Pune, TPPL is a trusted name in steel fabrication, engineering solutions and steel trading. We serve industries across India and international markets.</p><p>Our services span sheet-metal and profile cutting, bending, heavy fabrication, machining and surface treatment. Four manufacturing units provide a combined footprint of 316,000 sq. ft.</p></div></div><div class="mission-grid"><article><span>MISSION</span><h2>Precision fabrication with integrity.</h2><p>Provide world-class steel fabrication, profiling and end-to-end engineering solutions on time and with uncompromising quality through advanced manufacturing, responsible sourcing and continuous innovation.</p></article><article><span>VISION</span><h2>A trusted, innovative partner.</h2><p>Become a benchmark partner for manufacturers worldwide through sustainable practices, on-time delivery and technical expertise that supports customer success.</p></article></div><div class="branch-heading"><p class="source-label">OUR MANUFACTURING BRANCHES</p><h2>Four units. One shared standard.</h2></div><div class="branch-grid">${branches.map(([name,area,address,image]) => `<article><img src="${image}" alt="TPPL ${esc(name)} manufacturing unit" loading="lazy"><div><strong>${esc(area)}</strong><h3>${esc(name)}</h3><p>${esc(address)}</p></div></article>`).join('')}</div>${data.about.videos?.length ? `<div class="video-gallery about-videos"><h2>Company videos</h2>${data.about.videos.map((video) => `<video controls preload="metadata" playsinline><source src="${video.path}" type="video/mp4">Your browser does not support video.</video>`).join('')}</div>`:''}</section>`;
}
function renderContact() {
  content.innerHTML = hero('PROJECT ENQUIRY', 'Let’s define your requirement.', 'Share the technical information our team needs to review your project.') + `<section class="page-section contact-page"><div class="contact-directory"><p class="source-label">START A CONVERSATION</p><h2>Your next challenge.<br>Our next collaboration.</h2><p>Tell us what you’re building. Our team can help you explore the right manufacturing capabilities for your project.</p><div><span>EMAIL</span><a href="mailto:vinayak@tpplpune.com">vinayak@tpplpune.com</a><a href="mailto:mahendra@tpplpune.com">mahendra@tpplpune.com</a></div><div><span>PHONE</span><a href="tel:+919096163333">+91 90961 63333</a><a href="tel:+919890056943">+91 98900 56943</a></div><div><span>HEAD OFFICE</span><address>Gat No. 79 &amp; 80, Jyotiba Nagar, Bhalekar Chowk, Talawade, Pune 412114, Maharashtra, India.</address></div></div><form class="standalone-enquiry"><p class="source-label">PROJECT ENQUIRY</p><h2>Let’s define your requirement.</h2><div class="enquiry-row"><label>Your name *<input required name="name" autocomplete="name" placeholder="Full name" maxlength="100"></label><label>Company *<input required name="company" autocomplete="organization" placeholder="Company name" maxlength="150"></label></div><div class="enquiry-row"><label>Work email *<input required type="email" name="email" autocomplete="email" placeholder="you@company.com"></label><label>Phone<input type="tel" name="phone" autocomplete="tel" placeholder="Country code & phone" maxlength="30"></label></div><label>Service required *<select required name="service"><option value="">Select a manufacturing service</option><option>Profile & laser / plasma cutting</option><option>Bending & forming</option><option>Heavy fabrication</option><option>Heavy machining</option><option>Surface treatment</option><option>Quality & measurement</option><option>Product enquiry</option><option>General manufacturing enquiry</option></select></label><div class="enquiry-row"><label>Material / grade<input name="material" placeholder="e.g. Mild steel, IS 2062" maxlength="120"></label><label>Quantity (pieces)<input type="number" min="1" step="1" name="quantity" placeholder="e.g. 25"></label></div><label>Industry<input name="industry" placeholder="e.g. Power, automotive, infrastructure" maxlength="100"></label><div id="standalone-service-fields" aria-live="polite"></div><div class="enquiry-row"><label>Required delivery date<input type="date" name="delivery"></label><label>Drawing reference<input name="drawing" placeholder="Drawing number / revision" maxlength="120"></label></div><label>Project details *<textarea required name="message" rows="5" placeholder="Application, specifications, tolerances and special requirements…" maxlength="4000"></textarea></label><button type="submit">Prepare project enquiry</button><p class="form-help">Your email app will open with the project information ready. Attach drawings there before sending.</p><p role="status"></p></form></section>`;
  const form = content.querySelector('form');
  const serviceFields = {
    'Profile & laser / plasma cutting':[['Cutting process','Laser / plasma / profile'],['Plate thickness (mm)','e.g. 12'],['Blank dimensions (mm)','Length × width']],
    'Bending & forming':[['Plate thickness (mm)','e.g. 6'],['Bend length (mm)','e.g. 1500'],['Bend angle / radius','e.g. 90°, R8']],
    'Heavy fabrication':[['Assembly dimensions (mm)','Length × width × height'],['Estimated weight (kg)','e.g. 2500'],['Welding requirements','Process, standard or inspection']],
    'Heavy machining':[['Component dimensions (mm)','Length × width × height / diameter'],['Required operations','Milling, boring, turning, drilling'],['Tolerance / surface finish','As per drawing or specify']],
    'Surface treatment':[['Treatment required','Shot blasting / painting / stress relieving'],['Component dimensions (mm)','Length × width × height'],['Finish specification','System, colour, DFT or standard']],
    'Quality & measurement':[['Inspection required','Dimensional / dry-film thickness'],['Component dimensions (mm)','Length × width × height'],['Acceptance criteria','Drawing, tolerance or standard']],
    'Product enquiry':[['Product type','Stator frame, end shield, plate…'],['Component dimensions (mm)','As per drawing'],['Application','Equipment / industry']],
    'General manufacturing enquiry':[['Scope of work','Describe the processes required']],
  };
  const service = form.elements.service;
  service.addEventListener('change', () => { const fields = serviceFields[service.value] || []; content.querySelector('#standalone-service-fields').innerHTML = fields.length ? `<fieldset class="standalone-technical"><legend>${esc(service.value)} requirements</legend>${fields.map(([label,placeholder], i) => `<label>${esc(label)}<input name="spec_${i}" data-label="${esc(label)}" placeholder="${esc(placeholder)}" maxlength="180"></label>`).join('')}</fieldset>` : ''; });
  form.addEventListener('submit', (event) => {
    event.preventDefault(); const values = new FormData(form);
    const names = {name:'Name',company:'Company',email:'Email',phone:'Phone',service:'Service',material:'Material / grade',quantity:'Quantity',industry:'Industry',delivery:'Required delivery',drawing:'Drawing reference',message:'Project details'};
    const bodyText = [...values].filter(([,value]) => String(value).trim()).map(([key,value]) => `${names[key] || form.elements.namedItem(key)?.dataset.label || key}: ${value}`).join('\n\n');
    location.href = `mailto:vinayak@tpplpune.com?subject=${encodeURIComponent(`Website enquiry — ${values.get('company')}`)}&body=${encodeURIComponent(bodyText)}`;
    form.querySelector('[role=status]').textContent = 'Your email draft is ready. Attach drawings in your email app before sending.';
  });
}
function notFound() { content.innerHTML = hero('NOT FOUND', 'Page unavailable.', 'Return to the complete catalog.') + '<section class="page-section"><a href="/products.html">View all products</a></section>'; }

({ products:renderProducts, services:renderServices, product:renderProduct, service:renderService, gallery:renderGallery, clients:renderClients, about:renderAbout, contact:renderContact }[body.dataset.page] || notFound)();
document.querySelector('.menu-toggle').addEventListener('click', (event) => { const nav = document.querySelector('#inner-navigation'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.querySelectorAll('.nav-group>button').forEach((button) => button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!open)); button.parentElement.classList.toggle('open', !open); }));
document.querySelector('.page-footer')?.insertAdjacentHTML('beforeend',
  '<div class="footer-credit"><span>Designed and developed by</span><span class="footer-credit-logo" aria-label="Greyvector"><img src="/assets/greyvector-mark.svg" alt="" width="30" height="31"><span class="greyvector-wordmark"><span>grey</span><span>vector</span></span></span></div>');
