# Test Infrastructure & Specification Guide: School Grades Portal & Teacher Profiles

**Milestone**: E2E Testing Track Orchestration & Test Suite Creation  
**Authoritative Request**: `m:\Qadoumi\.agents\ORIGINAL_REQUEST.md` (lines 117–172, dated 2026-09-17T11:45:46Z)  
**Test Suite File**: `tests/e2e-grades-teachers.ts`  
**Execution Runtime**: Node.js v24.18.0 (Native `--experimental-strip-types`)  

---

## 1. Architectural Overview & Philosophy

The Qadoumi Educational Platform expansion introduces a dedicated School Grades Portal (`/grades`), dynamic grade-specific hubs (`/grades/[slug]`), individual teacher profile pages (`/teachers/[id]`), homepage decluttering, and mobile bottom navigation updates.

To guarantee uncompromising quality, visual excellence, and rock-solid routing integrity without bloating production dependencies, the test suite is built on a **Zero-External-Dependency Native Test Harness**:

1. **Opaque-Box & Requirement-Driven**: Tests are derived strictly from authoritative specifications (`ORIGINAL_REQUEST.md` lines 117-172) and interface contracts (`PROJECT.md`).
2. **Native Type Stripping**: Executed directly with `node --experimental-strip-types tests/e2e-grades-teachers.ts`, eliminating the need for heavy external test runners (e.g. Jest, Vitest, Playwright).
3. **Multi-Faceted Verification**:
   - **Static & AST Code Analysis**: Inspects JSX hierarchy, CSS utility classes, Framer Motion attributes, props handling, and exported functions.
   - **Runtime Data & ORM Queries**: Validates data consistency directly against the local SQLite database (`prisma/dev.db`) using `@prisma/client`.
   - **Pure Algorithmic Logic**: Tests token sanitization (whitespace/comma trimming) and telephone/URL formatting without external mocking.
4. **Deterministic Exit Codes**:
   - Returns exit code `0` when 100% of test cases pass.
   - Returns exit code `1` if any assertion fails, printing detailed error diagnostics and a tabular execution breakdown.

---

## 2. Test Execution Standard

### Primary Execution (Native Node 24 Type Stripping)
```bash
node --experimental-strip-types tests/e2e-grades-teachers.ts
```

### Alternative Execution (ts-node transpile-only)
```bash
node -r ts-node/register/transpile-only tests/e2e-grades-teachers.ts
```

### Full TypeScript Typecheck
```bash
npx tsc --noEmit
```

### Production Build Verification
```bash
npm run build
```

---

## 3. Comprehensive 4-Tier Test Matrix

The test suite contains **44 test cases** systematically organized into 4 distinct verification tiers:

### Tier 1: Core Feature Coverage (F1 – F5) — 23 Tests

