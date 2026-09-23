# Original User Request

## 2026-09-15T21:10:37Z

A complete transformation of the Qadoumi educational platform into a highly interactive, animated, and modern full-stack ed-tech system. It must visually surpass top-tier competitors with organic shapes and micro-interactions, and introduce gamification (points), student accounts, and interactive tests. Use a very large team of agents.

Working directory: m:\Qadoumi
Integrity mode: development

## Requirements

### R1. Breathtaking Modern UI & Animations
Redesign the frontend to be playful, dynamic, and visually stunning. Discard rigid corporate layouts. Implement organic background blobs, floating elements, complex SVG dividers, and fluid scroll animations. You may install and use animation libraries like Framer Motion or modern UI component libraries to achieve an irresistible aesthetic.

### R2. Gamification and Student Accounts
Implement a functional backend and frontend for student accounts. Update the Prisma SQLite schema to track students, their enrolled grades, and a points/rewards balance. Create an immersive student dashboard where they can see their accumulated points.

### R3. Interactive Quizzes Engine
Build an interactive testing feature. Students should be able to take a multiple-choice quiz, see instant results with engaging visual feedback, and have their score converted into gamification points in the database.

## Acceptance Criteria

### Design Implementation
- [ ] The codebase contains explicit usage of advanced CSS animations, Framer Motion (or equivalent), and organic SVG structures (blobs/waves), verifiable by scanning the source files.
- [ ] The layout departs completely from simple CSS grids of squares, utilizing overlapping elements and dynamic positioning.

### Database & Backend
- [ ] `npx prisma validate` runs successfully with the new user, points, and quiz models.
- [ ] The database migration can be applied without dropping the existing `centerInfo` and `teacher` tables.

### Feature Functionality
- [ ] An agent-driven test verifies that submitting a quiz successfully updates the student's point balance in the database.

## 2026-09-16T09:57:44Z

Resume and finalize the Qadoumi educational platform transformation based on the handoff document. The backend, APIs, and primary UI are already built. This phase focuses entirely on building the frontend Student Dashboard, the Interactive Quiz Runner UI with gamification, and finalizing the E2E test suite. Use a full team of agents.

Working directory: m:\Qadoumi
Integrity mode: development

## Requirements

### R1. Student Dashboard Frontend
Build the React/Next.js frontend for the student dashboard. It must securely fetch the student's data using the existing APIs and beautifully display their gamification points, level, and enrolled courses using modern animated UI components.

### R2. Interactive Quiz Runner UI
Build the frontend quiz-taking experience. It must fetch quiz data, present multiple-choice questions interactively, submit answers to the existing submission API, and display celebratory, gamified visual feedback (e.g., confetti, animations) when points are awarded.

### R3. E2E Autonomous Testing
Implement and execute the final E2E test scripts to verify the complete student lifecycle: from taking a quiz to having their points balance updated correctly in the dashboard.

## Acceptance Criteria

### Frontend Implementation
- [ ] The Student Dashboard correctly renders the user's point balance from the database without errors.
- [ ] The Quiz Runner UI contains visual feedback animations (using Framer Motion, CSS, or canvas-confetti) upon quiz completion.

### Verification
- [ ] A programmatic E2E test runs successfully, verifying that a user can submit a quiz and their dashboard reflects the newly added points.

## 2026-09-16T10:45:31Z

Fix the visual design of the Qadoumi educational platform homepage at m:\Qadoumi. The current design looks AI-generated and cluttered. It must be redesigned to match the exact visual patterns of Jo Academy (joacademy.com) — a clean, spacious, educational layout that feels human-designed and professional.

Working directory: m:\Qadoumi
Integrity mode: development

Reference screenshots from Jo Academy are available at:
- C:/Users/hakar/.gemini/antigravity/brain/694a08c2-0e24-4f8f-8432-5ed92ccf8435/.user_uploaded/media_1789555291303.png (Jo Academy mobile - programs carousel)
- C:/Users/hakar/.gemini/antigravity/brain/694a08c2-0e24-4f8f-8432-5ed92ccf8435/.user_uploaded/media_1789555300138.png (Jo Academy mobile - programs swiping)
- C:/Users/hakar/.gemini/antigravity/brain/694a08c2-0e24-4f8f-8432-5ed92ccf8435/.user_uploaded/media_1789555307551.png (Jo Academy mobile - hero and bottom nav)

Current site screenshot showing the problem:
- C:/Users/hakar/.gemini/antigravity/brain/694a08c2-0e24-4f8f-8432-5ed92ccf8435/.user_uploaded/media_1789555229836.png

## Requirements

