---
phase: 10-pwa-mobile-polish
plan: 01
subsystem: ui
tags: [pwa, manifest, service-worker, offline, install-prompt, apple-meta]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: PWA shell with @serwist/next service worker, manifest.json, icons
provides:
  - Enhanced PWA manifest with split icon purposes and /dashboard start_url
  - Apple PWA meta tags for iOS installability
  - Custom install prompt (Chrome + iOS fallback)
  - Offline connectivity indicator banner
affects: [10-pwa-mobile-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [beforeinstallprompt API, navigator.onLine detection, iOS PWA detection via userAgent]

key-files:
  created:
    - src/components/pwa/install-prompt.tsx
    - src/components/pwa/offline-indicator.tsx
  modified:
    - public/manifest.json
    - src/app/layout.tsx
    - src/app/(student)/layout.tsx
    - src/app/globals.css

key-decisions:
  - "Split icon entries (any/maskable separate) for broader PWA install compatibility"
  - "start_url set to /dashboard since authenticated users should land there"
  - "Install prompt shown only in student layout (authenticated pages), offline indicator in root layout (all pages)"
  - "iOS detection via userAgent with manual install instructions (Share > Add to Home Screen)"
  - "Install prompt dismissible via localStorage key, not shown when already in standalone mode"

patterns-established:
  - "PWA components in src/components/pwa/ directory"
  - "Safe area CSS utility .pb-safe for notched device padding"

requirements-completed: [PWA-01]

# Metrics
duration: 8min
completed: 2026-03-03
---

# Plan 10-01: PWA Install Experience & Offline Indicator Summary

**Enhanced PWA manifest with split icon purposes, Apple meta tags for iOS, custom install prompt with Chrome/iOS detection, and offline connectivity indicator**

## Performance

- **Duration:** 8 min
- **Completed:** 2026-03-03
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Enhanced manifest.json with 4 split icon entries (any/maskable separate), start_url /dashboard, and stable id
- Added Apple PWA meta tags (apple-mobile-web-app-capable, status bar style, touch icon) via Next.js Metadata API
- Created install prompt component handling Chrome (beforeinstallprompt API) and iOS (userAgent detection with manual instructions)
- Created offline indicator component using navigator.onLine + online/offline event listeners
- Added .pb-safe CSS utility for safe area inset padding on notched devices

## Task Commits

Each task was committed atomically:

1. **Task 1 + Task 2: PWA install experience and offline indicator** - `92492ec` (feat)

Note: Both tasks were committed together as they form a cohesive unit.

## Files Created/Modified
- `public/manifest.json` - Enhanced with 4 icon entries (split any/maskable), start_url /dashboard, id field
- `src/app/layout.tsx` - Apple PWA meta tags, OfflineIndicator import and render
- `src/components/pwa/install-prompt.tsx` - Custom install prompt with Chrome beforeinstallprompt + iOS fallback
- `src/components/pwa/offline-indicator.tsx` - Yellow offline banner with WifiOff icon, navigator.onLine detection
- `src/app/(student)/layout.tsx` - Added PwaInstallPrompt component
- `src/app/globals.css` - Added .pb-safe utility class

## Decisions Made
- Split icon entries (any vs maskable) rather than combined "any maskable" for better compatibility across Android OEMs
- Install prompt placed in student layout only (not root) since unauthenticated users shouldn't be prompted
- Offline indicator placed in root layout so it appears everywhere including marketing and auth pages
- Used localStorage for install prompt dismissal (simple, no server round-trip needed)

## Deviations from Plan
None - plan executed as specified.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PWA installability foundation complete, mobile tab bar and responsive polish can proceed (Plan 10-02)

---
*Phase: 10-pwa-mobile-polish*
*Completed: 2026-03-03*
