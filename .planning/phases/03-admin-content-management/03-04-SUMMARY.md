---
phase: 03-admin-content-management
plan: 04
subsystem: ui, api
tags: [papaparse, exceljs, csv, excel, import, export, bulk, diacritics, utf8-bom]

requires:
  - phase: 03-admin-content-management
    provides: Question/chapter schema, getCurrentAdmin, logAudit, chapters for select
provides:
  - Bulk import from CSV and Excel with validation and upsert
  - Export to CSV (UTF-8 BOM) and Excel (.xlsx)
  - Import validation report with row-by-row errors
  - File upload with drag-and-drop zone
affects: [04-practice-tests]

tech-stack:
  added: [papaparse, exceljs, @types/papaparse]
  patterns: [client-side file parsing, server-side batch import in transactions, base64 binary transfer, UTF-8 BOM for CSV]

key-files:
  created:
    - src/lib/validations/import.ts
    - src/lib/actions/import-export.ts
    - src/components/admin/import-upload.tsx
    - src/components/admin/import-validation-report.tsx
    - src/components/admin/export-controls.tsx
    - src/app/(admin)/admin/import-export/page.tsx
    - src/components/ui/alert.tsx
  modified: []

key-decisions:
  - "Client-side parsing (PapaParse/ExcelJS) to avoid large file uploads to server"
  - "Server action receives parsed data array, not raw file -- separation of concerns"
  - "Batch size of 50 rows per transaction to avoid timeout on large imports"
  - "CSV export includes UTF-8 BOM for correct Romanian diacritics in Excel"
  - "Excel export returns base64-encoded buffer for client-side download"
  - "Import supports upsert: rows with existing question ID update, new rows insert"

patterns-established:
  - "File upload: drag-and-drop zone with client-side parse -> server action for validation/persist"
  - "Export: server action returns data, client formats and triggers download"
  - "UTF-8 BOM: prepend \\uFEFF to CSV content for Excel diacritics compatibility"
  - "Batch transaction: process N rows per db.transaction() call to balance atomicity vs timeout"

requirements-completed: [ADMN-04, ADMN-05]

duration: ~12min
completed: 2026-03-03
---

# Plan 03-04: Bulk Import/Export Summary

**CSV and Excel import with client-side parsing, server-side validation with row-by-row error reporting, and export with UTF-8 BOM for Romanian diacritics**

## Performance

- **Duration:** ~12 min
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Import from CSV (PapaParse) and Excel (ExcelJS) with client-side parsing
- Server-side validation with row-by-row error reporting and chapter name resolution
- Batch upsert in transactions of 50 rows (insert new, update existing by ID)
- Export to CSV with UTF-8 BOM for Romanian diacritics and Excel (.xlsx)
- Chapter filter for export, downloadable template CSV

## Task Commits

1. **Task 1: Import validation + server actions** - `79ae787` (feat, combined with Task 2)
2. **Task 2: Import/export UI components** - `79ae787` (feat)

## Files Created/Modified
- `src/lib/validations/import.ts` - Import row Zod schema with CS/CM validation
- `src/lib/actions/import-export.ts` - importQuestions, exportQuestionsCSV, exportQuestionsExcel
- `src/components/admin/import-upload.tsx` - Drag-and-drop file upload with parsing
- `src/components/admin/import-validation-report.tsx` - Row-by-row error display
- `src/components/admin/export-controls.tsx` - Export buttons with chapter filter
- `src/app/(admin)/admin/import-export/page.tsx` - Import/export page with sections
- `src/components/ui/alert.tsx` - shadcn Alert component (added via CLI)

## Decisions Made
- Client-side parsing avoids uploading large files to server
- Base64 transfer for Excel export (ExcelJS buffer -> base64 -> client decode)
- Template CSV download for user convenience

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed require() for drizzle-orm and()**
- **Found during:** Task 1 (Server actions)
- **Issue:** Used require("drizzle-orm") inside arrow function instead of ES import
- **Fix:** Added and() to top-level import from drizzle-orm
- **Files modified:** src/lib/actions/import-export.ts
- **Verification:** TypeScript compiles cleanly
- **Committed in:** 79ae787

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix necessary for correct ES module usage. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Question bank can be populated via bulk import, ready for quiz engine
- Export enables backup and external review of question data

---
*Phase: 03-admin-content-management*
*Completed: 2026-03-03*
