# Apply the CycleCell website upgrade to the existing Windows checkout

Repository reviewed: https://github.com/TonmoyDasNiloy/CycleCell (public `main` branch, 12 Nov 2026).

**This ZIP is an overlay, not a complete mirror or git clone.** It deliberately includes only updated/new files, because the existing `assets/logo.png`, `video/`, original `prototype/`, and earlier Word testing plan should stay intact. The new root `index.html` replaces the original single-file website; everything else above remains unless you separately modify it.

## Recommended safe method

1. Make sure the existing repository is synced and that you have committed or backed up any unpushed changes.
2. Unzip `CycleCell_GitHub_Pages_Upgrade.zip` **into**:

   `C:\Users\Sandip Kumar Paul\OneDrive\Documents\GitHub\CycleCell`

3. Allow Windows to **replace** `index.html` and `README.md` and **merge** `assets/`, `docs/`, and `tests/`. Do not delete the original folder before copying.
4. The original logo, video, earlier prototype, and Word document stay where they are. This upgraded frontend uses its own CSS wordmark, but leaves the original image asset untouched for future use.
5. Double-click `index.html`, or start a local server: `python -m http.server 8000` and open `http://localhost:8000`.
6. If you have Node installed, run `node --test tests/core.test.js`.
7. Follow the manual QA checklist in `docs/PROTOTYPE_TEST_PLAN.md`.

## Commit and publish

From a PowerShell terminal:

```powershell
cd 'C:\Users\Sandip Kumar Paul\OneDrive\Documents\GitHub\CycleCell'
git status
git diff --stat
# Optional if Node.js is installed:
node --test tests/core.test.js
git add -A
git commit -m "Upgrade CycleCell public demo with TrustTrack and safe static workflows"
git push origin main
```

If Git says you do not have push permissions to `TonmoyDasNiloy/CycleCell`, ask the repository owner to add you as a collaborator, or push a branch to your fork and open a pull request. This archive does **not** contain `.git` credentials and I have not pushed any commits for you.

On GitHub, verify **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**. GitHub Pages may take some time to publish. Hard-refresh the page (`Ctrl + Shift + R`) after deployment.

## Things not to claim during public testing

- Quote values are illustrative rules, **not** live ML or verified current market buyback rates.
- No visitor request is sent to the team; browser-local data is not a shared database.
- No real hardware is erased; no data destruction or NIST certification is proved.
- The admin desk is an **open simulation**, not a secure staff portal.
- Feedback is not uploaded to CycleCell; participants must export/share it manually if they consent.

## Rollback

The git history can restore the previous website: use `git log` to identify the commit before the upgrade and revert via git after reviewing your team’s work. Avoid `git reset --hard` unless you are certain no uncommitted work would be lost.
