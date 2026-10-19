---
version: 1
slug: "frontend-src-pages-about-jsx"
primary_target: "frontend/src/pages/About.jsx"
related_targets: ["frontend/src/index.css"]
---

# About page (frontend/src/pages/About.jsx)

## Scope
Public front door (`/` redirects here). Mode: Persuade. Visitor: a high school or college student, often with no job-search experience. Job: understand what ScoutSearch is and sign up. Proof: clearly labeled example listings only (no real listings, numbers, or reviews exist). Constraints: WCAG 2.2 AA; plain CSS in index.css with page-prefixed classes and heavy comments; keep existing copy, section ids, tab title, Oasis credit; it is free, under-18s can join, and user information is kept safe (team-confirmed 2026-10-18).

## Direction contract
THESIS: Show the search, not a pitch. The first viewport is a working example job search; it refuses the centered headline over a row of feature cards.
OWN-WORLD: Trail-and-road wayfinding in light blue (recolored 2026-10-18 at the user's request). Gentle light blue #d7e9fb ground, #c6def7 panels, navy #10325a type, off-white #f0f7ff listing cards in the light app's style, sky blue #74b6ea (navy text) only on actions; faint slow Waves background. Overpass display (highway-sign lettering), Atkinson Hyperlegible Next body, a diamond trail-blaze mark.
STORY: Visitor sees listings they could get, clicks tabs to see internships, co-ops, and research, reads why each matched them, then signs up.
FIRST VIEWPORT: Left column: h1 in Overpass at about 60px, subtitle, bright blue Sign up, credit. Right column: example-search window with three tabs and two white listing cards, the first showing "Why it matched" reasons. Sticky light bar with diamond mark, section links, Log in, bright blue Sign up.
FORM: User-pinned direction from the PhishAware reference (dark product landing with a live demo), translated to ScoutSearch's light blue scheme; no concept-seed roll, so there is no seed key.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment
Clicking the Internships / Co-ops / Research tabs swaps the example listings and their match reasons.

## Unresolved
Contact email for the footer. Real listings will replace the examples later.
