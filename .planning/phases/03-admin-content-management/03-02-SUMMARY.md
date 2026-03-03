---
phase: 03-admin-content-management
plan: 02
subsystem: ui, api
tags: [dnd-kit, drag-and-drop, chapters, crud, shadcn, dialog]

requires:
  - phase: 03-admin-content-management
    provides: Schema with chapters.archivedAt, getCurrentAdmin, logAudit, admin sidebar
provides:
  - Chapter CRUD server actions (create, update, archive, restore, reorder)
  - Chapter list with drag-and-drop reordering
  - Chapter form dialog with validation
  - Chapter management page
affects: [03-03, 03-04, 04-practice-tests, 05-exam-simulation]

tech-stack:
  added: [@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities]
  patterns: [dialog form pattern, drag-and-drop reordering with optimistic UI, server action with Zod validation]

key-files:
  created:
    - src/lib/validations/chapter.ts
    - src/lib/actions/chapters.ts
    - src/components/admin/chapter-form.tsx
    - src/components/admin/chapter-list.tsx
    - src/app/(admin)/admin/chapters/page.tsx
  modified: []

key-decisions:
  - "Used @dnd-kit over react-beautiful-dnd (maintained, modern, better a11y)"
  - "Chapter reorder uses transaction-based sortOrder update for consistency"
  - "Archive/restore pattern for soft delete with separate active/archived sections"

patterns-established:
  - "Dialog form pattern: shadcn Dialog with controlled open state + form validation"
  - "Drag-and-drop reorder: DndContext + SortableContext with arrayMove, server persist via transaction"
  - "Server action pattern: validate with Zod, call getCurrentAdmin, perform DB op, logAudit, revalidatePath"

requirements-completed: [ADMN-01]

duration: ~12min
completed: 2026-03-03
---

# Plan 03-02: Chapter CRUD with Drag-and-Drop Summary

**Full chapter management with create/edit/archive/restore actions and drag-and-drop reordering using @dnd-kit**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Chapter CRUD with Zod validation, audit logging, and revalidation
- Drag-and-drop reordering with @dnd-kit (DndContext + SortableContext)
- Active/archived chapter sections with stats badges (total, CS, CM counts)
- Dialog-based create/edit form with controlled state

## Task Commits

1. **Task 1: Chapter validation + server actions** - `9da626e` (feat, combined with Task 2)
2. **Task 2: Chapter UI components + page** - `9da626e` (feat)

## Files Created/Modified
- `src/lib/validations/chapter.ts` - Zod schema for chapter name (required, max 200) and description
- `src/lib/actions/chapters.ts` - Server actions: getChaptersWithStats, create, update, archive, restore, reorder
- `src/components/admin/chapter-form.tsx` - Dialog form for creating/editing chapters
- `src/components/admin/chapter-list.tsx` - Sortable list with DnD, stats, edit/archive actions
- `src/app/(admin)/admin/chapters/page.tsx` - Server component loading chapters with stats

## Decisions Made
- @dnd-kit chosen over react-beautiful-dnd (actively maintained, better accessibility)
- Transaction-based reorder ensures consistent sortOrder values

## Deviations from Plan
None - plan executed as specified.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Chapters available for question association
- Chapter list provides data for import/export chapter filtering

---
*Phase: 03-admin-content-management*
*Completed: 2026-03-03*
