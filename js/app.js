'use strict';
const $id = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getRestaurant = id => RESTAURANTS.find(r => r.id === id);
const money = n => `J$${n.toLocaleString('en-JM')}`;
const priceLabel = n => '$'.repeat(n);
function card(r) {
  return `<div class="col-md-6 col-xl-4"><article class="k-card"><img src="${r.image}" alt="Illustrative food or dining image for fictional ${esc(r.name)}" loading="lazy"><div class="card-body"><div class="d-flex justify-content-between align-items-center gap-2 mb-3"><span class="pill">${esc(r.category)}</span><span class="rating">★ ${r.rating.toFixed(1)} <small class="muted">(${r.reviews})</small></span></div><h3>${esc(r.name)}</h3><p class="small muted">${esc(r.area)} · ${priceLabel(r.price)}</p><p class="muted">${esc(r.description)}</p><p class="small"><strong>Popular dish:</strong> ${esc(r.menu.find(x=>x[0]==='Mains')?.[1]||r.menu[0][1])}</p><div class="d-flex flex-wrap gap-2 mt-3"><button type="button" class="btn btn-outline-main btn-sm details-btn" data-id="${r.id}">View menu & details</button><a class="btn btn-main btn-sm" href="reservation.html?restaurant=${r.id}">Plan a visit</a></div></div></article></div>`;
}
function menuHTML(r,filter='All') {
  const groups = [...new Set(r.menu.map(item => item[0]))];
  const items = filter === 'All' ? r.menu : r.menu.filter(item => item[0] === filter);
  const heatLabels = ['Mild', 'Medium', 'Hot', 'Extra hot'];
  const dishes = items.map(([group,name,price,description,heat,vegetarian]) => {
    const heatBadge = heat > 0 ? `<span class="dish-tag spice-${heat}" aria-label="Spice level: ${heatLabels[heat]}">🌶 ${heatLabels[heat]}</span>` : '<span class="dish-tag mild">Mild</span>';
    const vegBadge = vegetarian ? '<span class="dish-tag veggie">Vegetarian</span>' : '';
    return `<article class="menu-row d-flex justify-content-between gap-3"><div class="flex-grow-1"><span class="small muted">${esc(group)}</span><h4 class="h6 mb-1">${esc(name)}</h4><p class="small muted mb-2">${esc(description)}</p><div class="d-flex flex-wrap gap-2">${heatBadge}${vegBadge}</div></div><strong class="menu-price" aria-label="Price ${money(price)}">${money(price)}</strong></article>`;
  }).join('');
  return `<div class="menu-tabs my-3" role="group" aria-label="Menu categories">${['All',...groups].map(g=>`<button class="btn btn-sm btn-outline-main menu-filter ${g===filter?'active':''}" aria-pressed="${g===filter}" data-menu="${esc(g)}" data-id="${r.id}" type="button">${esc(g)}</button>`).join('')}</div><p class="small muted mb-2">🌶 Spice levels are indicative. Ask about ingredients and allergies before ordering.</p><div>${dishes}</div>`;
}
function showDetails(id) {
  const r=getRestaurant(id); if(!r)return;
  $id('detailsTitle').textContent=r.name;
  $id('detailsBody').innerHTML=`<p class="muted">${esc(r.description)}</p><p><strong>Area:</strong> ${esc(r.area)} &nbsp; <strong>Guest rating:</strong> ★ ${r.rating.toFixed(1)} &nbsp; <strong>Price level:</strong> ${priceLabel(r.price)}</p><p><strong>Dining arrangements:</strong> ${esc(r.setting.join(' · '))}</p><h3 class="h4 mt-4">Food & drinks menu</h3><p class="small muted">Explore island flavours, spice levels and vegetarian options. Prices are in Jamaican dollars (JMD).</p><div id="modalMenu">${menuHTML(r)}</div>`;
  $id('detailsRequest').href=`reservation.html?restaurant=${r.id}`;
  bootstrap.Modal.getOrCreateInstance($id('detailsModal')).show();
}
document.addEventListener('click',e=>{
  const detail=e.target.closest('.details-btn'); if(detail)showDetails(detail.dataset.id);
  const menu=e.target.closest('.menu-filter'); if(menu) $id('modalMenu').innerHTML=menuHTML(getRestaurant(menu.dataset.id),menu.dataset.menu);
});
function setupHome(){
  if(!$id('featuredGrid'))return;
  $id('featuredGrid').innerHTML=[...RESTAURANTS].sort((a,b)=>b.rating-a.rating).slice(0,3).map(card).join('');
}
function setupDirectory(){
  if(!$id('restaurantGrid'))return;
  let active='All';
  const categories=['All',...new Set(RESTAURANTS.map(r=>r.category))];
  $id('categoryFilters').innerHTML=categories.map(c=>`<button type="button" class="filter-chip ${c==='All'?'active':''}" data-category="${esc(c)}" aria-pressed="${c==='All'}">${esc(c)}</button>`).join('');
  $id('areaSelect').innerHTML += [...new Set(RESTAURANTS.map(r=>r.area))].sort().map(a=>`<option value="${esc(a)}">${esc(a)}</option>`).join('');
  const qs=new URLSearchParams(location.search);if(['rating','reviews','name','priceLow'].includes(qs.get('sort')))$id('sortSelect').value=qs.get('sort');
  function render(){
    const query=$id('searchInput').value.trim().toLowerCase(),area=$id('areaSelect').value;
    let results=RESTAURANTS.filter(r=>(active==='All'||r.category===active)&&(area==='all'||r.area===area)&&[r.name,r.area,r.category,r.description,...r.setting,...r.menu.flatMap(item => [item[0],item[1],item[3],item[5] ? 'vegetarian' : '',item[4] > 1 ? 'spicy hot' : ''])].join(' ').toLowerCase().includes(query));
    const sort=$id('sortSelect').value;
    if(sort==='rating')results.sort((a,b)=>b.rating-a.rating||b.reviews-a.reviews);
    if(sort==='reviews')results.sort((a,b)=>b.reviews-a.reviews);
    if(sort==='name')results.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==='priceLow')results.sort((a,b)=>a.price-b.price||b.rating-a.rating);
    if(sort==='featured')results.sort((a,b)=>Number(b.featured)-Number(a.featured)||b.rating-a.rating);
    $id('restaurantGrid').innerHTML=results.map(card).join('');
    $id('resultCount').textContent=`Showing ${results.length} of ${RESTAURANTS.length} restaurants${query ? ` matching “${$id('searchInput').value.trim()}”` : ''}`;
    $id('emptyState').classList.toggle('d-none',results.length!==0);
  }
  $id('categoryFilters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;active=b.dataset.category;document.querySelectorAll('.filter-chip').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected));});render();});
  // jQuery: live search input handling and a smooth result-count update.
  if (window.jQuery) {
    $('#searchInput').on('input', function () {
      render();
      $('#resultCount').stop(true,true).hide().fadeIn(180);
    });
  } else {
    $id('searchInput').addEventListener('input',render);
  }
  ['sortSelect','areaSelect'].forEach(id=>$id(id).addEventListener('change',render));
  $id('clearFilters').addEventListener('click',()=>{$id('searchInput').value='';$id('sortSelect').value='featured';$id('areaSelect').value='all';$id('categoryFilters').querySelector('[data-category="All"]').click();});
  render();
}
function localDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function setupReservation(){
  const form=$id('reservationForm'); if(!form)return;
  const select=$id('restaurantSelect');
  select.innerHTML += RESTAURANTS.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('');
  $id('date').min=localDate(new Date());
  const chosen=new URLSearchParams(location.search).get('restaurant');
  if(getRestaurant(chosen))select.value=chosen;
  const summary=$id('liveReservationSummary');
  const fields=['restaurantSelect','date','time','guests','seating','occasion'];
  const value=id=>$id(id).value.trim();
  const placeholder=(v,label)=>v?esc(v):`<span class="muted">${label}</span>`;
  function updateSummary(){
    const r=getRestaurant(select.value);
    summary.innerHTML=`<dl class="reservation-live-grid mb-0">
      <div><dt>Restaurant</dt><dd>${r?esc(r.name):placeholder('', 'Not selected')}</dd></div>
      <div><dt>Date</dt><dd>${placeholder(value('date'),'Choose a date')}</dd></div>
      <div><dt>Time</dt><dd>${placeholder(value('time'),'Choose a time')}</dd></div>
      <div><dt>Guests</dt><dd>${placeholder(value('guests'),'Choose party size')}</dd></div>
      <div><dt>Seating</dt><dd>${placeholder(value('seating'),'Choose seating')}</dd></div>
      <div><dt>Occasion</dt><dd>${placeholder(value('occasion'),'Casual dining')}</dd></div>
    </dl>`;
    // A previous preview is no longer valid after an input changes.
    $id('requestResult').classList.add('d-none');
    $id('formFeedback').textContent='';
  }
  function updateVenue(){
    const r=getRestaurant(select.value);
    $id('seating').innerHTML='<option value="">Choose seating</option>'+(r?r.setting.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join(''):'');
    $id('venuePreview').innerHTML=r?`<h3 class="h4">${esc(r.name)}</h3><p class="small muted">${esc(r.area)} · ★ ${r.rating.toFixed(1)} guest rating</p><p>${esc(r.description)}</p><p><strong>Popular dish:</strong> ${esc(r.menu.find(x=>x[0]==='Mains')?.[1]||r.menu[0][1])}</p><button type="button" class="btn btn-outline-main details-btn" data-id="${r.id}">View full food menu</button>`:'Choose a restaurant to preview dining arrangements and menu.';
    updateSummary();
  }
  select.addEventListener('change',updateVenue);
  fields.filter(id=>id!=='restaurantSelect').forEach(id=>$id(id).addEventListener('change',updateSummary));
  updateVenue();
  let requestText='';
  function showError(message,field){
    $id('formFeedback').innerHTML=`<div class="alert alert-danger" role="alert">${esc(message)}</div>`;
    if(field)$id(field).focus();
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const required=[['restaurantSelect','Please choose a restaurant.'],['seating','Please select a dining arrangement.'],['date','Please select a dining date.'],['time','Please select a dining time.'],['guests','Please select the number of guests.'],['fullName','Please enter your full name.'],['email','Please enter your email address.']];
    for(const [id,message] of required){if(!value(id)){showError(message,id);return;}}
    if(value('fullName').length<2){showError('Your name must contain at least two characters.','fullName');return;}
    if(!$id('email').checkValidity()){showError('Please enter a valid email address, for example name@example.com.','email');return;}
    const when=new Date(`${value('date')}T${value('time')}`);
    if(!Number.isFinite(when.getTime())||when<=new Date()){showError('Choose a future date and time. Requests cannot be prepared for past times.','date');return;}
    if(!$id('understand').checked){showError('Please acknowledge that this is a request preview, not a confirmed booking.','understand');return;}
    const r=getRestaurant(select.value);
    if(!r){showError('Please select a valid restaurant.','restaurantSelect');return;}
    const info={name:value('fullName'),email:value('email'),date:value('date'),time:value('time'),guests:value('guests'),seating:value('seating'),occasion:value('occasion'),notes:value('notes')};
    requestText=`KINGSTON EATS — DINING REQUEST PREVIEW (NOT SENT)\nRestaurant: ${r.name}\nName: ${info.name}\nEmail: ${info.email}\nDate: ${info.date}\nTime: ${info.time}\nGuests: ${info.guests}\nSeating: ${info.seating}\nOccasion: ${info.occasion}\nNotes: ${info.notes||'None'}\nStatus: PREVIEW ONLY — NO BOOKING CONFIRMED`;
    $id('requestSummary').innerHTML=`<strong>${esc(r.name)}</strong><p class="mb-1">${esc(info.date)} at ${esc(info.time)} · ${esc(info.guests)} guest(s)</p><p class="mb-1">${esc(info.seating)} · ${esc(info.occasion)}</p><p class="mb-1">${esc(info.name)} · ${esc(info.email)}</p><p class="mb-0">${esc(info.notes||'No additional notes')}</p>`;
    $id('formFeedback').innerHTML='<div class="alert alert-success" role="status">Your dining request preview is ready. No reservation has been sent or confirmed.</div>';
    $id('requestResult').classList.remove('d-none');
    $id('copyStatus').textContent='';
    $id('requestResult').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $id('copyRequest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(requestText);$id('copyStatus').textContent='Request preview copied. It has not been sent.';}catch{$id('copyStatus').textContent='Clipboard unavailable. Please select and copy the preview manually.';}});
}
setupHome();setupDirectory();setupReservation();
