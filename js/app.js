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
  const groups = [...new Set(r.menu.map(item=>item[0]))];
  const items = filter==='All'?r.menu:r.menu.filter(item=>item[0]===filter);
  return `<div class="menu-tabs my-3" role="group" aria-label="Menu categories">${['All',...groups].map(g=>`<button class="btn btn-sm btn-outline-main menu-filter ${g===filter?'active':''}" data-menu="${esc(g)}" data-id="${r.id}" type="button">${esc(g)}</button>`).join('')}</div><div>${items.map(([group,name,price,description])=>`<div class="menu-row d-flex justify-content-between gap-3"><div><span class="small muted">${esc(group)}</span><h3 class="h6 mb-1">${esc(name)}</h3><p class="small muted mb-0">${esc(description)}</p></div><span class="menu-price">${money(price)}</span></div>`).join('')}</div>`;
}
function showDetails(id) {
  const r=getRestaurant(id); if(!r)return;
  $id('detailsTitle').textContent=r.name;
  $id('detailsBody').innerHTML=`<p class="muted">${esc(r.description)}</p><p><strong>Area:</strong> ${esc(r.area)} &nbsp; <strong>Guest rating:</strong> ★ ${r.rating.toFixed(1)} &nbsp; <strong>Price level:</strong> ${priceLabel(r.price)}</p><p><strong>Dining arrangements:</strong> ${esc(r.setting.join(' · '))}</p><h3 class="h4 mt-4">Food & drinks menu</h3><p class="small muted">Original sample dishes and prices in Jamaican dollars. Prices are fictional.</p><div id="modalMenu">${menuHTML(r)}</div>`;
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
    let results=RESTAURANTS.filter(r=>(active==='All'||r.category===active)&&(area==='all'||r.area===area)&&[r.name,r.area,r.category,r.description,...r.setting,...r.menu.flat()].join(' ').toLowerCase().includes(query));
    const sort=$id('sortSelect').value;
    if(sort==='rating')results.sort((a,b)=>b.rating-a.rating||b.reviews-a.reviews);
    if(sort==='reviews')results.sort((a,b)=>b.reviews-a.reviews);
    if(sort==='name')results.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==='priceLow')results.sort((a,b)=>a.price-b.price||b.rating-a.rating);
    if(sort==='featured')results.sort((a,b)=>Number(b.featured)-Number(a.featured)||b.rating-a.rating);
    $id('restaurantGrid').innerHTML=results.map(card).join('');
    $id('resultCount').textContent=`Showing ${results.length} of ${RESTAURANTS.length} restaurants`;
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
  const form=$id('reservationForm');if(!form)return;
  const select=$id('restaurantSelect');
  select.innerHTML += RESTAURANTS.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('');
  $id('date').min=localDate(new Date());
  const chosen=new URLSearchParams(location.search).get('restaurant');if(getRestaurant(chosen))select.value=chosen;
  function updateVenue(){
    const r=getRestaurant(select.value);
    $id('seating').innerHTML='<option value="">Choose seating</option>'+(r?r.setting.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join(''):'');
    $id('venuePreview').innerHTML=r?`<h3 class="h4">${esc(r.name)}</h3><p class="small muted">${esc(r.area)} · ★ ${r.rating.toFixed(1)} guest rating</p><p>${esc(r.description)}</p><p><strong>Popular dish:</strong> ${esc(r.menu.find(x=>x[0]==='Mains')?.[1]||r.menu[0][1])}</p><button type="button" class="btn btn-outline-main details-btn" data-id="${r.id}">View full food menu</button>`:'Choose a restaurant to preview dining arrangements and menu.';
    $id('requestResult').classList.add('d-none');
  }
  select.addEventListener('change',updateVenue);updateVenue();
  let requestText='';
  form.addEventListener('submit',e=>{
    e.preventDefault();const feedback=$id('formFeedback');
    if(!form.checkValidity()){feedback.innerHTML='<div class="alert alert-danger">Please complete the required fields and enter a valid email.</div>';form.reportValidity();return;}
    const when=new Date(`${$id('date').value}T${$id('time').value}`);
    if(!Number.isFinite(when.getTime())||when<=new Date()){feedback.innerHTML='<div class="alert alert-danger">Please choose a future date and time.</div>';$id('date').focus();return;}
    const r=getRestaurant(select.value);if(!r){feedback.innerHTML='<div class="alert alert-danger">Select a restaurant.</div>';return;}
    const info={name:$id('fullName').value.trim(),email:$id('email').value.trim(),date:$id('date').value,time:$id('time').value,guests:$id('guests').value,seating:$id('seating').value,occasion:$id('occasion').value,notes:$id('notes').value.trim()};
    requestText=`KINGSTON EATS — DEMO DINING REQUEST (NOT SENT)\nRestaurant: ${r.name}\nName: ${info.name}\nEmail: ${info.email}\nDate: ${info.date}\nTime: ${info.time}\nGuests: ${info.guests}\nSeating: ${info.seating}\nOccasion: ${info.occasion}\nNotes: ${info.notes||'None'}`;
    $id('requestSummary').innerHTML=`<strong>${esc(r.name)}</strong><p class="mb-1">${esc(info.date)} at ${esc(info.time)} · ${esc(info.guests)} guest(s)</p><p class="mb-1">${esc(info.seating)} · ${esc(info.occasion)}</p><p class="mb-1">${esc(info.name)} · ${esc(info.email)}</p><p class="mb-0">${esc(info.notes||'No additional notes')}</p>`;
    feedback.innerHTML='<div class="alert alert-success">Request preview created. No booking has been made.</div>';
    $id('requestResult').classList.remove('d-none');$id('copyStatus').textContent='';$id('requestResult').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $id('copyRequest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(requestText);$id('copyStatus').textContent='Copied to clipboard.';}catch{$id('copyStatus').textContent='Clipboard unavailable. Select and copy the preview manually.';}});
}
setupHome();setupDirectory();setupReservation();