### R1. Programs Section — Horizontal Swipeable Carousel
The programs/categories section currently uses a static grid of small dark squares with plain line icons. This must be completely replaced with:
- Large square cards (roughly 150-180px each) with rich colorful gradient backgrounds (blues, cyans, greens).
- Each card must contain a visually rich illustrated icon or SVG illustration — NOT simple Lucide line icons. Use colorful multi-element SVG illustrations that depict books, graduation caps, school buildings, etc. with multiple colors and depth.
- On DESKTOP: cards display in a full-width row.
- On MOBILE: cards display in a horizontally scrollable carousel (CSS overflow-x: auto with scroll-snap-type: x mandatory). The user must be able to swipe left/right to see all program cards. Cards should peek from the edges to indicate scrollability.
- The section header should use a styled badge/pill label like "المسارات والبرامج الأكاديمية" with a decorative icon.

### R2. Clean Spacious Layout — Remove Clutter
The entire homepage feels cramped and "AI-generated." Fix this by:
- Adding generous vertical padding between ALL sections (at minimum py-20 on mobile, py-28 on desktop).
- Reducing the amount of content visible at once — let each section breathe.
- Using clean white or very light gray backgrounds with subtle section transitions.
- Removing any dark heavy blocks that make the page feel corporate.
- Section headers should be simple, centered, with a small accent badge above and clean typography below — matching Jo Academy's pattern of a colored title with a 1-2 line description underneath.

