# CycleCell

**Don’t dump it. Cycle it.**

CycleCell is a prototype website for a trusted e-waste service. People sell broken phones and laptops for a fixed price, the data is erased with proof, and recovered parts and materials are sold in bulk to buyers. Every step is tracked. Project ID: P27.

## What is in this repository

| Path | What it is |
|---|---|
| `index.html` | The website: landing page, Sell, Buyer, and Admin pages. A single self-contained file. |
| `prototype/seller-staff-buyer-demo.html` | The earlier single-file clickable prototype with Seller, Staff, and Buyer tabs. |
| `docs/Prototesting_Plan_CycleCell.docx` | The prototype testing plan. |
| `assets/logo.png` | The CycleCell logo. |
| `video/CycleCell_Video.mp4` | The 72-second animated video (problem, solution, prototype) with a male voiceover. |

## The website

- **Landing page:** the problem (figures from the UN Global E-waste Monitor 2024) and the solution.
- **Sell:** enter a name, pick a device and its condition, see a fixed price (semi-broken or fully broken), and send the request to the admin. Track the sale by name or device ID. After approval, the full timeline and the data-erase certificate show automatically.
- **Buyer:** browse lots of tested phone and laptop parts and recovered materials, request a bulk order, and track it by company name.
- **Admin:** approve or reject sell requests and buyer orders, move devices and orders through each step, and manage stock lots.
- Every status change is saved in a hash-chained log, so edits to history can be detected.

## Run it locally

Open `index.html` in a browser. No build step and no server are needed.

## Host it on GitHub Pages

1. Create a new repository on GitHub and upload everything in this folder.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, and save.
4. After a minute, the site is live at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

## Important limits of this static version

- **No shared database.** On GitHub Pages the site runs in demo mode: all data is saved only in each visitor’s own browser. A seller and an admin on different devices will not see each other’s data.
- **The Admin page is open to everyone** in this mode, because there is no login. Do not use it with real customers.
- Prices, device tags, and certificates are samples, not legal documents.
- Details typed into the forms stay in the browser. Do not enter real personal information.

## Making it real

To run this for real, replace the browser storage with a hosted backend (for example Supabase or Firebase), add an admin login, and keep customer contact details private. The data functions in `index.html` (`put`, `init`, and the `devs` and `ords` helpers) are the places to change.

## Data sources

- UN Global E-waste Monitor 2024 (e-waste amounts and recovered value). Check for newer editions.
- UN University study on gold recovery from e-waste (an older estimate).
