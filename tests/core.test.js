const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../assets/core.js');

test('quote in Bangladesh taka is deterministic and condition-sensitive', () => {
 const a = core.priceQuote({ type: 'phone', model: 'midrange', condition: 'working', age: 2 });
 const b = core.priceQuote({ type: 'phone', model: 'midrange', condition: 'dead', age: 2 });
 assert.equal(a.amount, 6200);
 assert.ok(b.amount < a.amount);
 assert.equal(core.money(a.amount), '৳6,200');
});
test('swollen battery blocks automated valuation', () => {
 const q = core.priceQuote({ type:'laptop', model:'business', condition:'working', swollenBattery:true });
 assert.equal(q.eligible, false);
 assert.equal(q.amount, 0);
});
test('older/water-damaged devices are valued conservatively', () => {
 const normal = core.priceQuote({ type:'laptop', model:'consumer', condition:'damaged', age:2 });
 const older = core.priceQuote({ type:'laptop', model:'consumer', condition:'damaged', age:12, waterDamage:true });
 assert.ok(older.amount < normal.amount);
});
test('unavailable storage never gets a fake erasure assurance', () => {
 const plan = core.securityPlan({ type:'phone', condition:'dead', storage:'inaccessible' });
 assert.match(plan.title, /Isolate/);
 assert.match(plan.warning, /Do not drill/);
});
test('SSD and HDD receive different recommendations', () => {
 const s = core.securityPlan({ type:'laptop', condition:'working', storage:'ssd' });
 const h = core.securityPlan({ type:'laptop', condition:'working', storage:'hdd' });
 assert.notEqual(s.title, h.title);
});
test('user strings are escaped in HTML', () => {
 assert.equal(core.escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});
test('CSV export avoids basic spreadsheet formula injection', () => {
 assert.equal(core.csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
});
