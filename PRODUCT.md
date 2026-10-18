# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students (primary):** high school and college students looking for their first or next internship, co-op, or research position. Many have never applied for a job before.
- **Guests:** visitors who can browse jobs but must sign up to apply.
- **Job listers (planned):** companies and organizations posting positions, with their own dashboard.
- **Admins (planned):** remove jobs and manage profiles.

## Product Purpose

ScoutSearch is a job board, "Indeed for students," where high school and college students find internships, co-ops, and research positions that fit their needs and interests. It is an Oasis @ Northeastern student project built by a team with a mentor. Success means a student who lands on the site understands what it is for, signs up, and finds opportunities they are actually eligible for.

## Positioning

It includes high school students, who most job boards and college career sites leave out, alongside college students looking for co-ops and internships.

## Operating Context

- The About page is the public front door: `/` redirects to `/about`.
- After signing up, students land in a social-style app (Feed, Profile, Network, Messages).
- Planned student features: an Apply page listing jobs with type, location, pay, and requirements; filters (major, GPA, age, skills, location, remote/hybrid/on-site, paid/unpaid); separate high school and college sections; an events page; a resume builder.

## Capabilities and Constraints

- Today: sign up and log in pages exist (not yet connected to the backend), plus Feed, Profile, Network, and Messages with sample data.
- Not built yet: job search, filters, events, resume builder, Apply page, role-based views. The About page describes these as part of the product; the team chose to keep that copy as-is.
- Confirmed by the team (2026-10-18): ScoutSearch is free; students under 18 can sign up; users' information is kept safe (passwords are hashed with bcrypt before they're stored).

## Brand Commitments

- Name: ScoutSearch. Credit line: "A Northeastern Oasis Project".
- Colors run through the `:root` variables in `frontend/src/index.css`: a clear, gentle light blue scheme (real blues, no grays) kept a step dimmer than full brightness (light blue `#d7e9fb` page, off-white `#f0f7ff` boxes instead of pure white, navy `#10325a` text, blue `#2a74ba` buttons) with a sky-blue accent (`#74b6ea`, navy text on it) saved for the main action.

## Evidence on Hand

None yet: no real listings, employers, user counts, outcomes, or testimonials. Any job or company shown on a page must be made up and clearly labeled as an example. Never invent numbers, partners, or reviews.

## Product Principles

1. Show students what they would actually get (real-looking, labeled examples) instead of making claims.
2. Speak to high schoolers as clearly as to college students; assume no job-search experience.
3. Accessibility is not optional; it is part of the product.
4. One obvious next step on every screen.

## Accessibility & Inclusion

WCAG 2.2 AA is required: text contrast of at least 4.5:1, visible keyboard focus, labeled controls, correct heading order, and motion only inside `prefers-reduced-motion: no-preference`. The team is learning, so code is heavily commented in plain language.
