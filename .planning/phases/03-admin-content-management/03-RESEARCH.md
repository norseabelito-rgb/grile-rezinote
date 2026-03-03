# Phase 3: Admin Content Management - Research

**Researched:** 2026-03-03
**Domain:** Admin CRUD panel, bulk import/export, drag-and-drop, audit logging
**Confidence:** HIGH

## Summary

Phase 3 builds the admin content management system for the question bank. The existing codebase already has the DB schema for chapters, questions, and options (from Phase 1), an admin route group `(admin)` with layout, a `userRoleEnum` with "student"/"admin" roles, and middleware that protects `/admin` routes from unauthenticated users. The current schema needs extensions: soft delete fields (`archivedAt`), an `isSuperadmin` boolean on users (or leverage the existing role enum), audit log table, and a source books reference table.

The admin panel uses Next.js 15 App Router with Server Actions for mutations, Drizzle ORM for database operations, shadcn/ui for UI components (data tables, forms, dialogs), dnd-kit for drag-and-drop chapter reordering, PapaParse for CSV parsing, and ExcelJS for Excel import/export. All decisions from CONTEXT.md are locked and researched accordingly.

**Primary recommendation:** Build the admin panel as 4 vertical slices: (1) schema extensions + admin security, (2) chapter CRUD with drag-and-drop, (3) question CRUD with live preview, (4) bulk import/export. Use Server Actions exclusively for mutations with Zod validation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Admin Panel Layout & Navigation:**
- Navigation: Fixed left sidebar with sections: Dashboard, Chapters, Questions, Import/Export, Settings
- Architecture: Route group within same Next.js app (/admin/*) -- protected by superadmin check, not a separate app
- Chapter ordering: Drag-and-drop reorder -- admin drags chapters into desired display order
- Chapter list stats: Show question count and CS/CM breakdown per chapter in the chapter list view

**Question Editor UX:**
- Form structure: Single-page form -- all fields visible at once for fastest data entry
- Options: Always 5 (A-E) -- fixed, matches real exam format exactly
- Source reference: Structured fields -- book dropdown (predefined list of textbooks) + page number input
- Preview: Live preview panel -- side-by-side editor (left) and student view (right), updates in real-time
- Question types: CS (single correct answer) and CM (multiple correct answers) toggle

**Bulk Import/Export:**
- CSV/Excel column structure: Claude's discretion
- Validation errors: Row-by-row error report
- Export: Full export + per-chapter filtering
- Import mode: Add + update (upsert by question ID)
- Diacritics: Must preserve Romanian diacritics

**Admin Access & Audit Trail:**
- Admin assignment: Database flag (is_superadmin boolean on users table)
- Audit logging: Full audit log with timestamp, admin user, and what changed
- Deletions: Soft delete (archive)
- Route protection: Server-side check on every /admin/* route

### Claude's Discretion
- CSV/Excel column structure design
- Technical implementation details for audit logging
- Internal code organization patterns

### Deferred Ideas (OUT OF SCOPE)
- Multi-level admin roles (content editor) -- single superadmin for v1
- Question versioning with diff view
- Bulk delete/archive operations
- Question tagging/categorization beyond chapters
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADMN-01 | Admin poate crea, edita si sterge capitole (nume, descriere, ordine) | Drizzle CRUD + dnd-kit for reordering, soft delete pattern |
| ADMN-02 | Admin poate crea grile cu: intrebare, optiuni (A-E), tip CS/CM, raspuns(uri) corect(e), sursa (carte/pagina) | Server Actions + Zod validation, structured source reference |
| ADMN-03 | Admin poate edita si sterge grile existente | Drizzle update/soft-delete, transaction for question+options |
| ADMN-04 | Admin poate importa grile in bulk din CSV si Excel | PapaParse for CSV, ExcelJS for xlsx, row-by-row validation |
| ADMN-05 | Admin poate exporta grile in format CSV si Excel | PapaParse unparse for CSV, ExcelJS workbook builder for xlsx |
| ADMN-07 | Admin panel securizat doar pentru superadmin | is_superadmin column + middleware + server-side layout check |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x (existing) | App Router, Server Actions, route groups | Already in project |
| Drizzle ORM | 0.45.x (existing) | Type-safe DB operations, migrations | Already in project |
| shadcn/ui | latest (existing) | UI components (tables, forms, dialogs) | Already in project |
| Zod | 4.x (existing) | Server Action input validation | Already in project |
| @dnd-kit/react | 0.3.x | Drag-and-drop for chapter reordering | Modern React DnD toolkit, lightweight, accessible |
| papaparse | 5.x | CSV parse/unparse | Most popular browser CSV parser, no deps, TypeScript support |
| exceljs | 4.4.x | Excel read/write (.xlsx) | Full xlsx support, streaming for large files |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-table | 8.x | Data table for question list | Complex table with sorting, filtering, pagination |
| @types/papaparse | latest | TypeScript types for PapaParse | Dev dependency for type safety |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @dnd-kit/react | react-beautiful-dnd | react-beautiful-dnd is deprecated; dnd-kit is the modern replacement |
| exceljs | sheetjs/xlsx | sheetjs community edition has restrictive license; exceljs is MIT |
| papaparse | csv-parse | csv-parse is Node-only; papaparse works in browser too |

**Installation:**
```bash
pnpm add @dnd-kit/react papaparse exceljs @tanstack/react-table
pnpm add -D @types/papaparse
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/(admin)/
│   ├── layout.tsx              # Admin layout with sidebar + superadmin check
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── chapters/
│   │   │   └── page.tsx        # Chapter list with DnD reorder
│   │   ├── questions/
│   │   │   ├── page.tsx        # Question list with data table
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create question form
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit question form
│   │   └── import-export/
│   │       └── page.tsx        # Bulk import/export UI
├── components/admin/
│   ├── admin-sidebar.tsx       # Fixed left sidebar navigation
│   ├── chapter-list.tsx        # Chapter list with DnD
│   ├── chapter-form.tsx        # Chapter create/edit dialog
│   ├── question-form.tsx       # Question editor (single page)
│   ├── question-preview.tsx    # Live student view preview
│   ├── question-table.tsx      # Data table for questions
│   ├── import-upload.tsx       # File upload + validation UI
│   └── export-controls.tsx     # Export buttons + filters
├── lib/
│   ├── actions/
│   │   ├── chapters.ts         # Chapter Server Actions
│   │   ├── questions.ts        # Question Server Actions
│   │   └── import-export.ts    # Import/Export Server Actions
│   ├── validations/
│   │   ├── chapter.ts          # Chapter Zod schemas
│   │   └── question.ts         # Question Zod schemas
│   └── db/
│       ├── schema.ts           # Extended with audit_logs, soft delete
│       └── queries/
│           ├── chapters.ts     # Chapter query helpers
│           └── questions.ts    # Question query helpers
```

### Pattern 1: Server Actions with Zod Validation
**What:** All admin mutations use Server Actions with Zod input validation
**When to use:** Every create/update/delete operation

```typescript
"use server"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { chapters } from "@/lib/db/schema"
import { chapterSchema } from "@/lib/validations/chapter"

export async function createChapter(formData: FormData) {
  const parsed = chapterSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  await db.insert(chapters).values(parsed.data)
  revalidatePath("/admin/chapters")
  return { success: true }
}
```

### Pattern 2: Soft Delete with archivedAt
**What:** Items are archived (soft-deleted) rather than permanently removed
**When to use:** All delete operations on chapters and questions

```typescript
// Schema extension
archivedAt: timestamp("archived_at"), // null = active, non-null = archived

// Soft delete action
export async function archiveQuestion(id: string) {
  await db.update(questions)
    .set({ archivedAt: new Date() })
    .where(eq(questions.id, id))
}

// All queries filter out archived
const activeQuestions = await db.select()
  .from(questions)
  .where(isNull(questions.archivedAt))
```

### Pattern 3: Audit Logging
**What:** Log every mutation with who, what, when, and changes
**When to use:** After every create/update/delete

```typescript
// Audit log table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // "create" | "update" | "delete" | "restore"
  entityType: text("entity_type").notNull(), // "chapter" | "question"
  entityId: uuid("entity_id").notNull(),
  changes: text("changes"), // JSON string of {field: {old, new}}
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Helper function
async function logAudit(userId: string, action: string, entityType: string, entityId: string, changes?: object) {
  await db.insert(auditLogs).values({
    userId, action, entityType, entityId,
    changes: changes ? JSON.stringify(changes) : null,
  })
}
```

### Pattern 4: Superadmin Route Protection
**What:** Server-side check in admin layout + middleware enhancement
**When to use:** Every admin route

```typescript
// In (admin)/layout.tsx - server component check
const { data: profile } = await supabase
  .from("users")
  .select("is_superadmin")
  .eq("id", user.id)
  .single()

if (!profile?.is_superadmin) {
  redirect("/dashboard")
}
```

### Anti-Patterns to Avoid
- **Client-side-only admin checks:** Always enforce on server. Client checks are UX, not security.
- **Hard deletes:** Use soft delete (archivedAt) per user decision. Cascade deletes lose data.
- **Fat Server Actions:** Keep actions thin (validate, mutate, revalidate). Put complex logic in separate functions.
- **Unvalidated imports:** Always validate every row before inserting. Never trust uploaded files.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag and drop | Custom mouse event handlers | @dnd-kit/react | Accessibility, touch support, keyboard navigation built in |
| CSV parsing | Manual string splitting | PapaParse | Handles quoted fields, newlines in values, encoding edge cases |
| Excel files | ZIP/XML manipulation | ExcelJS | xlsx is a complex format with dozens of edge cases |
| Data tables | Custom table with sort/filter | @tanstack/react-table + shadcn | Pagination, sorting, filtering, column visibility for free |
| Form validation | Manual field checks | Zod schemas | Type inference, nested validation, custom error messages |

**Key insight:** CSV and Excel parsing have enormous edge case surfaces (encoding, escaping, date formats, cell types). Libraries handle years of bug fixes you don't want to rediscover.

## Common Pitfalls

### Pitfall 1: Romanian Diacritics in CSV Import
**What goes wrong:** CSV files saved with wrong encoding lose diacritics (ă, â, î, ș, ț become garbage characters)
**Why it happens:** Windows Excel defaults to Windows-1252/ANSI encoding, not UTF-8
**How to avoid:** Use PapaParse with `encoding: 'UTF-8'` config. For Excel files, ExcelJS handles encoding internally. On export, add UTF-8 BOM to CSV files so Excel opens them correctly.
**Warning signs:** Characters like `ÅŸ` or `È›` appearing instead of `ș` or `ț`

### Pitfall 2: Drag-and-Drop Hydration Mismatch
**What goes wrong:** DnD components cause hydration errors in Next.js SSR
**Why it happens:** DnD libraries generate dynamic IDs that differ between server and client renders
**How to avoid:** Mark DnD wrapper components with `"use client"` directive. Use `useId()` for stable IDs. Consider wrapping in dynamic import with `ssr: false` if hydration persists.
**Warning signs:** Console hydration mismatch warnings, flickering on load

### Pitfall 3: Concurrent Sort Order Updates
**What goes wrong:** Two admins reorder chapters simultaneously, sort_order values get corrupted
**Why it happens:** Read-then-write without proper locking
**How to avoid:** Use a database transaction for batch sort order updates. Send the complete ordered list, not individual moves.
**Warning signs:** Chapters appearing in unexpected order after reorder

### Pitfall 4: Large File Imports Timing Out
**What goes wrong:** Importing 1000+ questions via Server Action times out
**Why it happens:** Server Actions have default timeout limits; bulk inserts are slow row-by-row
**How to avoid:** Parse and validate client-side (PapaParse in browser), send validated data in batches. Use `db.insert(questions).values(batchArray)` for batch inserts within transactions.
**Warning signs:** 504 timeout errors, partial imports

### Pitfall 5: Question-Options Transaction Integrity
**What goes wrong:** Question created but options fail to insert, leaving orphaned question
**Why it happens:** No transaction wrapping question + options insert
**How to avoid:** Always wrap question + 5 options insert in a single `db.transaction()`. Same for updates.
**Warning signs:** Questions with 0 options in the database

## Code Examples

### Chapter CRUD with Soft Delete
```typescript
// Create
await db.insert(chapters).values({
  name: "Anatomie",
  description: "Anatomia capului si gatului",
  sortOrder: nextOrder,
})

// Read (active only)
const activeChapters = await db.select()
  .from(chapters)
  .where(isNull(chapters.archivedAt))
  .orderBy(asc(chapters.sortOrder))

// Update
await db.update(chapters)
  .set({ name: "Anatomie Generala", updatedAt: new Date() })
  .where(eq(chapters.id, chapterId))

// Soft delete
await db.update(chapters)
  .set({ archivedAt: new Date() })
  .where(eq(chapters.id, chapterId))

// Restore
await db.update(chapters)
  .set({ archivedAt: null })
  .where(eq(chapters.id, chapterId))
```

### Question with Options (Transaction)
```typescript
await db.transaction(async (tx) => {
  const [question] = await tx.insert(questions).values({
    chapterId,
    text: questionText,
    type: "CS",
    sourceBook: "Boboc",
    sourcePage: "123",
  }).returning()

  await tx.insert(options).values(
    optionData.map((opt, i) => ({
      questionId: question.id,
      label: String.fromCharCode(65 + i), // A, B, C, D, E
      text: opt.text,
      isCorrect: opt.isCorrect,
    }))
  )
})
```

### Batch Sort Order Update
```typescript
export async function reorderChapters(orderedIds: string[]) {
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.update(chapters)
        .set({ sortOrder: i })
        .where(eq(chapters.id, orderedIds[i]))
    }
  })
  revalidatePath("/admin/chapters")
}
```

### CSV Import with Validation
```typescript
import Papa from "papaparse"

// Client-side parsing
const result = Papa.parse<QuestionRow>(file, {
  header: true,
  skipEmptyLines: true,
  encoding: "UTF-8",
})

// Validate each row
const errors: { row: number; message: string }[] = []
const valid: QuestionRow[] = []

result.data.forEach((row, index) => {
  const parsed = importRowSchema.safeParse(row)
  if (!parsed.success) {
    errors.push({ row: index + 2, message: parsed.error.issues[0].message })
  } else {
    valid.push(parsed.data)
  }
})

// Send valid rows to server action in batches
```

### CSV Export with BOM for Excel Compatibility
```typescript
import Papa from "papaparse"

const csv = Papa.unparse(data, { header: true })
// Add UTF-8 BOM so Excel opens with correct encoding
const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
```

### Excel Export with ExcelJS
```typescript
import ExcelJS from "exceljs"

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet("Questions")

sheet.columns = [
  { header: "Chapter", key: "chapter", width: 20 },
  { header: "Question", key: "question", width: 50 },
  { header: "Type", key: "type", width: 8 },
  { header: "Option A", key: "optA", width: 30 },
  // ... B through E
  { header: "Correct", key: "correct", width: 10 },
  { header: "Book", key: "book", width: 20 },
  { header: "Page", key: "page", width: 8 },
]

questions.forEach(q => sheet.addRow({ ... }))

const buffer = await workbook.xlsx.writeBuffer()
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | @dnd-kit/react | 2023+ (rbd deprecated) | Must use dnd-kit for new projects |
| getServerSideProps | Server Actions + Server Components | Next.js 14+ | Mutations via "use server" functions |
| API routes for CRUD | Server Actions | Next.js 14+ | No separate API layer needed for internal mutations |
| xlsx/sheetjs (community) | ExcelJS | Ongoing license concerns | MIT license, safer for commercial use |

**Deprecated/outdated:**
- react-beautiful-dnd: Officially deprecated by Atlassian, no maintenance
- Next.js Pages Router patterns: Project uses App Router exclusively

## Open Questions

1. **Source books list**
   - What we know: Structured book dropdown needed per CONTEXT.md
   - What's unclear: Whether to store books as a separate DB table or as a constant array
   - Recommendation: Start with a constants file (`lib/constants/source-books.ts`) -- can migrate to DB table later if admins need to add books. Simpler for v1.

2. **is_superadmin vs existing role column**
   - What we know: CONTEXT.md says "is_superadmin boolean column on users table"
   - Current state: Schema has `role: userRoleEnum("role")` with "student"/"admin"
   - Recommendation: Add `isSuperadmin: boolean` column as specified in CONTEXT.md. Keep existing role enum for future multi-role support. The is_superadmin flag is the gate for admin panel access.

## Sources

### Primary (HIGH confidence)
- Existing codebase: src/lib/db/schema.ts, src/middleware.ts, src/app/(admin)/ -- direct file reads
- Drizzle ORM docs: CRUD patterns, transactions, migrations

### Secondary (MEDIUM confidence)
- dnd-kit official site (dndkit.com) - v0.3.x API
- PapaParse official site (papaparse.com) - CSV parsing API
- ExcelJS GitHub (github.com/exceljs/exceljs) - Excel read/write API
- shadcn/ui docs (ui.shadcn.com) - Data table component

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are well-established, project already uses most of the core stack
- Architecture: HIGH - Standard Next.js App Router patterns, existing project structure is clear
- Pitfalls: HIGH - Well-documented issues with encoding, hydration, concurrent updates

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (stable stack, 30-day validity)