| Area | Test ID | Description | Target Component / File | Verification Method |
|:-----|:--------|:------------|:------------------------|:--------------------|
| **F1: Directory** | `T1_F1_01` | Presence & default export of Grades Directory page | `src/app/(public)/grades/page.tsx` | File check & export assertion |
| | `T1_F1_02` | Renders all 3 academic stages (`الصفوف الأساسية`, `الصفوف العليا`, `المرحلة الثانوية`) | `src/app/(public)/grades/page.tsx` | Stage category header matching |
| | `T1_F1_03` | Encompasses 13 canonical grades across the 3 stages | `src/app/(public)/grades/page.tsx` | Grade name token matching |
| | `T1_F1_04` | Vibrant stage gradient color schemes (emerald/teal, violet/indigo, gold/rose) | `src/app/(public)/grades/page.tsx` | Tailwind gradient classes |
| | `T1_F1_05` | Stylized Eastern Arabic numerals (١، ٢، ٣...) and Arabic typography | `src/app/(public)/grades/page.tsx` | Eastern numeral token analysis |
| | `T1_F1_06` | Grade cards contain direct links to dynamic hubs (`/grades/[slug]`) | `src/app/(public)/grades/page.tsx` | Regex link matching |
| | `T1_F1_07` | Interactive motion, hover lifts (`whileHover`), and responsive touch targets | `src/app/(public)/grades/page.tsx` | Framer Motion & CSS hover rules |
| **F2: Grade Hubs** | `T1_F2_01` | Presence of dynamic route handler | `src/app/(public)/grades/[slug]/page.tsx` | File path validation |
| | `T1_F2_02` | Segmented 3-tab navigation (المواد الدراسية، الدوسيات، كادر المعلمين) | `src/app/(public)/grades/[slug]/page.tsx` | Tab label & container assertions |
| | `T1_F2_03` | Materials tab filters `Material` model with direct download triggers | `src/app/(public)/grades/[slug]/page.tsx` | ORM query / download link check |
| | `T1_F2_04` | Teachers tab links directly to teacher profiles (`/teachers/[id]`) | `src/app/(public)/grades/[slug]/page.tsx` | Profile link structure matching |
| **F3: Profiles** | `T1_F3_01` | Presence of dedicated teacher profile route | `src/app/(public)/teachers/[id]/page.tsx` | File existence validation |
| | `T1_F3_02` | Teacher identity: name, subject badge, image, and rich bio | `src/app/(public)/teachers/[id]/page.tsx` | Prop & DOM element assertions |
| | `T1_F3_03` | Visual badges for all taught grades linking back to `/grades/[slug]` | `src/app/(public)/teachers/[id]/page.tsx` | Taught grades badge link mapping |
| | `T1_F3_04` | Direct contact triggers: one-click WhatsApp, call button, and socials | `src/app/(public)/teachers/[id]/page.tsx` | WhatsApp & `tel:` protocol checks |
| | `T1_F3_05` | Teacher materials/dousies section filtered by `teacherName` | `src/app/(public)/teachers/[id]/page.tsx` | Material association assertions |
| **F4: Homepage** | `T1_F4_01` | Homepage removes static `TeachersSection` import and render | `src/app/(public)/page.tsx` | Negative code assertion |
| | `T1_F4_02` | Homepage removes unneeded `prisma.teacher.findMany` query | `src/app/(public)/page.tsx` | Negative ORM query assertion |
| | `T1_F4_03` | Homepage renders clean `ExploreTeachersCTA` guiding users to `/grades` | `src/app/(public)/page.tsx` | CTA banner presence & links |
| | `T1_F4_04` | Mobile bottom nav tab 3 routes directly to `/grades` | `src/components/MobileBottomNav.tsx` | Bottom nav href evaluation |
| | `T1_F4_05` | Mobile bottom nav active state highlights `/grades` and child routes | `src/components/MobileBottomNav.tsx` | Active pathname matching evaluation |
| **F5: Taxonomy & DB** | `T1_F5_01` | Shared domain engine exports required taxonomy contracts | `src/lib/grades.ts` | Exported helper contracts |
| | `T1_F5_02` | Database baseline: `Teacher` table has 3 seeded teachers with valid `grades` | `prisma/dev.db` | Prisma query & record validation |

---

### Tier 2: Boundary & Corner Cases — 8 Tests

| Test ID | Boundary Condition | Edge Scenario | Verification Logic |
|:--------|:-------------------|:--------------|:-------------------|
| `T2_BC_01` | Invalid Grade Slug | Route requested with unknown slug (e.g., `invalid-slug-xyz`) | Route calls Next.js `notFound()` or returns safe 404 |
| `T2_BC_02` | Non-Existent Teacher ID | Route requested with invalid teacher ID (e.g., `999999`) | Route calls Next.js `notFound()` |
| `T2_BC_03` | Empty Grade Materials | Grade hub when 0 materials are uploaded for that level | Renders polished fallback message (e.g. "لا توجد دوسيات متاحة") |
| `T2_BC_04` | Empty Grade Teachers | Grade hub when no teachers are assigned to that grade | Renders friendly empty state banner |
| `T2_BC_05` | Empty Teacher Dousies | Teacher profile when teacher has 0 uploaded worksheets | Renders friendly empty state banner |
| `T2_BC_06` | Comma/Whitespace Tokenization | Dirty `grades` string: `", عاشر , , أول ثانوي, ثاني ثانوي , "` | Sanitizes to `["عاشر", "أول ثانوي", "ثاني ثانوي"]` with 0 blank chips |
| `T2_BC_07` | Null Optional Contact Fields | Teacher record with `phone: null`, `whatsapp: null`, `bio: null` | Safely handles optional fields without rendering errors |
| `T2_BC_08` | Slug Alias Normalization | Aliases like `tawjihi`, `btec`, `1` | Canonical taxonomy resolves aliases correctly |

