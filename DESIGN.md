---
name: ScoutSearch
description: A job board for high school and college students, in clear light blues (real blues, no grays) kept a step dimmer than full brightness, with navy type, blue-white cards, and one sky-blue accent saved for actions.
colors:
  about-bg: "#d7e9fb"
  about-panel: "#c6def7"
  about-edge: "#b3d0ee"
  about-ink: "#10325a"
  about-ink-2: "#1f4a7d"
  about-ink-3: "#355f8f"
  accent: "#74b6ea"
  accent-hover: "#5ea8e3"
  accent-text: "#10325a"
  accent-soft: "#cde4fa"
  bg: "#d7e9fb"
  card: "#f0f7ff"
  on-blue: "#ffffff"
  text: "#10325a"
  muted: "#1f4a7d"
  primary: "#2a74ba"
  primary-dark: "#1d5a94"
  subtle: "#355f8f"
  border: "#5b86b8"
  line: "#b3d0ee"
  soft: "#e2effd"
typography:
  display:
    fontFamily: "Overpass, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.4vw, 68px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Overpass, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.4vw, 42px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Overpass, Segoe UI, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.25
  small:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  app-body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  blaze: "2px"
  form: "4px"
  sm: "8px"
  star-ring: "11px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  gutter: "56px"
  band-sm: "72px"
  band: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-text}"
  button-primary-big:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  star-border-ring:
    rounded: "{rounded.star-ring}"
    padding: "3px"
  button-navy:
    backgroundColor: "{colors.about-ink}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-navy-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.on-blue}"
  link-quiet:
    textColor: "{colors.about-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  link-quiet-hover:
    backgroundColor: "{colors.about-panel}"
  tab-tray:
    backgroundColor: "{colors.card}"
    rounded: "10px"
    padding: "4px"
  tab:
    textColor: "{colors.about-ink-2}"
    typography: "{typography.label}"
    rounded: "7px"
    padding: "10px 8px"
  tab-hover:
    backgroundColor: "{colors.about-panel}"
    textColor: "{colors.about-ink}"
  tab-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-text}"
    rounded: "7px"
  background-pause:
    backgroundColor: "{colors.card}"
    textColor: "{colors.about-ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  background-pause-hover:
    backgroundColor: "{colors.soft}"
  panel:
    backgroundColor: "{colors.about-panel}"
    textColor: "{colors.about-ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
  listing-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "18px"
  match-reason:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.text}"
    rounded: "14px"
    padding: "4px 12px"
  app-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "20px"
  app-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  app-button-hover:
    backgroundColor: "{colors.primary-dark}"
  app-button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  app-button-outline-hover:
    backgroundColor: "{colors.soft}"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    padding: "8px 12px"
---

# Design System: ScoutSearch

## Overview

**Creative North Star: "The Daylight Trailhead"**

ScoutSearch is one calm, professional world in a single clear light-blue family. Secondary text, lines, and borders are real blues rather than grays, so the page feels fresh instead of dull, and everything is kept a step dimmer than full brightness for eye comfort: no surface is pure white, the brightest thing on any screen is a blue-white card, and the blues stay clear rather than electric. The public About page (the front door, `/` redirects to it) is a trailhead in clear daylight: a light blue ground stirred by very faint flowing lines, slightly deeper blue panels, navy type, highway-sign headlines, and sky-blue trail marks with navy words that show where to go next. Behind it, the signed-in app (Feed, Profile, Network, Login, Signup) is the same light blue page with blue-white boxes edged in thin light blue lines, navy text, and a steadier app blue on its buttons. The About page persuades; the app pages operate. Both share one palette and one rule about the sky-blue accent.

