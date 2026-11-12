# CycleCell — local QA and public prototype testing

## Static QA checklist

- [ ] Navigate all six public tabs and the sample report using desktop and mobile browsers.
- [ ] Sell: switching between phone and laptop updates device groups and storage choices.
- [ ] Sell: working/damaged/dead, age, and liquid damage change the BDT sample estimate.
- [ ] Sell: swollen or unsafe battery blocks automatic pricing and submission.
- [ ] Sell: blank/out-of-range age and unchecked ownership consent cannot create a sample ID.
- [ ] Sell: sample handover preference is recorded but no pickup is actually scheduled.
- [ ] Sell: submit a sample quote, copy the local tracking ID, and refresh the page. It must remain in that browser.
- [ ] TrustTrack: look up the ID in the same browser and verify that the first stage is the only initial stage.
- [ ] TrustTrack: searching the same ID in a different browser shows no result (expected; not synced).
- [ ] Demo desk: advance all stages and confirm each event says "simulated" or equivalent.
- [ ] Sample report: printing or saving to PDF must prominently show **DEMO ONLY** and state that no real wipe was performed.
- [ ] Marketplace: select a sample quantity, create local order; invalid quantities are rejected.
- [ ] Demo desk: add/remove sample inventory; none represents physically available stock.
- [ ] Feedback: submit without personal data, export CSV, verify an anonymous row; manual sharing is required.
- [ ] Export JSON and clear local demo data; the original seed sample lots should return.
- [ ] Browser developer console has no runtime JavaScript exceptions; all internal paths load under GitHub Pages' repository subpath.

## Run automated unit tests

```bash
node --test tests/core.test.js
```

Tests validate deterministic sample BDT quotes, safety-stop logic, alternative storage pathways and safe HTML/CSV formatting.

## Customer discovery pilot (suggested, not completed)

**Research question:** With the same estimated cash offer, does a verifiable data-handling process increase willingness to hand over old electronics?

Suggested small, convenience-sample trial: ~20–30 adult participants, ideally using devices they actually consider disposing of, with informed consent and no real private-data collection in the prototype. Compare:

1. **Control**: standard buyback price and ordinary opaque resale process.
2. **Intervention**: same offer plus owner-observable handling, custody steps, and a demonstrable real-world verified method when implemented.

Record the offer, device category, security concerns, whether the owner *actually* accepts a handover, and why they decline. Don't report “80% conversion” until measured. A questionnaire expressing preference is not equivalent to a completed handover.

This local static site **does not** collect responses across testers. For a supervised class exercise, export the local CSV on each participant's device or use a separately approved survey tool with a clear privacy notice. Do not silently export or upload browser data.
