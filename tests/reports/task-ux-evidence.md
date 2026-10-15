# Task-First Mobile UX Improvement — Verification Evidence Report

**Date:** 2026-10-15  
**Harness:** Playwright Test 1.50+ on Managed Chromium (headless, Linux / WSL Ubuntu 24.04, Node v26.10.0)  
**Historical Provenance:** Retrofit tests under `tests/261015-retrofit/` remain immutable baseline archives; new results are saved strictly under `tests/task-ux/artifacts/`.

---

## 1. Acceptance Criteria Verification Matrix

| Acceptance Item ID | Scope & Requirement | Executed Check & Viewport | Result | Evidence Artifact |
|---|---|---|---|---|
| `ORDER-MOBILE-FIT` | Order ID, status, and follow-up action visible with 0px horizontal scroll on mobile | `tests/task-ux/order.spec.cjs` at 320px & 390px | `ORDER-MOBILE-FIT | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `ORDER-INVARIANTS` | Search, detail route, Back, filter, sort, CSV export, Delivered action, and bulk selection | `tests/task-ux/order.spec.cjs` at 390px & 1280px | `ORDER-INVARIANTS | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `ORDER-DESKTOP` | Multi-column table layout and 10 headers preserved at desktop | `tests/task-ux/order.spec.cjs` at 1280px | `ORDER-DESKTOP | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `COMPARISON-SEMANTICS` | Semantic table structure (`<th scope="col">`, `<th scope="row">`), 4 plans, 7 metrics, all units intact | `tests/task-ux/comparison.spec.cjs` at 390px | `COMPARISON-SEMANTICS | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `COMPARISON-SCROLL-STICKY` | Horizontal scroll enabled, visual scroll cue shown, sticky attribute labels pinned during scroll | `tests/task-ux/comparison.spec.cjs` at 320px & 390px | `COMPARISON-SCROLL-STICKY | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `COMPARISON-SELECTION` | Plan selection action works and announces confirmation; accessible keyboard navigation | `tests/task-ux/comparison.spec.cjs` at 390px | `COMPARISON-SELECTION | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `REQUEST-DATE-INPUT` | Manual date typing (`YYYY-MM-DD`) and real-time reactive inclusive duration derivation | `tests/task-ux/request-form.spec.cjs` at 390px | `REQUEST-DATE-INPUT | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `REQUEST-VALIDATION` | Date range inversion blocked; `reason = 'REJECT'` triggers server 422 | `tests/task-ux/request-form.spec.cjs` at 390px | `REQUEST-VALIDATION | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `REQUEST-ERROR-RECOVERY` | Valid field values preserved on error; focus shifts to invalid field; inline error linked via `aria-describedby` | `tests/task-ux/request-form.spec.cjs` at 390px | `REQUEST-ERROR-RECOVERY | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `REQUEST-RESUBMIT` | Resubmission with corrected reason succeeds with HTTP 200 and receipt `REQ-2026-001` | `tests/task-ux/request-form.spec.cjs` at 390px | `REQUEST-RESUBMIT | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `REQUEST-CTA-CLEARANCE` | Zero horizontal overflow across 320, 375, 390, 430px; in-flow submit CTA does not occlude inputs | `tests/task-ux/request-form.spec.cjs` (320-430px) | `REQUEST-CTA-CLEARANCE | PASS` | `tests/task-ux/artifacts/test-results.json` |
| `FIXTURE-BUILDS` | All 3 fixtures and 3 task-first implementations build cleanly with `npm run build` | `npm run build` across 6 projects | `FIXTURE-BUILDS | PASS` | `tests/task-ux/artifacts/build-results.json` |
| `STRUCTURAL-VALIDATION` | Skill metadata, required files, and 331 internal markdown links valid | `python3 scripts/validate_skill.py` | `STRUCTURAL-VALIDATION | PASS` | `scripts/validate_skill.py` |
| `PHYSICAL-KEYBOARD-TEST` | Virtual keyboard emergence and touch viewport resizing on physical mobile devices | Physical device testing (iPhone / Android) | `PHYSICAL-KEYBOARD-TEST | NOT RUN` | Replay: Open `http://<ip>:4181` on phone, focus `#reason`, verify submit visibility |
| `HUMAN-TASK-WALKTHROUGH` | Human completion time and cognitive load benchmarking | Human evaluation protocol | `HUMAN-TASK-WALKTHROUGH | NOT RUN` | Replay: Provide user task prompt, record completion steps and qualitative friction |

---

## 2. Before vs After Task Comparison

| Surface / Task | Baseline Experience | Task-First Implementation | Usability Outcome |
|---|---|---|---|
| **Order Dashboard (320px/390px)** | 1080px table forced continuous horizontal scrolling (**measured 438px scroll distance**) to find status and follow-up action. | Mobile card list presents Order ID, Customer, Status, Total, and Follow-up action in immediate view with **0px sideways scroll**. Full details reachable via detail route with Back. Desktop keeps 10-column table. | Primary task friction eliminated; zero horizontal scroll required. |
| **Comparison Table (320px/390px)** | Table required horizontal scrolling, but row headers scrolled off-screen, disconnecting metrics from labels; no scroll affordance. | Semantic table preserved with **sticky pinned attribute headers** (`left: 0`) and explicit swipe scroll cue (`↔ Swipe horizontally`). Units and alignment preserved across 4 plans; keyboard traversal and plan selection verified. | Two-dimensional comparison task preserved without losing attribute context. |
| **Request Form (320px/390px)** | Fixed bottom submit bar (`bottom: 0`, top < 480px at 480px height) risked occluding active inputs or virtual keyboard; no derived day feedback; error focus lost. | Clean single-column layout with in-flow submit CTA with verified geometric clearance (`submitRect.top >= fileRect.bottom`), manual keyboard date typing, reactive duration calculation (`5 days (inclusive)`), strict calendar validation (`2026-02-31` and `2028-01-01` rejected), multipart binary file delivery (`fileReceived: true`), and automatic focus shift to invalid fields. | Form recovery and keyboard clearance verified; valid inputs retained. |

---

## 3. Evidence Provenance & Limitations

- **Automation Speed vs Human Time:** Headless Playwright test execution duration reflects automated command latency, **not** human completion time. Usability claims are strictly limited to observable UI mechanics and accessibility invariants.
- **Physical Device Boundary:** On-screen virtual keyboard behavior, native date pickers, and touch momentum on hardware devices are cataloged as `NOT RUN` with documented manual replay steps.
- **Comparative Superiority Claim Boundary:** A controlled scientific claim of skill superiority versus a baseline without skill requires the multi-case protocol defined in [evals/comparison-protocol.md](../../evals/comparison-protocol.md) (Tier B).