### R3. Hero Section Polish
The hero section needs to feel more organic and less like a dark rectangle:
- Keep the navy/dark gradient background but add subtle floating decorative elements (small Arabic letter shapes, dots, sparkles) that gently animate — like Jo Academy's floating م ج ع letters.
- The CTA buttons should be full-width rounded pills on mobile, stacked vertically with clear hierarchy.
- Add a subtle announcement banner at the top (like Jo Academy's "جديد منصة القدومي: امتحانات تفاعلية ونقاط فورية") as a scrolling/marquee strip.

### R4. Bottom Navigation Bar Polish
The current bottom nav works but needs visual refinement:
- Match Jo Academy's style: clean white bar, the active tab should have a prominent raised/highlighted state.
- Add an "امتحانات" (Quizzes) tab with a sparkle/star icon.
- The FAB call button should be visually distinct (dark circle on the left side).

## Acceptance Criteria

### Visual Fidelity
- [ ] The programs section renders as a horizontally scrollable carousel on viewports under 768px wide, verified by checking that the container has overflow-x: auto or overflow-x: scroll CSS and contains more cards than fit in one viewport width.
- [ ] Program cards contain multi-color SVG illustrations (not single-color Lucide icons), verified by scanning the component source for inline SVG paths with multiple fill colors or imported illustration components.
- [ ] Every homepage section has at least 80px of vertical padding, verified by inspecting the rendered section elements.

### Build Integrity
- [ ] npm run build completes successfully with 0 TypeScript errors.
- [ ] All existing API routes and database tables remain functional and unchanged.

## 2026-09-17T11:45:46Z

A complete architectural and visual expansion of the Qadoumi educational platform introducing a dedicated School Grades Portal (`/grades`), dynamic grade-specific hubs (`/grades/[slug]`) with categorized subjects, dousies, and teachers, and individual teacher profile pages (`/teachers/[id]`) displaying all taught grades. The homepage is decluttered by removing the static teachers section, and the visual design of the grades directory is elevated far beyond standard competitor designs. Use a full team of agents.

Working directory: m:\Qadoumi
Integrity mode: development

## Requirements

### R1. The School Grades Directory (`/grades`)
- Build a dedicated, visually stunning page at `/grades` (linked from the header and bottom nav "المدرسة").
- Design grade cards for all levels:
  - الصفوف الأساسية (الأول، الثاني، الثالث، الرابع)
  - الصفوف العليا (الخامس، السادس، السابع، الثامن، التاسع، العاشر)
  - المرحلة الثانوية (الأول ثانوي، التوجيهي الأكاديمي، التوجيهي المهني BTEC)
- Elevate the visual design far above simple blue number squares (as seen in competitor screenshots) by utilizing:
  - Vibrant, distinct gradient color schemes for each stage
  - Arabic typography with stylized grade numerals
  - Subtle floating micro-animations, hover lifts, and clean educational badge indicators
  - Full mobile responsiveness with comfortable touch targets

### R2. Dynamic Grade Hub Pages (`/grades/[grade]`)
- Create dynamic routing for each grade (e.g. `/grades/tawjihi`, `/grades/first-grade`, etc.).
- Each grade page must feature a modern tabbed or segmented view displaying:
  1. **المواد الدراسية (Subjects):** Comprehensive list of subjects taught for this grade.
  2. **الدوسيات وأوراق العمل (Materials/Dousies):** Filtered dynamically from the database (`Material` model) where `grade` matches this school level, with direct download links.
  3. **كادر المعلمين (Grade Teachers):** Filtered from the `Teacher` model where the teacher's `grades` contains this grade.

### R3. Dedicated Teacher Profile Pages (`/teachers/[id]`)
- Clicking any teacher's card, image, or name on any page navigates to their dedicated profile at `/teachers/[id]`.
- The teacher profile page must display:
  - Full teacher identity: name, subject, high-res image, and rich bio
  - **قائمة الصفوف التي يدرسها (All Taught Grades):** Visual badges/cards for every grade taught by this teacher (parsed from their comma-separated `grades` field), where each badge links back to the respective grade hub
  - **وسائل التواصل المباشرة:** One-click WhatsApp button, direct phone call button, and social media links
  - **دوسيات الأستاذ:** List of materials/dousies uploaded under this teacher's name with download buttons

### R4. Homepage Decluttering & Bottom Navigation Routing
- Completely remove the static teachers section from the homepage (`page.tsx`) to keep it clean, focused, and fast, replacing it with a clean call-to-action banner guiding students to explore teachers inside their respective grades.
- Update the mobile bottom navigation bar (`MobileBottomNav.tsx`) so that the "المدرسة" / "المواد" tab points directly to `/grades`.

## Acceptance Criteria

### Navigation & Routing
- [ ] Navigating to `/grades` renders the full school grades directory with category groupings.
- [ ] Clicking any grade opens its dedicated `/grades/[slug]` page showing its filtered subjects, materials, and assigned teachers.
- [ ] Clicking any teacher opens `/teachers/[id]`, displaying all the grades they teach and their direct contact options.
- [ ] The homepage (`/`) no longer renders the heavy teachers section and loads cleanly.
- [ ] The mobile bottom navigation correctly routes to `/grades`.

### Quality & Performance
- [ ] `npx tsc --noEmit` passes with 0 TypeScript errors.
- [ ] `npm run build` compiles all static and dynamic routes cleanly.
- [ ] Visual design across mobile and desktop is polished, spacious, and responsive.

### Autonomous E2E Verification
- [ ] An automated E2E test script (`tests/e2e-grades-teachers.ts`) passes, verifying the complete flow: `/grades` -> `/grades/[slug]` -> `/teachers/[id]` and data consistency.

## 2026-09-23T14:57:11Z

Please execute the Teamwork Preview plan for the Qadoumi Next.js project based on the constraints defined in `prompt_draft.md`.

Requirements:
- R1: Conduct a comprehensive UI and Contrast audit across all pages and components. Fix visual inconsistencies, particularly white text on light backgrounds or missing text contrasts (e.g. text-white on light cards).
- R2: Audit all gamification and points mechanisms to ensure there are no loopholes allowing points farming. Ensure all patched loopholes are securely deployed.
- R3: Ensure recent changes (Jordanian phone format starting with 07 and 10 digits, `gender` field for students, and removal of AI `Sparkles` watermarks) are consistently applied across ANY remaining forms or pages in the project.
- R4: Use any methodology (Static Analysis, etc.) you see fit. Once you fix these issues, automatically commit and push the changes to the `main` branch on GitHub without asking for permission.

Working Directory: m:\Qadoumi
Please begin the comprehensive sweep.

## 2026-09-23T19:06:36Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Delegate to teamwork_preview
> Requested team: [none — teamwork routes from the description]

Remediate critical gamification security vulnerabilities (race conditions, IDOR, unauthenticated endpoints), patch authorization data leaks, and finalize UI contrast fixes in the Qadoumi Next.js project based on the previous audit findings.

Working directory: m:\Qadoumi
Integrity mode: development

## Requirements

### R1. Gamification & Points Security
Patch all identified vulnerabilities in the gamification system. Specifically:
- Secure the `PUT /api/students/[id]` endpoint against unauthorized or arbitrary points modification.
- Implement robust concurrency control (locking/transactions) for quiz submissions to prevent race conditions that multiply points.
- Resolve the reward redemption IDOR (preventing users from redeeming rewards for others) and fix the reward double-spend concurrency bug.

### R2. Authorization & Data Leaks
Secure all API endpoints and server actions related to student lists and dashboards. Ensure strict isolation so a student can only access and modify their own data, and cannot list, view, or delete other students.

### R3. UI Contrast Polish
Finalize the UI/Contrast sweep across all remaining pages. Identify and fix any lingering visual issues, specifically unreadable text (e.g., white text on light backgrounds).

## Acceptance Criteria

### Security & Logic
- [ ] The `PUT /api/students/[id]` endpoint successfully rejects unauthorized modification attempts.
- [ ] Reward redemption endpoints strictly validate that the authenticated user matches the target student ID.
- [ ] Student data endpoints enforce strict authorization, preventing IDOR and unauthorized data access.

### Verification (Agent-as-Judge)
- [ ] A dedicated review agent has performed rigorous static code analysis on the patched endpoints and officially certified that the race conditions, double-spending, and authorization bypasses are fully mitigated.

### UI Consistency
- [ ] All pages render with sufficient text contrast in both light and dark contexts.

## 2026-09-23T19:33:43Z

USER DIRECTIVE: The user is running low on token quota and has requested that we speed up the process and reduce token usage. Please finalize the Phase 3 verification (Agent-as-Judge/Adversarial challenge) immediately. Do not over-iterate or perform excessive deep checks. If the core security patches (race conditions, IDOR, auth leaks) are working, declare victory, commit, push the code to GitHub immediately, and terminate.