# MedOrtho — Level 1 Cases 001–010 (Clinical Content v3.1)

## What's included

- `cases/MED-ORT-L1-001.json` through `010.json`: 10 detailed individual case files.
- `cases/*.min.json`: compact equivalents for transport; **same clinical content**.
- `MedOrtho-10-Case-Clinical-Showcase.html`: self-contained, premium-styled reviewer demo. Open in a modern browser; it embeds all ten cases, with interactive selections, written reports, treatment numbering, and **a simulated demo wallet only**.
- `manifest.json`: ID, primary clinical topic, source links, SHA-256 per full file.
- `QA_report.json`: referential integrity and option counts.
- `simulation_QA.json`: successful deterministic reference-engine playthroughs.
- `reference_runtime.py`: reference implementation for selected rule checks (not production Flutter code).

## The ten cases

| Case ID | Clinical topic | Distinct decision | Guideline families |
|---|---|---|---|
| 001 | Displaced extra-articular Colles distal radius | Safe closed reduction and post-reduction confirmation | AAOS/ASSH, BOAST, AO Alliance |
| 002 | Smith distal radius, unstable after reduction | Post-reduction instability triggers orthopedic fixation assessment | StatPearls, AAOS, BOAST |
| 003 | Occult nondisplaced scaphoid waist | Initial X-ray negative; MRI subsequently confirms | NICE, ACR, AAOS |
| 004 | Pediatric isolated torus distal radius | Removable splint, avoid reduction/rigid cast/repeat routine imaging | NICE, RCH |
| 005 | Closed minimally displaced midshaft clavicle | Simple sling, check skin/chest/plexus before discharge | AAOS |
| 006 | First traumatic anterior shoulder dislocation | Axillary nerve checks and pre-/post-reduction films | AAOS, RCH |
| 007 | Minimally displaced proximal humerus surgical neck | Nonoperative support, staged mobilization, fragility prevention | AO Surgery Reference, StatPearls |
| 008 | Mason I radial head | Screen wrist/DRUJ, short support and early motion | AAOS, NSW ACI |
| 009 | Pediatric Gartland III supracondylar humerus | Neurovascular priority, safe low-flexion support, urgent specialist care | RCH, AO Alliance |
| 010 | Closed fifth metacarpal neck | Check clenched-fist bite/rotation, conservative support if stable | AAOS, peer-reviewed review |

## Data details, per case

- Realistic narrative with original **simulated** patient, full history and pertinent negatives, medications, allergies, goals, vital signs, examination and red flags.
- **10 selectable history questions** (including low-value distractors) with patient answers; **9 examination actions** with actual case findings and unsafe distractors.
- **12–14 selectable investigations** with individual patient-specific written findings and impressions. No investigation photographs, diagnostic images, or imaging paywalls.
- **10 differential diagnoses** with individualized explanation; their visible positions are varied and reshuffled by Flutter. The first answer is never hardcoded as correct.
- **16–20 shuffled treatment options** (8–11 appropriate required actions; 8–10 misleading or unsafe distractors). Unique stable action IDs and explicit treatment prerequisites; appropriate actions are dynamically numbered when accepted.
- Scenario-specific Dr. Puffle free welcome, safety alerts, explanations, completion messages, and optional **100-MedCoin advanced hints for each stage** (history, examination, investigations, diagnosis, treatment).
- Three end-of-case MCQs and debrief/clinical pearls.
- Links to professional guidance, plus private `PENDING_INDEPENDENT_CLINICAL_REVIEW` metadata.

## Treatment numbering (must implement in Flutter)

1. Shuffle all visible action objects on new attempt; keep each `id` unchanged. **Never** equate `options[0]` or a displayed index with correctness.
2. On tap, look up action by `id`.
3. If `kind == incorrect` or `unsafe`: show Dr. Puffle reason; no sequence number; apply the selected penalty. Never deduct coins for safety advice.
4. If `kind == required`: check `requires` (previously accepted action IDs) and `requires_investigations` (reports already ordered and reviewed). If missing, show those requirements, **no number and no out-of-order score penalty**.
5. If valid, mark completed with number `accepted_actions.length + 1`. Any other currently eligible action can also be accepted; this is a **prerequisite graph**, not an arbitrarily rigid ordering of clinically parallel actions.
6. On recovery, restore attempt state by **IDs and accepted sequence**, not array positions.
7. Complete only when diagnosis and required investigations and treatment actions are done, without unresolved safety alerts.

## Investigation scoring

- Start with 100 points, subtract unjustified/avoidable test costs; essential omitted test -35.
- An essential test selected promptly before unnecessary work can receive a bonus **up to the 100-point cap**. Thus clinical appropriateness takes priority over simply ordering the smallest number of tests.
- Allow a `conditional` test at no penalty only if its **actual indication is satisfied** by the patient's evolving clinical condition, procedure or local protocol. Do not treat the user declaring a reason as sufficient without checking the indication.
- Phase gates are crucial: scaphoid MRI follows its nondiagnostic initial X-ray; post-reduction radiographs follow treatment; selected secondary prevention belongs after acute stabilization.
- Reports are simulated patient-specific educational results. Exact numerical values are teaching examples and should not be marketed as source-measured patient data.

## Paid Dr. Puffle hints (100 MedCoins)

- Friendly conversational stage messages, error explanations and urgent safety advice are free.
- Advanced stage-specific guidance costs **100 MedCoins per stage per case attempt**, once. Reopening already purchased guidance is free.
- Flutter **must not** directly update a locally trusted currency balance. Use an authenticated server endpoint to check the wallet, atomically debit 100, record the user/case/attempt/stage idempotency key, and return the authorized hint. Handle insufficient funds and offline gracefully.
- The HTML showcase is a **review demo**, so its coins are local ephemeral test values, not real MedCoins and not a viable production payment mechanism.
- Since downloaded JSON contains answer data and hint text, client-side hiding is **not secure against modification/inspection**. If payment-resistant gating is important, deliver paid hint content from a backend only *after* transaction authorization, or use encrypted payloads with server-issued keys. Do not rely on hiding buttons alone.

## High-quality medical education without misrepresentation

Patient stories are constructed to resemble the clinical situations encountered in practice. They are not claimed to be authentic patient records. Evidence-based recommendations and the cited guidelines are real; the case-specific measured values, patient names, treatment responses, and test results are authored simulation details for clinical reasoning. In-app front-end may say **“Evidence-informed clinical simulation”** (not a large “hypothetical” promotional banner); the full nature of source material should remain accessible in the clinical-information section.

**Publication gate:** These are well-developed content drafts, not surgeon-certified patient cases. A licensed orthopedic/hand/pediatric orthopedic reviewer should check diagnostic accuracy, investigations, treatment prerequisites, local scope, and contraindications; the team should verify operational behavior inside the Flutter app. Some acceptable decisions change with mechanism, specialist assessment, patient preferences, regional protocols, and follow-up.

## Limitations / implementation note

The reference Python engine demonstrates that the proposed prerequisite graph can be completed and that incorrect/premature actions do not receive a treatment number. It does not implement authentication, real MedCoin currency, full history/exam grading, treatment alternatives for changed patient status, or adversarial client security. Those belong in the production Flutter/backend integration and additional testing.

The case cover asset paths (`assets/cover/case_001.webp` etc.) are placeholders. **No cover images are included** in this package. Investigation images are intentionally omitted, as requested.
