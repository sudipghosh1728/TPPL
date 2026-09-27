const processes=[
 {name:'Cutting',title:'A precise beginning.',text:'Laser and plasma cutting turn raw plate into the starting point of your component.',readout:'12',unit:'kW',label:'CNC laser power · Unit I',mode:'cutting'},
 {name:'Forming',title:'Shape, under control.',text:'CNC press brake facilities transform cut profiles into formed components.',readout:'CNC',unit:'',label:'Press brake capability',mode:'forming'},
 {name:'Fabrication',title:'Strength in every joint.',text:'MIG, TIG, ARC and SAW welding bring individual parts together into engineered assemblies.',readout:'4',unit:'processes',label:'Welding processes in the profile',mode:'fabrication'},
 {name:'Machining',title:'Geometry, refined.',text:'Milling, boring, turning and drilling deliver the next stage of component manufacturing.',readout:'5',unit:'axis',label:'VMC capability · Unit I',mode:'machining'},
 {name:'Finishing',title:'Ready for what follows.',text:'Shot blasting, painting and stress relieving complete the manufacturing sequence.',readout:'SR',unit:'',label:'Stress relieving · Unit II',mode:'finishing'}
];
function gear(cx,cy,r,teeth){let d='';for(let i=0;i<teeth*4;i++){let a=i*Math.PI*2/(teeth*4),rad=i%4===0||i%4===3?r*.84:r;d+=`${i?'L':'M'}${(Math.cos(a)*rad).toFixed(2)},${(Math.sin(a)*rad).toFixed(2)} `;}return `<g transform="translate(${cx} ${cy})"><g class="gear-spin"><path d="${d}Z"/><circle r="${r*.62}"/><circle r="${r*.22}"/><path d="M ${-r*.6} 0H ${r*.6}M 0 ${-r*.6}V ${r*.6}"/></g></g>`;}
document.querySelector('#mechanical-console').innerHTML=`<div class="machine-layout"><div class="machine-visual" data-mode="cutting"><div class="console-header"><span><i></i> PROCESS EXPLORER</span></div><svg viewBox="0 0 760 410" role="img" aria-label="Animated schematic of cutting, forming, welding, machining and surface treatment"><defs><pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#759db9" stroke-opacity=".13"/></pattern><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#acc5d7"/><stop offset=".4" stop-color="#416d8b"/><stop offset=".6" stop-color="#d6e5ef"/><stop offset="1" stop-color="#365975"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3"/></filter></defs><rect width="760" height="410" fill="url(#grid)"/><g class="mechanical-gears">${gear(125,130,70,16)}${gear(226,163,43,12)}</g><g class="machine-frame"><path d="M295 95H680V310H640V135H335V310H295Z" fill="url(#metal)"/><path d="M270 315H710V339H270Z" fill="url(#metal)"/><path d="M275 350H705M305 358V373M675 358V373"/><path d="M365 292H615V306H365Z" fill="#7396ad"/></g><g class="machine-head"><path d="M435 136H505V210H435Z" fill="url(#metal)"/><path d="M450 210H490L479 242H461Z" fill="#bdcfdc"/><path class="tool-bit" d="M470 242V287"/><path class="beam" d="M470 243V292"/><circle class="spark" cx="470" cy="292" r="13" fill="#ff9b3f" filter="url(#glow)"/><path class="spark-rays" d="M470 288l-25 -16m25 16l28 -12m-28 12l-17 7m17 -7l21 8"/><g class="spray"><path d="M462 246L430 287M470 246V287M478 246L510 287"/></g></g><path class="toolpath" d="M380 290H610"/><g class="dimension-lines"><path d="M295 380H680M295 373V387M680 373V387"/><text x="485" y="400" text-anchor="middle">ENGINEERED TO YOUR DRAWING</text><path d="M725 95V339M718 95H732M718 339H732"/></g><g class="axis-labels"><text x="35" y="315">Z</text><text x="95" y="373">X</text><path d="M45 355V320M45 355H90"/></g></svg><div class="console-bottom"><span>PROCESS VISUALISATION</span><span>SELECT A PROCESS TO EXPLORE</span></div></div><div class="machine-details"><div class="process-tabs" role="group" aria-label="Manufacturing process">${processes.map((p,i)=>`<button type="button" data-process="${i}" aria-pressed="${i===0}">${p.name}</button>`).join('')}</div><div id="process-copy" aria-live="polite"></div><a class="button accent" href="#contact">Discuss your component</a></div></div>`;
document.querySelectorAll('[data-process]').forEach((button,i)=>button.insertAdjacentHTML('afterbegin',`<small aria-hidden="true">0${i+1}</small>`));
function selectProcess(i){
 const p=processes[i];
 const visual=document.querySelector('.machine-visual');
 visual.dataset.mode=p.mode;
 visual.style.setProperty('--stage',`${(i+1)*20}%`);
 visual.querySelector('.console-bottom span:last-child').textContent=`0${i+1} / 05 · ${p.name.toUpperCase()}`;
 document.querySelectorAll('[data-process]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.process)===i)));
 document.querySelector('#process-copy').innerHTML=`<div class="process-copy-meta"><span>PROCESS 0${i+1} / 05</span><span>ENGINEERED IN MOTION</span></div><h3>${p.title}</h3><p>${p.text}</p><div class="process-reading-card"><span class="process-reading-kicker">CAPABILITY SNAPSHOT</span><div class="machine-reading"><strong>${p.readout}</strong><span>${p.unit}</span></div><p class="reading-label">${p.label}</p></div>`;
}
selectProcess(0);document.querySelectorAll('[data-process]').forEach(b=>b.addEventListener('click',()=>selectProcess(Number(b.dataset.process))));
// Plant-specific capabilities and machinery are rendered by plant-quality.js.
const serviceFields={
 'Profile & laser / plasma cutting':[['Cutting process','Laser / plasma / profile'],['Plate thickness (mm)','e.g. 12'],['Blank dimensions (mm)','Length × width']],
 'Bending & forming':[['Plate thickness (mm)','e.g. 6'],['Bend length (mm)','e.g. 1500'],['Bend angle / radius','e.g. 90°, R8']],
 'Heavy fabrication':[['Assembly dimensions (mm)','Length × width × height'],['Estimated weight (kg)','e.g. 2500'],['Welding requirements','Process, weld standard or inspection']],
 'Heavy machining':[['Component dimensions (mm)','Length × width × height / diameter'],['Required operations','Milling, boring, turning, drilling'],['Tolerance / surface finish','As per drawing or specify']],
 'Surface treatment':[['Treatment required','Shot blasting / painting / stress relieving'],['Component dimensions (mm)','Length × width × height'],['Coating / finish specification','System, colour, DFT or standard']],
 'Quality & measurement':[['Inspection required','Dimensional / dry-film thickness'],['Component dimensions (mm)','Length × width × height'],['Acceptance criteria','Drawing, tolerance or standard']],
 'Product enquiry':[['Product type','Stator frame, end shield, plate…'],['Component dimensions (mm)','As per drawing'],['Application','Equipment / industry']],
 'General manufacturing enquiry':[['Scope of work','Describe the processes required']]
};
const service=document.querySelector('select[name=service]');service.addEventListener('change',()=>{const fields=serviceFields[service.value]||[];document.querySelector('#service-fields').innerHTML=fields.length?`<fieldset class="technical-fields"><legend>${service.value.replaceAll('&','&amp;')} requirements</legend>${fields.map(([label,placeholder],i)=>`<label>${label}<input name="spec_${i}" data-label="${label}" placeholder="${placeholder}" maxlength="180"></label>`).join('')}</fieldset>`:'';});
document.querySelector('#enquiry-form').addEventListener('submit', e => {
  e.preventDefault();

  const form = e.currentTarget;
  const formStatus = document.querySelector('#form-status');
  const formData = new FormData(form);
  const payload = {};

  for (const [key, value] of formData) {
    if (!String(value).trim()) continue;
    payload[key] = String(value).trim();
  }

  const serviceName = String(payload.service || 'General manufacturing enquiry');
  const companyName = String(payload.company || '');
  const labels = {
    name: 'Name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    service: 'Service',
    industry: 'Industry',
    material: 'Material / grade',
    quantity: 'Quantity (pieces)',
    delivery: 'Required delivery',
    drawing: 'Drawing reference',
    message: 'Project details'
  };

  const lines = [];
  for (const [key, value] of Object.entries(payload)) {
    const label = labels[key] || key;
    lines.push(`${label}: ${value}`);
  }

  const subject = `Project enquiry: ${serviceName}${companyName ? ` — ${companyName}` : ''}`;
  const mail = `mailto:vinayak@tpplpune.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('vinayak@tpplpune.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton ? submitButton.textContent : 'Prepare project enquiry';

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Opening mail draft…';
  }

  if (formStatus) {
    formStatus.textContent = 'Opening your email draft…';
  }

  window.location.href = gmail;

  setTimeout(async () => {
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recipient: 'vinayak@tpplpune.com' })
      });
    } catch (error) {
      // Ignore backend errors here; the draft-open action remains the primary user flow.
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }

    if (formStatus) {
      formStatus.textContent = 'Your project draft is ready to open in your email app. If no app opens, the browser may have opened a webmail draft instead. You can also email vinayak@tpplpune.com directly.';
    }
  }, 250);
});

document.querySelectorAll("[data-industry]").forEach(card=>card.addEventListener("click",()=>{document.querySelector("input[name=industry]").value=card.dataset.industry;}));
