const capabilities = [
 {title:'Profile & precision cutting',image:'cutting',short:'Laser, plasma and profile cutting. The starting point for exceptional components.',details:'Large-format cutting capabilities provide the foundation for downstream forming, fabrication and machining.',specs:['4 kW and 12 kW CNC laser cutting equipment at Unit I','Plasma cutting up to 30 mm at Unit I','Profile cutting up to 300 mm at Unit I','15,000 × 3,500 mm plasma / profile cutting bed']},
 {title:'Bending & forming',image:'bending',short:'CNC press brake capability that brings shape to your specifications.',details:'Press brake and bending facilities support formed components as part of our integrated manufacturing workflow.',specs:['CNC press brake facilities','Bending capability at Unit IV','Coordinated with cutting and fabrication']},
 {title:'Heavy fabrication',image:'fabrication',short:'Welding expertise and infrastructure for demanding fabricated assemblies.',details:'Heavy fabrication brings together qualified welders and multiple welding processes, supported by material handling infrastructure.',specs:['MIG, TIG, ARC and SAW welding','Robotic welding equipment at Unit II','Overhead crane infrastructure across manufacturing units']},
 {title:'Precision machining',image:'machining',short:'Complex geometries. Large components. Carefully controlled execution.',details:'A broad machining base allows TPPL to coordinate multiple operations across demanding engineered components.',specs:['VMC, HMC, VTL and horizontal boring machines','Plano milling, turning and drilling','Heavy-duty double-column VMC at Unit IV']},
 {title:'Surface treatment',image:'finishing',short:'Protecting performance with integrated preparation and finishing.',details:'Dedicated surface treatment facilities complete the manufacturing sequence, with preparation and finishing capabilities available at Unit II.',specs:['Shot blasting booth','Powder coating / painting booth','Stress relieving facilities']},
 {title:'Quality & measurement',image:'quality',short:'Attention to detail, from dimensional checks to the final surface finish.',details:'Quality and measurement are integrated into the manufacturing workflow, supported by the ISO 9001:2015 quality management system described in our corporate profile.',specs:['Dimensional measurement','Dry-film-thickness controls','Surface table infrastructure']}
];
const products=[{name:'Stator frame for TDPS',category:'frames',label:'Power generation',image:1,description:'A fabricated stator frame from TPPL’s power generation product portfolio.'},{name:'Stator frame',category:'frames',label:'Engineered fabrication',image:2,description:'Stator frame fabrication for industrial equipment applications.'},{name:'NDE end shield',category:'shields',label:'Power generation',image:3,description:'Non-drive-end shield for TD Power, featured in the TPPL product range.'},{name:'DE end shield',category:'shields',label:'Power generation',image:4,description:'Drive-end shield for TD Power, featured in the TPPL product range.'},{name:'Compression plate',category:'plates',label:'Precision components',image:5,description:'Compression plate manufacturing from TPPL’s precision component portfolio.'}];
const units=[{name:'Talawade, Pune',image:'talawade',area:'40,000',crane:'Up to 20 tonnes',text:'Cutting, bending and machining capabilities at our Talawade facility. CNC laser and plasma / profile cutting equipment support the first stages of integrated manufacturing.',equipment:'CNC laser cutting · CNC press brake · 5-axis VMC'},{name:'Solu, Alandi, Pune',image:'solu',area:'160,000',crane:'Up to 40 tonnes',text:'A broad manufacturing base with machining, welding and surface treatment facilities. Dedicated painting, shot blasting and stress relieving infrastructure supports finishing operations.',equipment:'VMC & HMC · Horizontal boring · Robotic welding'},{name:'Chakan, Wasuli, Pune',image:'chakan',area:'46,000',crane:'10-tonne cranes',text:'A machining and fabrication facility in the Chakan industrial area, with vertical turning, milling, grinding and cutting capabilities.',equipment:'VTL · VMC · Cylindrical grinding'},{name:'Khandala, Satara',image:'khandala',area:'70,000',crane:'Up to 32 tonnes',text:'Heavy machining infrastructure at Khandala, with double-column VMC, horizontal machining, drilling, bending and laser cutting facilities.',equipment:'Double-column VMC · HMC · Laser cutting'}];
const dialog=document.querySelector('#detail-dialog');
function openDetail(title,image,description,specs=[]){document.querySelector('#dialog-body').innerHTML=`<img src="${image}" alt="${title}"><div class="dialog-copy"><p class="eyebrow">TPPL / ENGINEERING CAPABILITIES</p><h2>${title}</h2><p>${description}</p>${specs.length?`<ul>${specs.map(s=>`<li>${s}</li>`).join('')}</ul>`:''}<a class="button dark dialog-enquire" href="#contact">Discuss your requirement </a></div>`;dialog.showModal();document.body.classList.add('modal-open');document.querySelector('.dialog-enquire').addEventListener('click',()=>{dialog.close();const service=document.querySelector('select[name=service]');service.value=({'Profile & precision cutting':'Profile & laser / plasma cutting','Precision machining':'Heavy machining'}[title] || (capabilities.some(c=>c.title===title)?title:'Product enquiry'));service.dispatchEvent(new Event('change'));});}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#cap-grid').innerHTML=capabilities.map((c,i)=>`<button class="cap-card" data-cap="${i}" aria-label="Explore ${c.title}"><div class="cap-photo"><img src="/assets/${c.image}.webp" alt="${c.title} equipment at TPPL" loading="lazy"></div><div class="cap-body"><h3>${c.title}</h3><p>${c.short}</p><span class="card-action">Explore capability</span></div></button>`).join('');
document.querySelectorAll('[data-cap]').forEach(b=>b.addEventListener('click',()=>{const c=capabilities[Number(b.dataset.cap)];openDetail(c.title,`/assets/${c.image}.webp`,c.details,c.specs);}));
function renderProducts(filter='frames'){document.querySelector('#product-grid').innerHTML=products.filter(p=>p.category===filter).map(p=>`<button class="product-card" data-product="${p.image}" aria-label="View ${p.name}"><div class="product-photo"><img src="/assets/product-${p.image}.webp" alt="${p.name} manufactured by TPPL" loading="lazy"></div><small>${p.label}</small><h3>${p.name}</h3><span class="card-action">View component</span></button>`).join('');document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{const p=products.find(p=>p.image===Number(b.dataset.product));openDetail(p.name,`/assets/product-${p.image}.webp`,p.description+' Contact our team to discuss your drawings, materials, dimensions and quantities.');}));}
renderProducts('frames');document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});renderProducts(b.dataset.filter);}));
function renderUnit(i){
 document.dispatchEvent(new CustomEvent('plant-change',{detail:i}));
 const u=units[i];
 document.querySelectorAll('[data-unit]').forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;});
 const panel=document.querySelector('#facility-panel');
 panel.setAttribute('aria-labelledby',`tab-${i}`);
 panel.innerHTML=`<div class="facility-visual"><img src="/assets/${u.image}.webp" alt="TPPL manufacturing unit at ${u.name}" loading="eager"><span class="facility-visual-tag" aria-hidden="true">TPPL / UNIT 0${i+1}</span></div><div class="facility-copy"><p class="eyebrow">UNIT 0${i+1} / MAHARASHTRA</p><h3>${u.name}</h3><p class="facility-description">${u.text}</p><div class="facility-expertise"><span>CORE CAPABILITIES</span><div>${u.equipment.split(' · ').map(item=>`<span>${item}</span>`).join('')}</div></div><div class="facility-meta"><div><strong>${u.area}</strong><span>Square feet of plant area</span></div><div><strong>${u.crane}</strong><span>Crane infrastructure</span></div></div><a class="facility-link" href="#quality">Explore this plant's machinery</a></div>`;
}
renderUnit(0);document.querySelectorAll('[data-unit]').forEach(b=>{b.addEventListener('click',()=>renderUnit(Number(b.dataset.unit)));b.addEventListener('keydown',e=>{let i=Number(b.dataset.unit);if(e.key==='ArrowRight')i=(i+1)%4;else if(e.key==='ArrowLeft')i=(i+3)%4;else if(e.key==='Home')i=0;else if(e.key==='End')i=3;else return;e.preventDefault();renderUnit(i);document.querySelector(`#tab-${i}`).focus();});});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
const contactLink=nav.querySelector('.nav-cta');
for(const link of nav.querySelectorAll(':scope>a')){if(link.textContent.trim().toLowerCase()==='about us')link.remove();}
if(!nav.querySelector('a[href="#home"]')){const home=document.createElement('a');home.href='#home';home.textContent='Home';nav.prepend(home);}
if(!nav.querySelector('a[href="#infrastructure"]')){const infrastructure=document.createElement('a');infrastructure.href='#infrastructure';infrastructure.textContent='Infrastructure';nav.insertBefore(infrastructure,contactLink);}
contactLink.href='/contact-us.html';contactLink.textContent='Contact Us';
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});
document.querySelectorAll('.nav-group>button').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));button.parentElement.classList.toggle('open',!open);}));
const footerLinks=document.querySelector('.footer-links');
if(footerLinks){const enquiry=footerLinks.querySelector('a[href="#contact"]');for(const [href,label] of [['#infrastructure','Infrastructure'],['#quality','Quality'],['#testimonials','Testimonials']]){if(!footerLinks.querySelector(`a[href="${href}"]`)){const link=document.createElement('a');link.href=href;link.textContent=label;footerLinks.insertBefore(link,enquiry);}}}
document.querySelector('#year').textContent=new Date().getFullYear();
// Keep optional specifications together without discarding any enquiry fields.
const enquiryForm = document.querySelector('#enquiry-form');
const specificationDisclosure = document.createElement('details');
specificationDisclosure.className = 'enquiry-specifications';
const specificationSummary = document.createElement('summary');
specificationSummary.textContent = 'Add technical specifications, quantity & delivery';
specificationDisclosure.append(specificationSummary);
const specificationFields = document.querySelector('#service-fields');
enquiryForm.insertBefore(specificationDisclosure, specificationFields);
specificationDisclosure.append(
  enquiryForm.querySelector('[name="material"]').closest('.form-row'),
  specificationFields,
  enquiryForm.querySelector('[name="delivery"]').closest('.form-row')
);
const heroVideo = document.querySelector('.hero-video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateHeroVideo() {
  if (reducedMotion.matches || document.hidden) {
    heroVideo.pause();
    return;
  }
  heroVideo.play().catch(() => {});
}
reducedMotion.addEventListener('change', updateHeroVideo);
document.addEventListener('visibilitychange', updateHeroVideo);
updateHeroVideo();
const aboutFilm = document.querySelector('.about-film-video');
if (aboutFilm) {
  let inView = false;
  const syncAboutFilm = () => {
    if (inView && !document.hidden && !reducedMotion.matches) {
      aboutFilm.play().catch(() => {});
    } else aboutFilm.pause();
  };
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncAboutFilm();
  }, { threshold: 0.2 }).observe(aboutFilm);
  document.addEventListener('visibilitychange', syncAboutFilm);
  reducedMotion.addEventListener('change', syncAboutFilm);
}

document.querySelector('.corporate-footer .footer-bottom')?.insertAdjacentHTML('beforeend',
  '<div class="footer-credit"><span>Designed and developed by</span><span class="footer-credit-logo" aria-label="Greyvector"><img src="/assets/greyvector-mark.svg" alt="" width="30" height="31"><span class="greyvector-wordmark"><span>grey</span><span>vector</span></span></span></div>');
