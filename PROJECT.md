# Project: Qadoumi Educational Platform Expansion

## Architecture
- **Framework**: Next.js 14.2.5 (App Router, `src/app/(public)` route group), React 18, TypeScript 5.
- **Database**: SQLite with Prisma ORM (`prisma/schema.prisma`), models: `Teacher`, `Material`, `Student`, `Quiz`, `CenterInfo`.
- **Styling & Interaction**: Tailwind CSS 3.4.1, Framer Motion 11, Lucide React, clsx, tailwind-merge.
- **Core Domain Engine**: `src/lib/grades.ts` (13-grade canonical taxonomy across 3 stages, stage gradients, Eastern numerals, alias resolvers, subject curricula, token matchers).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Canonical Grades Taxonomy & Engine | Shared configuration in `src/lib/grades.ts` with 13 grades across 3 stages (الصفوف الأساسية, الصفوف العليا, المرحلة الثانوية), stage themes, Arabic typography & numerals, token matchers | M1 | ORIGINAL_REQUEST R1, R2 |
| 2 | Sample Materials Seeding | Seed materials for existing teachers across Tawjihi, 11th, and 10th grades to ensure rich dynamic content and download tracking | M1 | Explorer Survey 1 & 2 |
| 3 | School Grades Directory Page (`/grades`) | Dedicated page with 3 stage category sections, vibrant gradients, stylized Eastern numerals (١ to ١٢ and BTEC), hover lifts, micro-animations, search/filter | M1 | ORIGINAL_REQUEST R1 |
| 4 | Dynamic Grade Hub Route (`/grades/[slug]`) | Dynamic routing for each grade supporting canonical slugs, aliases, and numerals | M2 | ORIGINAL_REQUEST R2 |
| 5 | Grade Hub Subjects Tab (المواد الدراسية) | Comprehensive list of subjects taught for each grade with descriptions and branch badges | M2 | ORIGINAL_REQUEST R2 |
| 6 | Grade Hub Materials Tab (الدوسيات وأوراق العمل) | Dynamically filtered from `Material` model matching the grade, with download tracking and direct Google Drive links | M2 | ORIGINAL_REQUEST R2 |
| 7 | Grade Hub Teachers Tab (كادر المعلمين) | Filtered from `Teacher` model matching this grade, cards linking directly to `/teachers/[id]` | M2 | ORIGINAL_REQUEST R2 |
| 8 | Dedicated Teacher Profile Page (`/teachers/[id]`) | SSR page with teacher identity, high-res photo, subject badge, and rich bio | M3 | ORIGINAL_REQUEST R3 |
| 9 | Teacher Taught Grades Badges (قائمة الصفوف) | Visual badges for every taught grade parsed from comma-separated `grades`, linking back to `/grades/[slug]` | M3 | ORIGINAL_REQUEST R3 |
| 10 | Direct Contact Buttons | One-click WhatsApp button (`whatsappLink`), direct phone call button (`tel:`), social media links | M3 | ORIGINAL_REQUEST R3 |
| 11 | Teacher Dousies Section (دوسيات الأستاذ) | Materials uploaded under teacher's name with download buttons and tracking | M3 | ORIGINAL_REQUEST R3 |
| 12 | Homepage Decluttering | Remove static `TeachersSection` and heavy `prisma.teacher.findMany` query from `page.tsx` | M4 | ORIGINAL_REQUEST R4 |
| 13 | Homepage Explore Teachers CTA Banner | Clean CTA banner with >=80px padding guiding students to explore teachers inside grades | M4 | ORIGINAL_REQUEST R4 |
| 14 | Mobile Bottom Navigation Routing | Update `MobileBottomNav.tsx` tab 3 to point directly to `/grades` ("المدرسة") with active state highlighting | M4 | ORIGINAL_REQUEST R4 |
| 15 | Header & Teachers Page Navigation | Update Header drawer to `/grades` and link cards in `/teachers/page.tsx` to `/teachers/[id]` | M4 | ORIGINAL_REQUEST R1, R3, R4 |
| 16 | Autonomous E2E Test Suite (`tests/e2e-grades-teachers.ts`) | Comprehensive 4-tier autonomous test suite verifying `/grades` -> `/grades/[slug]` -> `/teachers/[id]` navigation, decluttering, mobile nav, and DB consistency | Test Track / M5 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Design test runner and test cases Tiers 1-4 in `tests/e2e-grades-teachers.ts`, publish `TEST_READY.md` | none | PLANNED |
| M1 | Grades Engine & Directory (`/grades`) | `src/lib/grades.ts`, sample seed materials, `src/app/(public)/grades/page.tsx` | none | PLANNED |
| M2 | Dynamic Grade Hubs (`/grades/[slug]`) | `src/app/(public)/grades/[slug]/page.tsx` with Subjects, Materials, Teachers tabs | M1 | PLANNED |
| M3 | Teacher Profile Pages (`/teachers/[id]`) | `src/app/(public)/teachers/[id]/page.tsx`, taught grades badges, contact CTAs, dousies | M1 | PLANNED |
| M4 | Homepage Declutter & Nav Routing | `page.tsx` CTA banner, `MobileBottomNav.tsx`, `Header.tsx`, `/teachers` links | M1 | PLANNED |
| M5 | Final Milestone: 100% E2E Pass & Audit | Execute `tests/e2e-grades-teachers.ts`, typecheck, build, adversarial check, and forensic audit | E2E, M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `src/lib/grades.ts` ↔ Pages (`/grades`, `/grades/[slug]`, `/teachers/[id]`)
- `getGradeBySlug(slug: string): GradeConfig | null`
- `getAllGradeSlugs(): string[]`
- `getGradesByStage(stage: StageId): GradeConfig[]`
- `isTeacherInGrade(teacherGrades: string, gradeSlug: string): boolean`
- `isMaterialInGrade(materialGrade: string, gradeSlug: string): boolean`
- `parseTaughtGrades(gradesStr: string): Array<{ name: string; slug: string; stage: StageId; stageName: string }>`

### Code Layout
- `src/lib/grades.ts`: Canonical grade definitions, helper functions.
- `src/app/(public)/grades/page.tsx`: Grades directory page.
- `src/app/(public)/grades/[slug]/page.tsx`: Dynamic grade hub page with segmented tabs.
- `src/app/(public)/teachers/[id]/page.tsx`: Dedicated teacher profile page.
- `src/components/home/ExploreTeachersCTA.tsx`: Homepage CTA banner component.
- `src/components/MobileBottomNav.tsx`: Bottom navigation bar with tab 3 pointing to `/grades`.
- `src/components/Header.tsx`: Header navigation links.
- `src/app/(public)/page.tsx`: Homepage without static teachers section.
- `src/app/(public)/teachers/page.tsx`: Teacher catalog linking to individual profiles.
- `tests/e2e-grades-teachers.ts`: E2E autonomous test suite.
