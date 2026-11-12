/* CycleCell: pure pricing and safety logic. Shared by the static app and Node tests.
   IMPORTANT: All pricing is illustrative, not a market feed or ML prediction. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CycleCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MODELS = {
    phone: [
      { id: 'flagship', label: 'Flagship smartphone (older model)', working: 10500, damaged: 3800, dead: 1200 },
      { id: 'midrange', label: 'Mid-range smartphone', working: 6200, damaged: 2200, dead: 700 },
      { id: 'budget', label: 'Budget smartphone', working: 2800, damaged: 1100, dead: 350 },
      { id: 'feature', label: 'Basic / feature phone', working: 600, damaged: 250, dead: 80 }
    ],
    laptop: [
      { id: 'business', label: 'Business-class laptop (older model)', working: 16500, damaged: 7200, dead: 2300 },
      { id: 'consumer', label: 'Consumer laptop', working: 11500, damaged: 4900, dead: 1600 },
      { id: 'budget', label: 'Entry-level laptop', working: 7000, damaged: 2800, dead: 900 },
      { id: 'netbook', label: 'Old netbook / mini laptop', working: 2600, damaged: 950, dead: 300 }
    ]
  };
  const CONDITIONS = { working: 'Working', damaged: 'Partially working / damaged', dead: 'Does not power on' };
  const STAGES = [
    { key: 'submitted', title: 'Quote saved', detail: 'A local demo request has been created.' },
    { key: 'reviewed', title: 'Intake review simulated', detail: 'An operator would check ownership and collection eligibility.' },
    { key: 'received', title: 'Handover simulated', detail: 'The team would assign a custody tag and inspect the device.' },
    { key: 'assessed', title: 'Storage assessment simulated', detail: 'Storage type and feasible security method would be assessed.' },
    { key: 'handled', title: 'Security procedure simulated', detail: 'Actual tools and independent verification are NOT connected.' },
    { key: 'routed', title: 'Recovery routing simulated', detail: 'A future partner would receive suitable reusable or waste material.' }
  ];
  function priceQuote(input) {
    const type = input.type === 'laptop' ? 'laptop' : 'phone';
    const model = MODELS[type].find(m => m.id === input.model) || MODELS[type][0];
    const condition = CONDITIONS[input.condition] ? input.condition : 'working';
    if (input.swollenBattery) return { eligible: false, amount: 0, reason: 'Swollen or punctured batteries require specialist assessment; never charge or puncture them.' };
    const age = Math.max(0, Math.min(20, Number(input.age) || 0));
    const base = model[condition];
    const ageMultiplier = age <= 3 ? 1 : age <= 5 ? 0.9 : age <= 8 ? 0.75 : 0.6;
    const waterMultiplier = input.waterDamage ? 0.75 : 1;
    const rounded = Math.max(50, Math.round((base * ageMultiplier * waterMultiplier) / 50) * 50);
    return {
      eligible: true,
      amount: rounded,
      reason: `${CONDITIONS[condition]} base ৳${base.toLocaleString('en-BD')} × age factor ${ageMultiplier} × water-damage factor ${waterMultiplier}. Rounded to nearest ৳50.`,
      warning: 'Illustrative rule-based quote only. Not ML, not a binding cash offer. Final value and safety depend on physical inspection.'
    };
  }
  function securityPlan(input) {
    const type = input.type === 'laptop' ? 'laptop' : 'phone';
    const condition = CONDITIONS[input.condition] ? input.condition : 'working';
    const storage = input.storage || 'unsure';
    const priority = input.priority === 'privacy' ? 'privacy' : 'reuse';
    if (condition === 'dead' || storage === 'inaccessible') {
      return { title: 'Isolate storage; specialist assessment', approach: 'No software wipe can be assumed. Keep storage out of the resale stream. Offer owner return or controlled destruction of the storage-bearing component by a qualified operator.', proof: 'Custody record, device matching, and evidence of confirmed storage disposition.', warning: 'Destruction may reduce buyback value. Do not drill through a whole phone or its battery.' };
    }
    if (type === 'phone') {
      return { title: 'Manufacturer-supported device erase', approach: 'Owner backs up and signs out, then follows the device maker’s supported erase/reset flow. A technician checks the reset state and account locks.', proof: 'Device ID match, method, operator, timestamps, and recorded post-reset checks.', warning: 'A factory reset is not universally suitable for every older or unencrypted phone. Assess before resale.' };
    }
    if (storage === 'hdd') {
      return { title: 'Storage-appropriate HDD sanitization', approach: 'Use an approved overwrite or other suitable media-sanitization method for the specific drive, then check the outcome.', proof: 'Drive ID, selected procedure, sanitization tool output, and verification.', warning: 'A quick format or deleting files is not secure sanitization.' };
    }
    if (storage === 'ssd') {
      return { title: 'SSD-specific sanitize / erase procedure', approach: 'Assess controller-supported NVMe/ATA sanitization or cryptographic erase where supported and appropriate; verify the result.', proof: 'Drive ID, tool log, supported sanitize mode, result, and verification.', warning: 'Simple overwriting may be unsuitable for SSD remapped blocks.' };
    }
    return { title: 'Storage inspection before erasure', approach: `Identify the storage type before selecting a verified method. ${priority === 'privacy' ? 'If assurance is not possible, isolate/return the storage.' : 'Prefer safe reuse only after sanitization is actually verified.'}`, proof: 'Document media type, chosen method, operator, and verification.', warning: 'Do not state that data is erased until an appropriate real-world procedure has been completed.' };
  }
  function money(n) { return '৳' + Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 }); }
  function escapeHtml(input) { return String(input == null ? '' : input).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
  function csvCell(v) { let s = String(v == null ? '' : v); if (/^[=+@\-\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
  return { MODELS, CONDITIONS, STAGES, priceQuote, securityPlan, money, escapeHtml, csvCell };
});
