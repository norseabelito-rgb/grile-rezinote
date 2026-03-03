# Phase 3 Context: Admin Content Management

<domain>
Admin panel for managing the question bank: chapter CRUD, question CRUD with CS/CM types and source references, bulk import/export (CSV/Excel), admin security.
</domain>

<decisions>

## Admin Panel Layout & Navigation

- **Navigation**: Fixed left sidebar with sections: Dashboard, Chapters, Questions, Import/Export, Settings
- **Architecture**: Route group within same Next.js app (/admin/*) — protected by superadmin check, not a separate app
- **Chapter ordering**: Drag-and-drop reorder — admin drags chapters into desired display order
- **Chapter list stats**: Show question count and CS/CM breakdown per chapter in the chapter list view

## Question Editor UX

- **Form structure**: Single-page form — all fields visible at once for fastest data entry
- **Options**: Always 5 (A-E) — fixed, matches real exam format exactly
- **Source reference**: Structured fields — book dropdown (predefined list of textbooks) + page number input
- **Preview**: Live preview panel — side-by-side editor (left) and student view (right), updates in real-time
- **Question types**: CS (single correct answer) and CM (multiple correct answers) toggle

## Bulk Import/Export

- **CSV/Excel column structure**: Claude's discretion — design the most user-friendly spreadsheet format for bulk entry
- **Validation errors**: Row-by-row error report — show each invalid row with specific error, admin fixes and re-uploads
- **Export**: Full export + per-chapter filtering — export all questions or filter by chapter before exporting
- **Import mode**: Add + update — if a question ID exists in the import file, update it; otherwise create new
- **Diacritics**: Must preserve Romanian diacritics (ă, â, î, ș, ț) in both import and export

## Admin Access & Audit Trail

- **Admin assignment**: Database flag — is_superadmin boolean column on users table, set manually via Supabase dashboard or seed script
- **Audit logging**: Full audit log — log every create/edit/delete action with timestamp, admin user, and what changed
- **Deletions**: Soft delete (archive) — nothing permanently deleted, questions/chapters archived and can be restored
- **Route protection**: Server-side check on every /admin/* route — redirect non-admins to dashboard

</decisions>

<specifics>
- Drag-and-drop for chapter reordering was explicitly chosen over numeric ordering
- Structured source references (book dropdown + page) chosen over free-text for consistency
- Live preview panel was explicitly requested for the question editor
- Soft delete was chosen to protect against accidental data loss
- Full audit trail was explicitly requested, not just timestamps
</specifics>

<code_context>
- Builds on Phase 2's auth system (superadmin check via is_superadmin DB flag)
- Uses Phase 1's design system (shadcn/ui components, Tailwind, medical blue/teal)
- Admin route group: (admin) in Next.js App Router
- Drizzle ORM for all CRUD operations
- Libraries needed: drag-and-drop (dnd-kit or similar), CSV parsing (papaparse), Excel (xlsx/exceljs)
</code_context>

<deferred>
- Multi-level admin roles (content editor) — single superadmin for v1
- Question versioning with diff view — audit log covers basic tracking
- Bulk delete/archive operations — individual operations for v1
- Question tagging/categorization beyond chapters — not needed for v1
</deferred>
