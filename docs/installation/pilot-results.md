# TabDo Real-Project Pilot Results & Proposal

[Installation Smoke](installation-smoke.md) · [Pilot Runbook](real-project-pilot.md) · [Installation Guide (EN)](README.md) · [P06 Roadmap](../../docs/phases/p06-distribution-quality-scaling.md)

This document records the preflight audit, proposed mobile flow, acceptance criteria, and gate status for piloting `mobile-web-ui-ux-skill` on the candidate repository **TabDo**.

## 1. Candidate Project Preflight Snapshot

- **Repository:** `https://github.com/fat2fast/TabDo`
- **Local Path:** `/home/phatp/work/tabdo`
- **Baseline Git HEAD:** `2b06c112d8b06888086694ebd2aba7bf47646a05`
- **Dirty State Snapshot:**
  - Untracked `plans/` (pre-existing, preserved)
  - Untracked `.agents/skills/mobile-web-ui-ux-skill/` (installed in Gate 1)
  - Zero modified tracked files.

## 2. Read-Only Route Audit

Inspection of `/home/phatp/work/tabdo/apps/web/src/app/App.tsx` and related pages reveals:
- **Routes Identified:**
  - Public: `/login`, `/admin/login`, `/change-password`
  - Authenticated Portal: `/dashboard`, `/tasks/inbox`, `/tasks/today`, `/tasks/upcoming`, `/calendar`, `/summary`, `/settings`
- **Audit Findings on Candidate Surfaces:**
  - The `/dashboard` route (`DashboardPage.tsx`) presents an overview card, overdue tasks, priority tasks, today's schedule, and upcoming deadlines.
  - On mobile viewports (e.g., 390px width), metric cards and task list items stack vertically with dense layouts and touch targets that fall below 44x44px.
  - Quick action affordances for viewing priority tasks can be streamlined on small screens without impacting desktop behavior.

## 3. Proposed Implementation Scope (Awaiting User Approval)

In strict accordance with the Gate 3 safety boundary, no code edits may occur until this proposal is reviewed and approved by the user.

| Field | Proposed Specification |
|---|---|
| **Candidate Origin** | `https://github.com/fat2fast/TabDo` |
| **Baseline Git HEAD & State** | Commit `2b06c112d8b06888086694ebd2aba7bf47646a05`; 0 modified tracked files; pre-existing `plans/` preserved; `.agents/skills/mobile-web-ui-ux-skill` installed. |
| **Target Flow & Route** | `/dashboard` — Mobile Overview and Priority Task Scanning |
| **User Task** | As a mobile user, view today's overview and scan priority tasks quickly with comfortable touch targets. |
| **Allowed Files (Absolute Paths)** | 1. `/home/phatp/work/tabdo/apps/web/src/pages/DashboardPage.tsx`<br/>2. `/home/phatp/work/tabdo/apps/web/src/features/dashboard/components/today-overview-card.tsx`<br/>3. `/home/phatp/work/tabdo/apps/web/src/features/dashboard/components/priority-tasks.tsx` |
| **Strict Non-Goals** | No database changes, no Supabase Auth/RLS alterations, no task reminder/extension changes, no desktop layout breakage, no dependency additions, no changes outside allowed files. |
| **Testing Environment** | Dedicated non-production testing session (local dev server on localhost, mock/dummy task state or non-production test account, no connection to production Supabase project or live user data). |
| **Mobile Viewport** | 390 × 844 px (iPhone 12/13/14 scale) |
| **Desktop Viewport** | 1280 × 800 px (regression guard) |
| **Measurable Acceptance Criteria** | 1. **Touch Targets:** All interactive elements (quick action buttons, task items, collapse/expand toggles) on `/dashboard` in mobile viewport have min tap area 44 × 44 px.<br/>2. **Content Hierarchy:** Overview metric cards and priority tasks fit within 390px width without horizontal overflow; task titles do not truncate prematurely.<br/>3. **Desktop Regression:** At 1280 × 800 px, multi-column grid layout remains visually and functionally identical.<br/>4. **Code Quality:** Zero test failures, zero typecheck errors. |
| **Project Commands & Exits** | Baseline: `pnpm --filter @tabdo/web test` (Exit 0), `pnpm --filter @tabdo/web typecheck` (Exit 0)<br/>After: `pnpm --filter @tabdo/web test` (Exit 0), `pnpm --filter @tabdo/web typecheck` (Exit 0) |
| **Proposed Executor** | Antigravity AI Assistant |
| **User Approval Status** | **PENDING USER APPROVAL** (Gate 3 strictly paused until explicit user confirmation) |

## 4. Gate Status Summary

- **Gate 1 (Packaging Smoke):** **PASS** (18 files installed, SHA-256 verified, link closure verified).
- **Gate 2 (Activation Smoke):** **PARTIAL** (Antigravity PASS with trace; Codex READY / NOT RUN).
- **Gate 3 (Scoped Implementation):** **NOT RUN** (Code edits strictly paused awaiting explicit user approval of the proposed flow above).