---

### Tier 3: Cross-Feature Interactions & Navigation Integrity — 8 Tests

| Test ID | Interaction Pair | Traversal Path | Verification Assertion |
|:--------|:-----------------|:---------------|:-----------------------|
| `T3_XI_01` | Full Bidirectional Flow | `/grades` -> `/grades/tenth-grade` -> `/teachers/1` -> `/grades/first-secondary` -> `/grades/tawjihi` | Dynamic link continuity through all levels |
| `T3_XI_02` | Hub ↔ Profile Consistency | Grade Hub teachers list ↔ Teacher Profile taught grades | Teacher 1 listed in Tenth Grade Hub and profile links back |
| `T3_XI_03` | Multi-Grade Teacher Badges | Teacher 3 (أحمد زياد) with 4 distinct taught grades | 4 badges resolve to 4 distinct hub destinations |
| `T3_XI_04` | Mobile Active Tab Highlighting | `/grades`, `/grades/tenth-grade`, `/grades/tawjihi` vs `/quizzes` | Evaluates `isTabActive` against multiple paths |
| `T3_XI_05` | CTA Button Actions | `ExploreTeachersCTA` primary & secondary triggers | Primary -> `/grades`, Secondary -> `/teachers` |
| `T3_XI_06` | WhatsApp URL Builder | `0796268289` -> `https://wa.me/962796268289` | Standardized Jordanian international dialing prefix |
| `T3_XI_07` | Direct Call Protocol | Direct dial link generation | RFC 3966 `tel:` link format |
| `T3_XI_08` | Header Navigation Integration | Desktop header & mobile drawer links | Prominent entry point to `/grades` |

---

### Tier 4: Real-World Scenarios — 5 Tests

| Test ID | Scenario | Persona & Journey | Key Invariants Tested |
|:--------|:---------|:------------------|:----------------------|
| `T4_SC_01` | Tawjihi Student Workload | Tawjihi student accesses `/grades`, selects Tawjihi, inspects subjects, dousies, and Tawjihi faculty | Tawjihi curriculum, download tracking, faculty list |
| `T4_SC_02` | Parent Curriculum Overview | Elementary parent browses basic stage (الصفوف الأساسية), opens 1st grade, verifies foundational curriculum | Emerald theme, elementary subjects, badge styling |
| `T4_SC_03` | Direct Tutoring Contact | Student discovers Teacher 2 (ليث أبو الشيخ) in 11th grade, opens profile, triggers direct WhatsApp | Teacher subject, active phone number, WhatsApp CTA |
| `T4_SC_04` | App Router Static Generation | Next.js App Router dynamic route parameter validation | `params` object typing & `generateStaticParams` compatibility |
| `T4_SC_05` | Forensic DB Preservation | Regression prevention across all existing database tables | Zero tables dropped, zero columns altered, seed preserved |

---

## 4. Progressive Testability Guide for Milestones

As implementation progresses through each milestone, the test suite acts as an autonomous validator:

```
[Milestone M1] ───> Passes: T1_F1 (1-7), T1_F5 (1-2), T2_BC (06, 08), T4_SC_02
[Milestone M2] ───> Passes: T1_F2 (1-4), T2_BC (01, 03, 04)
[Milestone M3] ───> Passes: T1_F3 (1-5), T2_BC (02, 05, 07), T3_XI (02, 03, 07), T4_SC_03
[Milestone M4] ───> Passes: T1_F4 (1-5), T3_XI (01, 04, 05, 08)
[Milestone M5] ───> 100% Pass across all 44 tests (0 failures, exit code 0)
```

---

## 5. Troubleshooting & Invariant Diagnostics

1. **SQLite Database Locked or Not Found**:
   - Verify that `prisma/dev.db` exists.
   - The test harness explicitly opens and disconnects from `file:prisma/dev.db` via `prisma.$disconnect()`, preventing connection leaks.
2. **Next.js Compilation Cache**:
   - If stale Next.js cache causes issues during `npm run build`, execute:
     ```powershell
     Remove-Item -Recurse -Force .next
     ```
3. **Module Resolution in Node.js**:
   - Running with `node --experimental-strip-types tests/e2e-grades-teachers.ts` natively strips TypeScript types in Node 24 without compiling to disk.
   - Ensure imports from standard packages and relative file paths are accurately typed.
