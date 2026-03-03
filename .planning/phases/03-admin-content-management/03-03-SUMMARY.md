---
phase: 03-admin-content-management
plan: 03
subsystem: ui, api
tags: [tanstack-table, data-table, questions, crud, live-preview, shadcn]

requires:
  - phase: 03-admin-content-management
    provides: Schema with questions/options tables, getCurrentAdmin, logAudit, chapters
provides:
  - Question CRUD server actions (create, update, archive, restore with transaction)
  - Question data table with filtering, pagination, and search
  - Question form with side-by-side live preview
  - Question preview component (student view)
affects: [03-04, 04-practice-tests, 05-exam-simulation]

tech-stack:
  added: [@tanstack/react-table]
  patterns: [data table with server-side filtering, split-pane form with live preview, CS/CM type-aware validation]

key-files:
  created:
    - src/lib/validations/question.ts
    - src/lib/actions/questions.ts
    - src/components/admin/question-form.tsx
    - src/components/admin/question-preview.tsx
    - src/components/admin/question-table.tsx
    - src/app/(admin)/admin/questions/page.tsx
    - src/app/(admin)/admin/questions/new/page.tsx
    - src/app/(admin)/admin/questions/[id]/edit/page.tsx
  modified: []

key-decisions:
  - "Side-by-side form+preview (60/40 split) for immediate visual feedback"
  - "CS uses radio buttons, CM uses checkboxes for correct answer selection"
  - "Question create/update uses transaction to ensure question+options atomicity"
  - "Data table uses URL search params for filter state persistence"

patterns-established:
  - "Question form: 60/40 split with QuestionPreview updating in real-time"
  - "Data table: @tanstack/react-table with server-side data, URL param filters"
  - "Type-aware validation: CS requires exactly 1 correct, CM requires 2+ correct"
  - "Transaction pattern: insert question + insert 5 options in single transaction"

requirements-completed: [ADMN-02, ADMN-03]

duration: ~15min
completed: 2026-03-03
---

# Plan 03-03: Question CRUD with Live Preview Summary

**Question management with data table, server-side filtering, form with live student preview, and CS/CM type-aware validation**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Question CRUD with transactional create/update (question + 5 options atomically)
- Data table with chapter filter, CS/CM type filter, text search, and pagination
- Side-by-side form with live student preview (60/40 split)
- CS/CM-aware validation: CS requires exactly 1 correct answer, CM requires 2+

## Task Commits

1. **Task 1: Question validation + server actions** - `938931a` (feat, combined with Task 2)
2. **Task 2: Question UI components + pages** - `938931a` (feat)

## Files Created/Modified
- `src/lib/validations/question.ts` - Zod schema with CS/CM refine validation
- `src/lib/actions/questions.ts` - Server actions: getQuestions, getQuestionById, create, update, archive, restore
- `src/components/admin/question-form.tsx` - Split form with live preview, source book dropdown
- `src/components/admin/question-preview.tsx` - Student view preview rendering
- `src/components/admin/question-table.tsx` - Data table with filters and pagination
- `src/app/(admin)/admin/questions/page.tsx` - Server component with search param filters
- `src/app/(admin)/admin/questions/new/page.tsx` - New question page
- `src/app/(admin)/admin/questions/[id]/edit/page.tsx` - Edit question page

## Decisions Made
- Live preview renders in real-time as admin types (no save needed to preview)
- Source book dropdown populated from SOURCE_BOOKS constant
- URL search params used for filter persistence across page loads

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Zod v4 refine() API**
- **Found during:** Task 1 (Validation schema)
- **Issue:** Zod v4 refine() second argument must be object {message, path}, not function
- **Fix:** Changed from function form to static object form
- **Files modified:** src/lib/validations/question.ts
- **Verification:** TypeScript compiles cleanly
- **Committed in:** 938931a

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix necessary for Zod v4 compatibility. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Question bank management complete, ready for import/export
- Questions data model ready for quiz engine (Phase 4)

---
*Phase: 03-admin-content-management*
*Completed: 2026-03-03*