The About page shows the product instead of describing it. Its first screen pairs a big headline with a working example job search: tabs that swap clearly labeled made-up listings, rendered as the same blue-white cards a student would see after signing up. Wayfinding is the material: Overpass (lettering drawn from US highway signs), a rotated-square "trail blaze" mark, and a trail line with blue diamonds threading the How it works steps. A small set of React Bits effects adds life: thin vertical lines that sway slowly behind the whole page and bend away from the mouse, a shine that sweeps the subtitle twice, star lights that circle the big Sign up button, a soft spotlight on the audience boxes, sections that rise into view, and sparks on click. Density is calm: 96px between sections, 18px body text, line lengths capped at 48 to 60 characters.

The build is accessibility-first and teaching-first. Every contrast pair is measured and written next to the rule that uses it. All motion sits behind `prefers-reduced-motion: no-preference`; anything that starts by itself either stops within 5 seconds or has a visible Pause control; anything color alone carries has a forced-colors fallback. Every style is plain CSS in `frontend/src/index.css`, commented in plain language for the student team.

**Key Characteristics:**
- One clear light-blue family across every page, a step dimmer than full brightness: light blue ground, deeper blue panels, blue-white cards, navy text, real blues (no grays) for secondary text and lines, with a single sky-blue accent.
- No pure white surfaces; white appears only as words and rings on solid blue or navy fills.
- Sky blue marks actions and always carries navy words: Sign up, the selected tab, the skip link, text selection, and the closing band.
- Harbor Blue draws every keyboard focus ring on About; navy takes over on the sky-blue band.
- Highway-sign display type over a low-vision-friendly body face (About only).
- Depth from tonal layers (light blue page, deeper panel, blue-white card), one soft navy shadow on the demo window and a small one on the fixed Pause control.
- Purposeful motion: short effects stop on their own; the one endless effect, the slow background waves, has a Pause button and stays still on phones and for reduced motion.
- Plain CSS, page-prefixed plain-English class names, every rule commented.

## Colors

A clear light-blue family from navy to a blue-white, with real blues rather than grays in every secondary role, held a step below full brightness so long reading sessions stay easy on the eyes, with one sky blue that only ever points at something you can do and never carries text of its own.

### Primary
- **Trail Sky** (accent): the one accent. It fills the Sign up buttons in the bar and on the first screen, the selected example tab, the skip link, text selection, and the closing band, and colors the logo's blaze. It is light, so it is a fill only: navy words on it are 5.9:1, white words would be 2.2:1, and as text or a stroke it nearly vanishes on the page (1.8:1) and on cards (2:1).
- **Deeper Sky** (accent-hover): hover state of sky-blue buttons (navy text on it, 5:1).
- **Navy on Sky** (accent-text): the only text color allowed on the accent (5.9:1); the same navy as the ink.
- **Trail Mark Wash** (accent-soft): the light blue behind "Why it matched" reasons on cards (navy text on it, 9.9:1).

### Secondary
- **App Blue** (primary): the steadier blue of the signed-in app as a fill and a line: filled pill buttons, outline-button strokes, Login/Signup title box and form button, initial avatars, company-initial squares, the 2px app focus ring, and the About click sparks. White text on it is 4.9:1. As text it passes only on Card Mist (4.5:1, the outline-button words and blue links in app cards); on the page (3.9:1), panels (3.5:1), and Soft Blue (4.2:1) it fails.
- **Harbor Blue** (primary-dark): hover for App Blue buttons and the navy band button (white on it, 7.1:1), profile and feed banners, colored link text (6.6:1 on cards), the band that sweeps through the shiny subtitle (5.8:1 on the page), and the 3px keyboard focus ring everywhere on About (5.8:1 on the page, 5.2:1 on panels, 6.6:1 on cards).

