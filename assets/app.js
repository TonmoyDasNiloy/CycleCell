/* CycleCell static GitHub Pages prototype.
 * This file deliberately NEVER claims to perform a real erase, pickup, payment or audit.
 * Everything entered remains local to the visitor's browser.
 */
(() => {
  'use strict';
  const Core = window.CycleCore;
  if (!Core) throw new Error('CycleCore not loaded');
  const { MODELS, STAGES, priceQuote, securityPlan, money, escapeHtml: esc, csvCell } = Core;
  const STORAGE_KEY = 'cyclecell-2026-trusttrack-demo-v3';
  const BASE_LOTS = [
    { id: 'LOT-SCREEN', title: 'Reusable phone screens', kind: 'Tested component', unit: 'piece', icon: '▣', qty: 18, price: 750 },
    { id: 'LOT-RAM', title: 'Laptop RAM modules', kind: 'Tested component', unit: 'piece', icon: '▤', qty: 22, price: 1000 },
    { id: 'LOT-KEYBOARD', title: 'Laptop keyboards', kind: 'Reusable part', unit: 'piece', icon: '⌨', qty: 16, price: 450 },
    { id: 'LOT-COPPER', title: 'Copper-rich cables', kind: 'Material (illustrative)', unit: 'kg', icon: '↗', qty: 30, price: 460 },
    { id: 'LOT-ALUMINIUM', title: 'Aluminium casings', kind: 'Material (illustrative)', unit: 'kg', icon: '▱', qty: 40, price: 175 },
    { id: 'LOT-BOARD', title: 'Mixed circuit boards', kind: 'Controlled downstream handling', unit: 'kg', icon: '▦', qty: 12, price: 550 }
  ];
  let state = readState();
  let reportId = '';
  let currentLookup = '';
  const $ = (id) => document.getElementById(id);
  const now = () => new Date().toISOString();
  const displayDate = (value) => {
    if (!value) return 'Not recorded';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString('en-BD', { dateStyle:'medium', timeStyle:'short' });
  };
  function readState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (raw && Array.isArray(raw.devices) && Array.isArray(raw.orders) && Array.isArray(raw.feedback)) {
        return { devices:raw.devices, orders:raw.orders, feedback:raw.feedback, lots:Array.isArray(raw.lots) ? raw.lots : BASE_LOTS.map(l => ({ ...l })) };
      }
    } catch (_) { /* private browsing/localStorage blocked */ }
    return { devices:[], orders:[], feedback:[], lots:BASE_LOTS.map(l => ({ ...l })) };
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
    catch (_) { toast('Browser storage is unavailable. Your demo activity cannot persist.', true); return false; }
  }
  function makeId(prefix) {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return prefix + Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
  }
  function toast(message, error = false) {
    const n = document.createElement('div');
    n.className = error ? 'error' : '';
    n.textContent = message;
    $('toast').appendChild(n);
    window.setTimeout(() => n.remove(), 4200);
  }
  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type:mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function findDevice(id) { return state.devices.find(d => d.id === id); }
  function snapshot() { return {
    type:$('deviceType').value,
    model:$('deviceModel').value,
    condition:$('deviceCondition').value,
    age:$('deviceAge').value,
    storage:$('deviceStorage').value,
    waterDamage:$('waterDamage').checked,
    swollenBattery:$('swollenBattery').checked,
    handover:$('handover').value,
    priority:document.querySelector('input[name="priority"]:checked')?.value || 'reuse'
  }; }
  function modelLabel(type, id) { return (MODELS[type] || []).find(m => m.id === id)?.label || 'Unknown device'; }
  function populateModels() {
    const models = MODELS[$('deviceType').value] || MODELS.phone;
    $('deviceModel').innerHTML = models.map(m => `<option value="${esc(m.id)}">${esc(m.label)}</option>`).join('');
    if ($('deviceType').value === 'phone') {
      $('deviceStorage').innerHTML = '<option value="unsure">Not sure / integrated phone storage</option><option value="inaccessible">Storage is inaccessible</option>';
    } else {
      $('deviceStorage').innerHTML = '<option value="unsure">Not sure</option><option value="hdd">Hard disk drive (HDD)</option><option value="ssd">Solid-state drive (SSD)</option><option value="inaccessible">Storage is inaccessible</option>';
    }
    renderQuote();
  }
  function renderQuote() {
    const input = snapshot();
    const q = priceQuote(input);
    const plan = securityPlan(input);
    $('quotePanel').innerHTML = `<div class="quote-label">ESTIMATED BUYBACK VALUE · DEMO ONLY</div><div class="quote-amount">${q.eligible ? money(q.amount) : 'On hold'}</div><span class="quote-status">${q.eligible ? 'Subject to physical inspection' : 'Requires battery safety review'}</span><p class="quote-help">${esc(q.eligible ? q.reason : q.reason)}</p><p class="quote-help"><strong>No payment is being offered through this website.</strong> Prices are example assumptions, not live Bangladesh market data or ML output.</p>`;
    $('securityTitle').textContent = plan.title;
    $('securityApproach').textContent = plan.approach;
    $('securityEvidence').textContent = plan.proof;
    $('securityWarning').textContent = plan.warning;
    $('saveQuoteBtn').disabled = !q.eligible;
  }
  function saveQuote(event) {
    event.preventDefault();
    const input = snapshot();
    const age = Number(input.age);
    if (String(input.age).trim() === '' || !Number.isFinite(age) || age < 0 || age > 20) { toast('Please enter an age between 0 and 20 years.', true); $('deviceAge').focus(); return; }
    if (!$('ownerConfirm').checked) { toast('Confirm ownership and demo-only use first.', true); $('ownerConfirm').focus(); return; }
    const q = priceQuote(input);
    if (!q.eligible) { toast('This device needs a specialist battery safety assessment first.', true); return; }
    const id = makeId('CC-DEMO-');
    const d = {
      id, createdAt:now(), type:input.type, model:input.model, modelLabel:modelLabel(input.type,input.model),
      condition:input.condition, age:Number(input.age), storage:input.storage,
      priority:input.priority, handover:input.handover, waterDamage:input.waterDamage, quote:q.amount,
      stage:0, events:[{ stage:0, time:now(), text:'Illustrative quote and tracking ID created locally (no request sent).' }]
    };
    state.devices.unshift(d);
    if (!saveState()) { state.devices.shift(); return; }
    const box = $('sellSuccess');
    box.hidden = false;
    box.innerHTML = `<strong>Sample request created.</strong><p>Your local tracking ID: <strong>${esc(id)}</strong></p><p>No pickup or payment has been arranged. Open the <a href="#admin">Demo desk</a> to simulate processing, then view the record under <a href="#trusttrack">TrustTrack</a>.</p><button class="button secondary" type="button" data-copy="${esc(id)}">Copy tracking ID</button>`;
    $('trackIdInput').value = id;
    currentLookup = id;
    refreshAll();
    toast('Demo ID created. Nothing was submitted to a server.');
    box.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
  function activePage() {
    const h = (location.hash || '#home').slice(1).split('?')[0];
    return ['home','sell','trusttrack','buyer','admin','feedback','report'].includes(h) ? h : 'home';
  }
  function route() {
    const page = activePage();
    document.querySelectorAll('.view').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    document.querySelectorAll('nav a').forEach(el => {
      if (el.dataset.route === page) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    $('mainNav').classList.remove('open');
    $('menuToggle').setAttribute('aria-expanded', 'false');
    if (page === 'trusttrack' && currentLookup) renderTracking();
    if (page === 'report') renderReport();
    window.scrollTo({ top:0, behavior:'instant' });
  }
  function renderTimeline(d) {
    const events = Array.isArray(d.events) ? d.events : [];
    return `<ol class="timeline">${STAGES.map((s,i) => {
      const e = events.find(e => e.stage === i);
      return `<li class="${i <= d.stage ? 'done' : ''}"><b>${esc(s.title)}</b><span>${esc(i <= d.stage ? (e?.text || s.detail) : 'Not yet demonstrated')}</span>${e ? `<time datetime="${esc(e.time)}">${esc(displayDate(e.time))}</time>` : ''}</li>`;
    }).join('')}</ol>`;
  }
  function trackForm(event) {
    event.preventDefault();
    currentLookup = $('trackIdInput').value.trim().toUpperCase();
    renderTracking();
  }
  function renderTracking() {
    const out = $('trackingResults');
    if (!currentLookup) { out.innerHTML = ''; return; }
    const d = findDevice(currentLookup);
    if (!d) {
      out.innerHTML = `<div class="empty-state">No local record found for <strong>${esc(currentLookup)}</strong>. This may be an ID from another visitor's browser. GitHub Pages has no shared database in this demo.</div>`;
      return;
    }
    const stage = STAGES[Math.min(STAGES.length - 1, d.stage)];
    out.innerHTML = `<article class="track-card"><div class="track-head"><div><span class="overline">DEMO DEVICE RECORD</span><h3>${esc(d.id)}</h3><p>${esc(d.modelLabel)} · ${esc(Core.CONDITIONS[d.condition] || d.condition)} · Estimate ${money(d.quote)}</p></div><span class="status-pill demo">Simulated · ${esc(stage.title)}</span></div><div class="subtle-note"><span class="note-symbol">!</span><p><strong>Not security proof:</strong> Status changes below were clicked in the open demo desk. No device was received or erased through this website.</p></div>${renderTimeline(d)}<button class="button secondary" type="button" data-report="${esc(d.id)}">View sample Security & Recovery Report →</button></article>`;
  }
  function renderLots() {
    $('lotsGrid').innerHTML = state.lots.map(l => `<article class="lot-card"><div class="lot-icon" aria-hidden="true">${esc(l.icon)}</div><span class="overline">${esc(l.kind)}</span><h3>${esc(l.title)}</h3><p>Illustrative stock: ${esc(l.qty)} ${esc(l.unit)}${l.qty !== 1 ? 's' : ''}</p><div class="lot-bottom"><div><span class="lot-price">${money(l.price)}</span><span class="lot-unit"> / ${esc(l.unit)}</span></div><span class="status-pill demo">Sample</span></div><label class="field" style="margin-bottom:12px">Sample quantity<input type="number" min="1" max="${esc(l.qty)}" value="1" id="qty-${esc(l.id)}" aria-label="Demo quantity for ${esc(l.title)}"></label><button type="button" class="button secondary" data-order="${esc(l.id)}">Create demo order ↗</button></article>`).join('');
    $('ordersList').innerHTML = state.orders.length ? state.orders.map(o => `<div class="mini-order"><strong>${esc(o.id)} · ${esc(o.title)}</strong><small>${esc(o.quantity || 1)} ${esc(o.unit)} · ${money(o.total || o.price)} · ${esc(o.status || 'Demo request saved locally')} · ${esc(displayDate(o.createdAt))}</small></div>`).join('') : '<div class="empty-state">No local orders yet. Choose a sample lot above.</div>';
  }
  function createOrder(id) {
    const lot = state.lots.find(l => l.id === id);
    if (!lot) return;
    const quantity = Number($('qty-'+id)?.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > lot.qty) { toast('Choose a whole number up to the illustrative lot quantity.', true); return; }
    const o = { id:makeId('O-DEMO-'), lot:lot.id, title:lot.title, unit:lot.unit, quantity, price:lot.price, total:lot.price*quantity, createdAt:now(), status:'Request simulated (no seller notified)' };
    state.orders.unshift(o);
    if (!saveState()) { state.orders.shift(); return; }
    renderLots();
    toast('Sample order created locally. No real stock is reserved.');
  }
  function renderAdmin() {
    const completed = state.devices.filter(d => d.stage >= STAGES.length - 1).length;
    $('deskStats').innerHTML = `<div class="desk-stat"><b>${state.devices.length}</b><span>Local sample devices</span></div><div class="desk-stat"><b>${completed}</b><span>Reached last simulated stage</span></div><div class="desk-stat"><b>${state.orders.length}</b><span>Sample buyer orders</span></div>`;
    $('deviceQueue').innerHTML = state.devices.length ? state.devices.map(d => `<article class="queue-card"><div><span class="overline">${esc(d.id)}</span><h3>${esc(d.modelLabel)}</h3><p>${esc(STAGES[d.stage]?.title || 'Unknown')} · ${money(d.quote)} · ${esc(displayDate(d.createdAt))}</p></div><div class="actions"><button type="button" class="button secondary" data-report="${esc(d.id)}">View report</button>${d.stage < STAGES.length - 1 ? `<button type="button" class="button primary" data-advance="${esc(d.id)}">Simulate next step →</button>` : '<span class="status-pill demo">Demo complete</span>'}</div></article>`).join('') : '<div class="empty-state">No records yet. Create an example or use the Sell page.</div>';
    $('manageLots').innerHTML = state.lots.length ? state.lots.map(l => `<article class="queue-card"><div><h3>${esc(l.title)}</h3><p>${esc(l.id)} · ${esc(l.qty)} ${esc(l.unit)} · ${money(l.price)} per unit (illustrative)</p></div><div class="actions"><button type="button" class="button ghost-danger" data-remove-lot="${esc(l.id)}">Remove demo lot</button></div></article>`).join('') : '<div class="empty-state">No demo lots. Add one above.</div>';
    $('orderQueue').innerHTML = state.orders.length ? state.orders.map(o => `<article class="queue-card"><div><h3>${esc(o.id)} · ${esc(o.title)}</h3><p>Sample order for ${esc(o.quantity || 1)} ${esc(o.unit)}, ${money(o.total || o.price)}. Not sent to an actual buyer or seller.</p></div><span class="status-pill demo">Sample request</span></article>`).join('') : '<div class="empty-state">No sample orders yet.</div>';
  }
  function addLot(event) {
    event.preventDefault();
    const title = $('newLotTitle').value.trim();
    const kind = $('newLotKind').value;
    const unit = $('newLotUnit').value;
    const qty = Number($('newLotQty').value);
    const price = Number($('newLotPrice').value);
    if (!title || title.length > 65 || !Number.isInteger(qty) || qty < 1 || qty > 9999 || !Number.isFinite(price) || price < 1 || price > 1000000) {
      toast('Enter a valid lot title, quantity and price.', true); return;
    }
    state.lots.unshift({ id:makeId('LOT-DEMO-'),title,kind,unit,qty,price,icon:'▣' });
    if (!saveState()) { state.lots.shift(); return; }
    $('lotForm').reset(); refreshAll(); toast('Demo inventory added locally.');
  }
  function removeLot(id) {
    const index = state.lots.findIndex(l => l.id === id);
    if (index < 0) return;
    const [removed] = state.lots.splice(index,1);
    if (!saveState()) { state.lots.splice(index,0,removed); return; }
    refreshAll(); toast('Demo lot removed.');
  }
  function advanceDevice(id) {
    const d = findDevice(id);
    if (!d || d.stage >= STAGES.length - 1) return;
    const next = d.stage + 1;
    const labels = {
      1:'Intake screening simulated. No staff actually reviewed or approved this request.',
      2:'Handover simulated. No physical device was received.',
      3:'Storage decision path illustrated. No technician inspected the device.',
      4:'Security procedure simulated. No software erase or physical destruction was performed.',
      5:'Responsible-routing step simulated. No partner or recycler received any material.'
    };
    d.stage = next;
    d.events.push({ stage:next, time:now(), text:labels[next] });
    if (!saveState()) { d.events.pop(); d.stage -= 1; return; }
    refreshAll();
    toast(STAGES[next].title + ' — simulation only');
  }
  function createExample() {
    const q = priceQuote({ type:'laptop',model:'business', condition:'working', age:4 });
    const id = makeId('CC-DEMO-');
    const d = { id, createdAt:now(),type:'laptop',model:'business',modelLabel:modelLabel('laptop','business'),condition:'working',age:4,storage:'ssd',priority:'privacy',handover:'drop-off',waterDamage:false,quote:q.amount,stage:0,events:[{stage:0,time:now(),text:'Pre-filled sample quote. No device or customer data exists.'}] };
    state.devices.unshift(d);
    if (!saveState()) { state.devices.shift(); return; }
    refreshAll();
    $('trackIdInput').value = id;
    currentLookup = id;
    toast('Example created: '+id);
  }
  function renderReport() {
    const d = findDevice(reportId);
    const target = $('reportContent');
    if (!d) { target.innerHTML = '<div class="empty-state">No local report selected. Create or look up a demo ID.</div>'; return; }
    const plan = securityPlan(d);
    target.innerHTML = `<article class="report-sheet" aria-label="Illustrative security and recovery report"><div class="report-head"><div><span class="overline">CYCLECELL · TRUSTTRACK</span><h2>Device Security & Recovery Report</h2><p>Illustrative local transaction record · Generated ${esc(displayDate(now()))}</p></div><span class="status-pill demo">DEMO ONLY</span></div><div class="report-warning" style="margin-top:24px">NO REAL DEVICE WAS ERASED, VERIFIED, COLLECTED OR RECYCLED. NOT A DATA DESTRUCTION CERTIFICATE OR LEGAL COMPLIANCE DOCUMENT.</div><dl class="report-grid"><div><dt>Demo record ID</dt><dd>${esc(d.id)}</dd></div><div><dt>Record creation</dt><dd>${esc(displayDate(d.createdAt))}</dd></div><div><dt>Device category</dt><dd>${esc(d.modelLabel)}</dd></div><div><dt>Reported condition</dt><dd>${esc(Core.CONDITIONS[d.condition] || d.condition)}</dd></div><div><dt>Declared storage</dt><dd>${esc(d.storage)}</dd></div><div><dt>Security preference</dt><dd>${d.priority === 'privacy' ? 'Privacy first' : 'Reuse first'}</dd></div><div><dt>Handover preference (not scheduled)</dt><dd>${d.handover === 'pickup' ? 'Pickup inquiry' : 'Drop-off'}</dd></div><div><dt>Sample buyback estimate</dt><dd>${money(d.quote)}</dd></div><div><dt>Prototype stage</dt><dd>${esc(STAGES[d.stage]?.title || 'Unknown')}</dd></div></dl><div class="report-section"><h3>Recommended handling pathway</h3><p><strong>${esc(plan.title)}:</strong> ${esc(plan.approach)}</p><p><strong>Evidence expected in a real operation:</strong> ${esc(plan.proof)}</p><p><strong>Limitation:</strong> ${esc(plan.warning)}</p></div><div class="report-section"><h3>Custody and procedure record</h3><table class="report-table"><thead><tr><th>Stage</th><th>Recorded in this prototype</th><th>Real-world assurance</th></tr></thead><tbody>${STAGES.map((s,i)=>`<tr><td>${esc(s.title)}</td><td>${d.stage>=i?esc(displayDate(d.events.find(e=>e.stage===i)?.time)):'Not demonstrated'}</td><td>${i===0?'Local browser entry only':'Not independently verified'}</td></tr>`).join('')}</tbody></table></div><div class="report-section"><h3>Actual evidence and chain of custody</h3><p>Real tool output: <strong>Not provided</strong>. Technician identification: <strong>Not provided</strong>. Physical custody confirmation: <strong>Not provided</strong>. Independent verification: <strong>Not performed</strong>. Downstream recipient: <strong>Not confirmed</strong>.</p></div><div class="report-warning">This template demonstrates the fields a future verified report would need. A clickable status timeline, browser record or printable page does not establish that customer data was destroyed.</div></article>`;
  }
  function showReport(id) { reportId = id; location.hash = '#report'; if (activePage() === 'report') renderReport(); }
  function renderFeedbackCount() { $('feedbackCount').textContent = String(state.feedback.length); }
  function saveFeedback(event) {
    event.preventDefault();
    const choice = document.querySelector('input[name="trustChoice"]:checked')?.value;
    const concern = $('concern').value;
    const assurance = $('assurance').value;
    const willing = $('willing').value;
    if (!choice || !concern || !assurance || !willing) { toast('Please answer all four questions.', true); return; }
    const response = { id:makeId('FB-'), time:now(), choice, concern, assurance, willing };
    state.feedback.push(response);
    if (!saveState()) { state.feedback.pop(); return; }
    $('feedbackSaved').hidden = false;
    $('feedbackSaved').textContent = 'Thank you. This anonymous sample was stored only in your browser. Please export the CSV and share it manually if participating in a supervised study.';
    $('feedbackForm').reset();
    renderFeedbackCount();
    toast('Feedback saved locally. No data was sent to the team.');
  }
  function exportFeedback() {
    const fields = ['id','time','choice','concern','assurance','willing'];
    const csv = [fields.map(csvCell).join(','), ...state.feedback.map(row => fields.map(f => csvCell(row[f])).join(','))].join('\r\n');
    downloadFile('CycleCell_anonymous_feedback_demo.csv', '\uFEFF'+csv, 'text/csv;charset=utf-8');
    toast('Downloaded locally saved feedback.');
  }
  function exportData() {
    const dump = { prototype:'CycleCell GitHub Pages local demo', createdAt:now(), warning:'Not real transactions, erasure, verification, or audited chain of custody.', ...state };
    downloadFile('CycleCell_local_demo_backup.json', JSON.stringify(dump,null,2), 'application/json;charset=utf-8');
    toast('Local demo data exported.');
  }
  function confirmDelete() {
    const dlg = $('confirmationDialog');
    $('dialogTitle').textContent = 'Clear all local demo data?';
    $('dialogMessage').textContent = 'This deletes sample devices, orders and feedback stored in this browser only. Export anything you want to keep first.';
    dlg.showModal();
    dlg.addEventListener('close', function onClose() {
      dlg.removeEventListener('close',onClose);
      if (dlg.returnValue !== 'confirm') return;
      state = { devices:[],orders:[],feedback:[],lots:BASE_LOTS.map(l => ({ ...l })) };
      if (!saveState()) return;
      currentLookup = '';
      reportId = '';
      $('trackIdInput').value = '';
      $('trackingResults').innerHTML = '';
      $('feedbackSaved').hidden = true;
      $('sellSuccess').hidden = true;
      refreshAll();
      toast('Local demo data cleared.');
    }, { once:true });
  }
  async function copyId(text) {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); toast('Copied demo ID.'); return; } }
    catch (_) { /* fallback below */ }
    const temp = document.createElement('textarea');
    temp.value = text; temp.style.position = 'fixed'; temp.style.opacity='0';
    document.body.appendChild(temp); temp.select();
    const ok = document.execCommand('copy'); temp.remove();
    toast(ok ? 'Copied demo ID.' : 'Select the demo ID to copy it manually.', !ok);
  }
  function refreshAll() { renderLots(); renderAdmin(); renderFeedbackCount(); if (currentLookup) renderTracking(); if (activePage() === 'report') renderReport(); }
  function init() {
    populateModels(); renderQuote(); refreshAll(); route();
    $('sellForm').addEventListener('change', renderQuote);
    $('sellForm').addEventListener('input', renderQuote);
    $('deviceType').addEventListener('change', populateModels);
    $('sellForm').addEventListener('submit', saveQuote);
    $('trackForm').addEventListener('submit', trackForm);
    $('feedbackForm').addEventListener('submit', saveFeedback);
    $('lotForm').addEventListener('submit', addLot);
    $('seedExample').addEventListener('click', createExample);
    $('exportData').addEventListener('click', exportData);
    $('exportFeedback').addEventListener('click', exportFeedback);
    $('clearData').addEventListener('click', confirmDelete);
    $('reportBack').addEventListener('click', () => location.hash = '#trusttrack');
    $('reportPrint').addEventListener('click', () => window.print());
    $('menuToggle').addEventListener('click', () => {
      const open = $('mainNav').classList.toggle('open');
      $('menuToggle').setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', event => {
      const btn = event.target.closest('[data-copy],[data-report],[data-advance],[data-order],[data-remove-lot]');
      if (!btn) return;
      if (btn.dataset.copy) copyId(btn.dataset.copy);
      if (btn.dataset.report) showReport(btn.dataset.report);
      if (btn.dataset.advance) advanceDevice(btn.dataset.advance);
      if (btn.dataset.order) createOrder(btn.dataset.order);
      if (btn.dataset.removeLot) removeLot(btn.dataset.removeLot);
    });
    window.addEventListener('hashchange', route);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
