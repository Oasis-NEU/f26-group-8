# Roles and planned work

From the team's planning doc and to-do list. Use it to understand what a request
is part of, but don't start any of it unless asked.

## User roles

The frontend needs four views: Guest, Student, Job Lister, and Admin.

| Role | Can | Can't |
|---|---|---|
| Guest | Browse jobs | Apply, open the dashboard |
| Student | Apply, use the dashboard | Post jobs |
| Company / Job Lister | Post jobs, has its own dashboard | Apply |
| Admin | Delete jobs, add and delete profiles | |

The frontend doesn't know who is logged in yet, so nothing actually hides by
role. When building a role view, keep the role in one obvious place (one
variable or one prop) and say it's a placeholder, so it's easy to connect to
real login later. For example:

```jsx
// Who is looking at the page. This is a placeholder until login is connected
// to the backend. Change it to "guest", "jobLister", or "admin" to test the
// other views.
const role = "student";
```

## Planned work

- **Feed:** make Comment (and Share) work; remove the Connect button from the
  user's own point of view.
- **Network:** people to connect with, plus communities. **Messages:** a DM page.
- **Edit Profile (Roemer, on `roemer-work`):** username, bio, location (optional,
  for privacy), about, education, experience, projects, resume, skills, and a GPA
  field that is saved but not shown on the profile (it's for job filters later).
  Once it's on `main`, Profile's "Edit profile" button can become a
  `<Link to="/editprofile">`.
- **New top-bar buttons:** Notifications and Apply.
- **Apply page:** open jobs, internships, and co-ops showing type, location, pay,
  and requirements. Maybe a filter by major; later, sorting jobs by the user's
  resume.
- **Job Lister view** for companies posting jobs.
- **Menu page (Ekkam):** not built yet.
- **About page:** a Credits section with team names and emails.
- **Design pass:** more interactive buttons (hover and press feedback), new fonts
  and colors. Change colors through the `:root` variables.

## Longer term

Filters (GPA, age, skills, location, remote/hybrid/on-site, major, paid/unpaid),
separate high school and college sections, an events page with calendar sync, a
resume builder, and an AI resume coach. Job listings will come from real job APIs.