### Neutral: the About page
- **Trailhead Sky** (about-bg): the About page ground and the sticky top bar. Also painted on `body` and as the scrollbar track while the About page is open, with `color-scheme: light`, so overscroll and browser chrome match.
- **Deeper Sky Panel** (about-panel): raised boxes on the page (the demo window, audience boxes, feature icon squares), the hover box behind nav links, tabs, and Log in.
- **Sky Edge** (about-edge): 1px hairlines between sections, under the bar, around the demo window and the Pause pill, under each feature, the 3px trail line over the steps, and the scrollbar thumb.
- **Navy Ink** (about-ink): headings and primary text (10.4:1 on the page, 9.3:1 on panels, 12:1 on cards); the fill of the closing-band button (white on it, 12.9:1); the star-border lights; the focus ring on the sky-blue band (5.9:1).
- **Lake Blue Ink** (about-ink-2): a true mid-navy blue for paragraphs, nav links, unselected tabs (7.3:1 on the page, 6.5:1 on panels, 8.3:1 on the blue-white tab tray); the resting color of the shine text.
- **Haze Blue** (about-ink-3): a softer clear blue for quiet small text, the credit line, step numbers, and the step diamonds (5.3:1 on the page, 4.8:1 on panels).

### Neutral: the app pages (and the listing cards inside About)
- **Sky Page** (bg): the light blue page behind app pages (same value as Trailhead Sky).
- **Card Mist** (card): the clean blue-white of every box: app cards, form boxes, the About listing cards, the tab tray, outline buttons, the Feed bar, and the Pause pill. It replaces pure white everywhere a surface is painted.
- **White on Blue** (on-blue): pure white, only for words, initials, and avatar rings on solid App Blue (4.9:1), Harbor Blue (7.1:1), or navy (12.9:1) fills.
- **Navy Text** (text): headings and main text on cards (12:1).
- **Lake Blue** (muted): paragraph text (8.3:1 on cards, 7.3:1 on the page), quiet action rows and nav links in the app.
- **Quiet Blue** (subtle): small secondary text: dates, counts, facts rows (6.1:1 on cards, 5.3:1 on the page). Same value as Haze Blue.
- **Field Blue** (border): input borders and soft link underlines (3.5:1 on cards, 3.05:1 on the page; non-text only).
- **Hairline Blue** (line): 1px lines around cards and dividers inside them (same value as Sky Edge).
- **Soft Blue** (soft): hover fill for outline buttons, action rows, and the Pause pill; resting fill for placeholder squares and tags.

### Named Rules
**The Blue Means Go Rule.** Sky blue (accent) is reserved for actions and the state of an action: Sign up, the selected tab, the skip link, text selection, the closing band, and the light wash behind match reasons. Its only decorative use is the blaze in the logo, which sits inside a link. Sparks are App Blue, the shine band is Harbor Blue, and trail diamonds and step numbers are Haze Blue, never accent.

**The Sky Is Never Ink Rule.** Trail Sky is a fill, never text, an icon stroke, or a focus ring: it is too faint on the page (1.8:1) and on cards (2:1). Words on it are always navy (5.9:1), never white (2.2:1). When sky blue would disappear against itself, as on the closing band, the button turns navy instead.

**The Harbor Ring Rule.** Every keyboard focus ring on About is a 3px Harbor Blue outline at 3px offset, on the page, on panels, and on cards; on the sky-blue band it switches to Navy Ink. App pages keep their 2px App Blue ring.

**The Dimmed Daylight Rule.** Nothing is painted pure white. Every box, card, tray, and pill uses Card Mist, which is the brightest surface in the system; white is kept for words and rings on solid blue or navy fills. New colors join a step below full brightness; secondary roles use clear blues, never grays, and blues stay clear rather than electric.

