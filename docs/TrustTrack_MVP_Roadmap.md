# TrustTrack — realistic product and security roadmap

## Principle

CycleCell should make the **procedure** verifiable. The PDF/report is only a summary of evidence. A process must not be marked “verified” from an operator's button click, a staged video, or an unvalidated screenshot.

## Stage 0: Public static validation (this repository)

- Illustrative BDT quotes, rule-based rather than ML.
- Local-only demo device ID, status flow, market inventory, buyer orders, and anonymous research survey.
- Recommended device-specific security paths; no real commands execute.
- Printable report permanently labeled **DEMO ONLY** and explicitly indicating missing physical evidence.
- Zero collection of customers' phone numbers, IMEIs, real addresses, photos, or private data.
- No shared backend, authentication, payment gateway, or actual collection bookings.

## Stage 1: Assisted campus pilot (before any public customer promise)

- Obtain consent and define a chain-of-custody SOP. Supervised buyback events should be hosted with a credible partner.
- Inspect real devices for battery safety and ownership. Never accept unsafe batteries for unsupervised storage.
- Assess model, storage type, encryption, reset/account lock status, damage and feasible erasure method. Choose the specific method based on capabilities—not universal “factory reset.”
- For working phones, use supported manufacturer erase flows and verify the reset/account-unlink state. For HDDs and SSDs, select appropriate methods/tools for that particular media, and independently verify results where feasible.
- Inaccessible storage must be segregated, returned, or sent for qualified destruction. **Do not drill a whole phone:** lithium-ion batteries and storage chips create different hazards.
- Trial partnerships with established repair shops and appropriately registered/authorized downstream recyclers. Confirm documentation before marketing them as compliant.
- Measure actual device handovers, acceptance of quotes, dropouts due to distrust, average time and cost of processing, and margins after privacy-first storage removal.

## Stage 2: Minimum viable operational service

- Replace browser localStorage with a hosted private database and authentication/authorization. Admins and partners must have distinct roles, server-side access checks, and access logs.
- Sensitive device data (full serial, IMEI, personal identifiers, customer contacts) must never appear on public tracking pages. Use random unguessable token + customer authentication and redaction.
- Record each custody transfer: unique asset ID, sender/recipient, timestamp, location, tamper seal status, confirmation of physical handover, and exception handling.
- Real sanitization record schema:
  - Asset ID and securely stored serial/media identifier.
  - Storage type, media model, encryption/condition evaluation.
  - Approved procedure, tool name/version, operator and timestamps.
  - Raw relevant tool output and validation checks; failure state if results are incomplete.
  - Evidence links stored with access controls and retention rules.
  - Second-party reviewer if assurance level calls for it.
  - Final disposition: reuse, returned storage, qualified destruction, parts or downstream processing.
  - Recipient and supporting manifest for downstream transfer.
- Certificate/report status can only be **verified** after *actual* applicable checks pass. A button in the UI may initiate a workflow but must not itself certify the underlying operation.
- Clear pricing adjustments for privacy-first destruction of non-removable storage; avoid promising full resale value regardless of method.
- Document incident response, failed erasure, lost custody, customer notification, retention/deletion and the limits of any indemnity.

## Stage 3: Scale cautiously

- Validate sample BDT pricing against actual offers, resale outcomes, repair labor, transport, rejection rates and hazardous-disposal cost before attempting ML.
- Real B2B service: signed terms, client-specific audit requirements, inventory reconciliation, documented evidence and independent quality assurance.
- Consider separate partner and auditor portals only once a verified backend and governance are operational.
- Consider device trade-ins/swaps *after* reliable refurbished inventory and warranties exist. Do not launch them in the initial public demo.

## Standards / important distinction

The current NIST resource is **SP 800-88 Revision 2 (September 2025)**: https://csrc.nist.gov/pubs/sp/800/88/r2/final. NIST does not certify CycleCell merely because a website references the standard. The actual sanitization program must select and validate applicable methods and controls, taking account of the storage technology and data sensitivity. Seek specialist technical and local legal review before launch.
