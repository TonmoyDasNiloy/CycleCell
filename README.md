# CycleCell — TrustTrack public-test prototype

**Don't dump it. Cycle it.** CycleCell is an undergraduate project (P27) exploring transparent electronics buyback, data-security planning, and responsible e-waste recovery in Bangladesh.

This repository is the **GitHub Pages-compatible prototype**, not a live buyback company. Nothing in this website performs physical collection, payments, real device sanitization, independently verifiable custody, or recycling.

## What's new

- **Seller:** interactive BDT estimates by device category, age, condition and water damage; transparent illustrative rules (not machine learning); safety stop for swollen batteries; storage-type selection; privacy-first vs reuse-first; local demo tracking ID. A pickup/drop-off preference is not a booking.
- **TrustTrack:** device-specific proposed handling method (phone, SSD, HDD or inaccessible storage); clear local timeline with **simulation** labels; sample printable **Device Security & Recovery Report** that never claims a wipe happened.
- **Buyer:** sample component/material inventory, quantities and local sample bulk orders.
- **Demo desk:** create sample requests, simulate processing steps, add/remove sample inventory, export local JSON and reset local data. This is intentionally *not* a protected admin portal.
- **Feedback:** optional anonymous four-question study with per-browser local storage and manual CSV export; no remote collection.
- **Mobile layout:** responsive views and keyboard-friendly forms; no frontend build or paid service required.

## Start locally

You can double-click `index.html` in Windows, or use a static server if your browser restricts `file://` behavior:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Run the calculation/sanitization-planning unit tests if Node.js is available:

```bash
node --test tests/core.test.js
# or: npm test
```

**No npm install is required.** `package.json` provides only an optional test shortcut.

## GitHub Pages

1. Push the repository to GitHub.
2. Under **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select `main`, `/ (root)`.
3. Save. The root `index.html` is the entry point; `.nojekyll` is included.
4. The URLs and assets use relative paths and work under a `/<repo>/` project site.

This is a static site, and **GitHub Pages cannot run backend server logic**. The current “Sell”, “Admin”, “Buyer” and “Feedback” features run inside **each individual visitor's browser** using `localStorage`; records **do not synchronize** with the team or other visitors.

## Important limitations / safe-use notice

- **No real quote:** all BDT amounts are demonstration assumptions and must be calibrated against local market data before use in an actual service. The pricing model is **not ML**.
- **No real customer request:** filling a form does not reach an employee, create a booking, send an email, or reserve inventory.
- **No actual sanitization:** this is a guided planning workflow, **not erasure software**. Status events on the open demo desk are simulations, not evidence of data destruction. Even a printable report remains explicitly marked `DEMO ONLY`.
- **No public admin security:** the demo desk is intentionally open, and never handles real customer files, serial numbers, IMEIs, locations, photos or contact details.
- **No shared tracking:** an ID created in one visitor's browser cannot be looked up from another device. Local data can be changed or cleared by the visitor and is **not** a tamper-evident record.
- **No live buyer stock:** sample parts/material quantities and prices are fictional; ordering creates no transaction.
- **No automatic research data collection:** each tester must manually export their anonymous feedback CSV if they agree to share it. For real research, use appropriate consent, secure collection, and institutional approval as needed.
- **No certification:** NIST SP 800-88 Rev. 2 is guidance for media sanitization programs; this project does not claim to be “NIST-certified,” and it is not independently audited.

## Quick walkthrough

1. Open **Sell a device**, select laptop → business-class → damaged → SSD → privacy first. The site shows a sample BDT quote and proposed SSD-specific handling.
2. Confirm demo ownership and create a local tracking ID; copy it.
3. Go to **TrustTrack** and look up the ID. Only the quote stage is recorded initially.
4. Go to **Demo desk** to advance through simulated intake, handover, storage assessment, security handling, and recovery routing.
5. Open the sample report, which displays the fields a real verified workflow would require but **does not present fake proof**.
6. Browse **Marketplace** and submit a local sample bulk order.
7. Answer the **Feedback** questions and export the CSV (which remains on the test machine until someone shares it).

## Files

| Path | Role |
| --- | --- |
| `index.html` | Responsive single-page interface |
| `assets/site.css` | Accessible styles and print-specific layout |
| `assets/core.js` | Pure quote, sanitization plan and safety logic |
| `assets/app.js` | Local demo flows and interactions |
| `tests/core.test.js` | Zero-dependency Node unit tests |
| `docs/TrustTrack_MVP_Roadmap.md` | Requirements for evolving to a real service |
| `docs/PROTOTYPE_TEST_PLAN.md` | Manual QA and research/validation checklist |
| `UPDATE_INSTRUCTIONS.md` | How to overlay this upgrade on the original repo |

The original repository also contains `prototype/`, `video/`, `docs/Prototesting_Plan_CycleCell.docx` and `assets/logo.png`; those are **not deleted by the overlay package**. Keep them in your existing checkout if you wish to retain the original project materials.

## Technical and research references

- [ITU — Global E-waste Monitor 2024](https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-waste-Monitor-2024.aspx) (62 Mt generated in 2022; 22.3% documented formally collected and recycled).
- [NIST SP 800-88 Rev. 2 — Guidelines for Media Sanitization](https://csrc.nist.gov/pubs/sp/800/88/r2/final) (2025).
- [GitHub Pages Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

For any future production deployment, a securely authenticated backend and independent physical operating procedures are essential. See `docs/TrustTrack_MVP_Roadmap.md`.