**The Measured Pair Rule.** Every text color is used only on grounds where its measured contrast passes 4.5:1, and the ratio is written in the CSS comment beside it. Field Blue (#5b86b8) is a border, never text; App Blue words sit only on Card Mist (4.5:1), and colored words elsewhere use Harbor Blue.

## Typography

**Display Font:** Overpass 700/800 (with Segoe UI, system-ui, sans-serif)
**Body Font:** Atkinson Hyperlegible Next 400/600/700 (with Segoe UI, system-ui, sans-serif)
**App pages:** the system font stack, bold for headings.

**Character:** Overpass brings the confident, open shapes of highway signage to headings, which suits a site about finding your way. Atkinson Hyperlegible Next was designed for low-vision readers and keeps the body plain and sturdy. Both fonts load in `frontend/index.html` and are applied only inside the About page wrapper.

### Hierarchy
- **Display** (Overpass 800, fluid 40 to 68px, tight 1.02 leading, -0.025em): the one h1 on the About first screen.
- **Headline** (Overpass 800, fluid 30 to 42px, 1.1, -0.02em): About section headings. The closing band's heading runs a little larger (fluid 30 to 48px, 1.05) and wraps at 18ch.
- **Title** (Overpass 700, 21px, 1.25): feature and step headings; audience boxes use 24px/1.2, listing titles 19px.
- **Body** (Atkinson 400, 18px, 1.6): About paragraphs, capped at 48ch to 60ch. Lead paragraphs (subtitle, team text) run fluid 19 to 22px.
- **Label** (Atkinson 700, 15px, 1.25): tabs, nav links (600), buttons (16px, 18px when big), the Pause pill (600, 14px). Never uppercase.
- **Small** (Atkinson 400 to 700, 14px): demo notes, listing facts, match reasons.
- **App pages** (system font): card titles 18 to 22px bold, body 16px, secondary 12 to 14px in Quiet Blue.

### Named Rules
**The Sign Lettering Rule.** Overpass is for headings, the logo, step numbers, and initial squares only; everything a student reads at length is Atkinson. Headings use `text-wrap: balance`.

## Layout

The About page is a stack of full-width bands. Content is held to 1120px (a 1168px container with 24px side padding, 16px under 480px). The first screen is a two-column grid: headline column takes the leftover space, the example search is capped at 540px, 56px gap, both top-aligned so tab switches never make the headline jump. Content sections use 96px top and bottom padding (64px on phones), separated by 1px Sky Edge lines. Split sections place the heading in a 340px left column beside the content. Audience boxes are a two-column grid (20px gap); steps are three columns (24px gap).

Layering on About is fixed and explicit: the wave canvas sits behind everything (layer 0) and fills the window without scrolling; the page's main content is lifted to layer 1; the sticky bar is 10; the skip link and the Pause pill are 20 (the pill pinned 16px from the bottom-left corner); the click-spark canvas is 30. Both canvases let every click through.

Responsive behavior: at 960px the hero collapses to one column (demo capped at 560px) and the top bar wraps its section links onto a second row; at 760px all grids stack, the bar stops being sticky, section padding drops to 64px, and the background waves become a still picture with no Pause pill; at 480px side padding, demo padding, and tab type tighten so all three tabs fit.

App pages use centered grids capped at 1200px with 32px/24px page padding and 24px column gaps (Feed: 260px / fluid / 300px; Profile: fluid / 340px; Network: fluid / 300px), stacking boxes in columns with 16px gaps.

Spacing steps observed and reused: 4, 8, 12, 16, 20, 24, 32, 56, 72, 96px.

## Elevation & Depth

Depth is tonal. On About, surfaces step lighter as they come forward: the Trailhead Sky ground (with its very faint App Blue wave lines at 10% strength, a texture rather than a layer), Deeper Sky Panel boxes, then Card Mist listing cards and the Card Mist tab tray inside the demo window. In the app, Card Mist boxes sit on the Sky Page with a 1px Hairline Blue border instead of a shadow. Two shadows exist: the example-search window, so the live demo floats above the page, and a small one under the fixed Pause pill, so it reads as a control lifted off the moving lines. The SpotlightCard glow on audience boxes is a hover light, not elevation: a soft white circle that only brightens the panel.

### Shadow Vocabulary
- **Demo float** (`box-shadow: 0 24px 48px -24px rgb(15 42 68 / 0.18)`): the example-search window only; navy at 18% so it reads as a soft daylight shadow.
- **Control lift** (`box-shadow: 0 4px 12px -6px rgb(15 42 68 / 0.3)`): the fixed Pause background pill only.

### Named Rules
**The Two Floats Rule.** Only the product demo and the fixed Pause control float. Every other surface separates by tone or a 1px line.

## Shapes

Gently rounded rectangles throughout. Large containers use 16px (demo window, audience boxes, every app card). Cards and icon squares inside them step down to 12px; the tab tray uses 10px and each tab 7px so the sky-blue cut-out nests inside the tray. About buttons and quiet links use 8px; the star-border ring around the big Sign up button is 11px (the button's 8px plus its 3px ring). App action buttons and the Pause pill are full pills (999px); avatars are circles. Match reasons use 14px rather than a full pill, because a long reason wraps to two lines on phones and a full pill turns into a blob. The recurring silhouette is the diamond: a square rotated 45 degrees with a 2px corner, Trail Sky in the logo (14px) and Haze Blue on the step trail line (10px).

## Components

### Buttons
Solid, soft, and obvious: one per screen region, never competing.
- **Shape:** gently rounded (8px) on About; full pill (999px) in the app; 4px on the Login/Signup form button.
- **Primary (About):** Trail Sky fill, navy text (5.9:1), 700 weight, 10px 18px (big: 18px text, 14px 28px). A transparent 2px border so the button keeps an outline in Windows High Contrast.
- **Hover / Focus:** Deeper Sky on hover (navy 5:1); 3px Harbor Blue focus ring at 3px offset (see The Harbor Ring Rule).
- **Press:** scales to 0.97 over 160ms with the ease-out curve (motion-allowed only).
- **Star border (hero Sign up):** the big button sits in a 3px ring with 11px corners; two Navy Ink lights make one lap around it 600ms after load (3s), then rest out of sight, and keep circling only while the button is hovered or focused. Navy, because a sky-blue light would blend into the sky-blue button. Hidden in reduced motion and forced colors.
- **Navy (closing band):** on the sky-blue band the button turns Navy Ink with white text (12.9:1), darkening to Harbor Blue on hover (7.1:1); its focus ring is navy.
- **Quiet link (Log in):** Navy Ink text, no fill, Deeper Sky Panel box on hover, same height as Sign up.
- **Pause background pill:** fixed 16px from the bottom-left corner, Card Mist, 1px Sky Edge border, Navy Ink 14px semi-bold words, 8px 14px, full pill, Control lift shadow, Soft Blue on hover, Harbor Blue focus ring. Its words swap between "Pause background" and "Play background". Shown only when the waves can move.
- **App:** filled App Blue pill with white text (4.9:1), darkening to Harbor Blue on hover; outline pill in Card Mist with an App Blue border and App Blue words (4.5:1). Its hover should deepen the words to Harbor Blue if it gains a Soft Blue fill; App Blue words on Soft Blue measure 4.2:1.

### Chips
- **Match reasons:** Trail Mark Wash fill, Navy Text (9.9:1), 14px semi-bold, 4px 12px, 14px corners. Listed under a "Why it matched" label separated by a Hairline Blue rule.

### Cards / Containers
- **Corner Style:** 16px containers, 12px nested cards.
- **Background:** Deeper Sky Panel on About; Card Mist in the app and for listing cards.
- **Shadow Strategy:** none, except the demo window (see Elevation & Depth).
- **Border:** 1px Sky Edge on the demo window; 1px Hairline Blue on app cards; none on audience boxes.
- **Internal Padding:** 32px audience boxes (24px on phones), 16px demo window, 18px listing cards, 20 to 32px app cards.
- **Spotlight (audience boxes):** on hover, a soft white glow (white at 70%, fading out by 80% of the box) follows the mouse over the panel behind the text, fading in over 300ms. Text stays at 6.5:1 or better (the resting panel; the glow only raises it). Decoration only, so no keyboard equivalent.

### Inputs / Fields
- **Style:** field on Card Mist, 1px Field Blue border (3.5:1, meets the 3:1 non-text minimum), 8px 12px padding. Feed search and composer fields are 999px pills with a Hairline Blue border.
- **Focus:** 2px App Blue outline at 2px offset.

### Navigation
- **About bar:** sticky Trailhead Sky bar, 68px tall, 1px Sky Edge bottom line. Logo (Trail Sky blaze plus Overpass 800 wordmark) left, section links center (Lake Blue Ink, 600, 15px, darkening to Navy Ink on a Deeper Sky Panel box on hover), Log in and the sky-blue Sign up right. Section targets use 68px scroll margin. A skip link (Trail Sky with navy words) slides into view on focus.
- **App bar:** sticky Card Mist bar with a Hairline Blue bottom line; links in Lake Blue, darkening to Navy Text and underlining on hover.

### Example Search Tabs (signature)
Three equal tabs in a Card Mist tray on the deeper blue demo window. The selected state is not a recolored button: a Trail Sky copy of the whole tab row with navy words lies over the real buttons (hidden from assistive tech, click-through), and `clip-path: inset(... round 7px)` cuts it down to the selected tab. On selection the cut-out slides over 250ms with the strong ease-in-out curve, so the sky blue and its words move together. Unselected tabs are Lake Blue Ink (8.3:1 on the tray) with a Deeper Sky Panel hover. Tabs are real `role="tab"` buttons with roving tabindex and arrow, Home, and End keys. In forced-colors mode the sky-blue copy is hidden and the selected tab is underlined.

### Example Listing Card (signature)
A Card Mist card that previews the app inside the deeper blue demo window: a 44px App Blue initials square (Overpass 800, white letters, 4.9:1), a 19px title in Navy Text, organization in Lake Blue, a facts row in Quiet Blue, and on the first card "Why it matched" chips plus a "Sign up to apply" link (Harbor Blue, 6.6:1, with a soft Field Blue underline that darkens on hover). When listings change they fade in and rise 8px over 240ms with ease-out via `@starting-style`, the second staggered 50ms; with reduced motion they only fade.

### React Bits effects (signature)
Six effects in `frontend/src/components/reactbits/`, rewritten from React Bits without extra packages, styled under "React Bits effects" in `index.css`, colored and timed from `:root`. About only so far.
- **Waves** (whole About page background): thin vertical lines every 22px, drawn on a fixed, click-through canvas behind the content in App Blue at 10% strength. Each line sways sideways by two sine waves added together (22px and about 7px, drifting slowly at different speeds; speed constant 0.00025), so the motion looks natural rather than like one regular wiggle. Within 170px of a real mouse the lines bend up to 28px away from it, and the bend eases toward the pointer (10% per frame) so it glides instead of jumping; touch input is ignored. Drawing stops while the tab is hidden. With reduced motion, or on screens 760px wide or narrower, it draws one still picture and never moves. Otherwise it runs until stopped, so the Pause background pill (see Buttons) satisfies WCAG 2.2.2. The lines are 1px and very faint, so text over them keeps its measured contrast in practice.
- **ShinyText** (hero subtitle): Lake Blue Ink words with a Harbor Blue band clipped to the letters, sweeping left to right (2.2s, twice, starting at 400ms), then still. The band stays 5.8:1, so the words are readable mid-sweep.
- **StarBorder** (hero Sign up): see Buttons.
- **SpotlightCard** (audience boxes): see Cards / Containers.
- **FadeContent** (sections below the hero, and the hero text): boxes start transparent and 24px low, rising into place over 600ms with ease-out the first time they scroll into view. Inside, features rise 16px with 90ms steps and How it works steps with 150ms steps, left to right along the trail.
- **ClickSpark** (whole About page): eight 12px App Blue lines burst 22px from each click over 400ms on a click-through canvas; drawn only while sparks fly, skipped entirely with reduced motion.

### Motion grammar
All About CSS motion lives inside `@media (prefers-reduced-motion: no-preference)`, and the canvas effects check the same setting in script: smooth in-page scrolling, 150ms color fades on hover, the 0.97 press, the clip-path tab slide, the listing entrance, and every React Bits effect. The `reduce` variant keeps only an opacity fade on listings and a still wave picture; everything else is simply present. Anything that starts on its own either stops within 5 seconds (shine twice, star lights one lap) or has a visible Pause control (the waves) (WCAG 2.2.2); only hover or focus keeps the star lights looping. Timing tokens: press 160ms, hover 150ms, move 250ms, enter 240ms, glow 300ms, reveal 600ms, shine 2.2s, star 3s; curves `cubic-bezier(0.23, 1, 0.32, 1)` (out) and `cubic-bezier(0.77, 0, 0.175, 1)` (in-out). In forced-colors mode the shine falls back to plain CanvasText and the star lights are hidden.

## Do's and Don'ts

### Do:
- **Do** write every style as plain CSS in `frontend/src/index.css`, under a page section, using the `:root` variables.
- **Do** prefix class names with the page and name them after what is on screen (`about-listing-title`, `form-button`).
- **Do** comment every rule in plain language for student learners, including the contrast ratio beside every text color.
- **Do** reserve the sky-blue accent for actions and their states, with navy (#10325a, 5.9:1) as the only text on it.
- **Do** use the 3px Harbor Blue focus ring at 3px offset everywhere on About, switching to Navy Ink on the sky-blue band.
- **Do** paint every box, card, tray, and pill with `var(--card)` (Card Mist); keep pure white for words and rings on solid blue or navy fills.
- **Do** keep new colors a step below full brightness, and use clear blues (not grays) for secondary text, lines, and borders; never neon.
- **Do** turn a button navy with white text when it sits on a sky-blue fill.
- **Do** use Harbor Blue for colored words anywhere but Card Mist; App Blue words belong on Card Mist only.
- **Do** put every animation inside `prefers-reduced-motion: no-preference`, with an opacity-only or still variant where change needs to be noticed.
- **Do** stop anything that moves on its own within 5 seconds, or give it a visible Pause control and a still version on phones; loop short effects only while the user hovers or focuses.
- **Do** keep background canvases fixed, click-through, hidden from screen readers, and stopped while the tab is hidden.
- **Do** read React Bits colors and timing from the `--shine-`, `--star-`, `--spotlight-`, `--spark-`, `--wave-`, and `--time-` variables in `:root`.
- **Do** give anything that relies on color a forced-colors fallback (transparent borders on buttons, underline on the selected tab, plain text for the shine).
- **Do** use inline SVG line icons (24px, stroke 2, currentColor), hidden from screen readers when a heading says the same thing.
- **Do** label every made-up listing as an example.

### Don't:
- **Don't** paint any surface pure white (`white` or `#ffffff` backgrounds); use Card Mist.
- **Don't** use Trail Sky as text, an icon stroke, or a focus ring (1.8:1 on the page, 2:1 on cards).
- **Don't** put white text on Trail Sky or Deeper Sky (2.2:1 or less); use navy.
- **Don't** set App Blue text on the page (3.9:1), panels (3.5:1), or Soft Blue (4.2:1).
- **Don't** use the accent for decoration beyond the logo blaze; trail diamonds and step numbers are Haze Blue, sparks are App Blue, the shine is Harbor Blue.
- **Don't** use Field Blue (#5b86b8) for text.
- **Don't** use Tailwind utility classes or inline `style` attributes; Tailwind is imported only for its reset.
- **Don't** add shadows beyond the demo window's float and the Pause pill's lift.
- **Don't** use full pills on chips whose text can wrap; use 14px corners.
- **Don't** use emoji or text glyphs as icons.
- **Don't** put small uppercase, letter-spaced labels above headings.
