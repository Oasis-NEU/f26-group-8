// opportunities.js holds the made-up job listings. It's its own file because
// two pages use it: Discovery (the job list) and the Application tracker
// (which shows the jobs you saved). Later, this data would come from the
// backend instead.
//
// "export" lets other files bring it in with:
//   import { opportunities } from "../data/opportunities.js";

// The opportunities. Each { } is one opportunity, and each line inside it is
// one piece of information about it:
//   initials           the letters in the square logo
//   type               must match one of the names in opportunityTypes below
//   match              how well it fits your profile, out of 100
//   deadline           the last day to apply, written year-month-day. Written
//                      this way, sorting the words A to Z also sorts the dates.
//   pay, hours, about, responsibilities, requirements
//                      only shown in the pop-up you get from "View opportunity"
//
// These are written to look like the tech co-ops students see on NUWorks
// (Northeastern's job board): 6-month co-ops that run January to June or July
// to December, mostly around Boston. The companies are MADE UP on purpose:
// putting a real company's name on a job it never posted would mislead
// people, and the team's rule is that every example is clearly fake.
export const opportunities = [
  {
    id: 1,
    initials: "BL",
    title: "Front-End Developer Co-op",
    organization: "Brightloop Learning",
    type: "Co-op",
    place: "Remote",
    length: "Jan–Jun 2027",
    match: 92,
    deadline: "2026-11-20",
    description:
      "Build new screens for a homework app used by middle and high school students, working in React with a designer and two senior engineers.",
    tags: ["React", "JavaScript", "CSS"],
    pay: "$27–30/hr",
    hours: "40 hours a week",
    about:
      "Brightloop Learning makes a free homework helper used in more than 400 schools. The team is 30 people, mostly in Boston, working remotely.",
    responsibilities: [
      "Build and polish screens in React from a designer's mockups",
      "Fix bugs reported by students and teachers",
      "Check your screens work with a keyboard and a screen reader",
      "Show your work at the team's demo every other Friday",
    ],
    requirements: [
      "Have built at least one project in React (a class project counts)",
      "Know the basics of HTML and CSS",
      "Comfortable asking questions and getting feedback on your code",
    ],
  },
  {
    id: 2,
    initials: "KH",
    title: "Software Engineering Co-op",
    organization: "Kestrel Health Systems",
    type: "Co-op",
    place: "Boston, MA (hybrid)",
    length: "Jan–Jun 2027",
    match: 87,
    deadline: "2026-11-26",
    description:
      "Help build the web tools nurses use to schedule shifts. You'll write features end to end, from the database to the screen, and ship them every two weeks.",
    tags: ["TypeScript", "Node.js", "SQL"],
    pay: "$28–32/hr",
    hours: "40 hours a week, 3 days in the office",
    about:
      "Kestrel Health Systems builds scheduling software for hospitals across New England. Co-ops sit with a team of six engineers and a nurse who advises on the product.",
    responsibilities: [
      "Build new features from the database all the way to the screen",
      "Write tests so changes don't break what already works",
      "Ship your work every two weeks with the rest of the team",
      "Visit a hospital once to see how nurses use the tool",
    ],
    requirements: [
      "Have taken a data structures class, or built something similar on your own",
      "Have used JavaScript or TypeScript",
      "Have written a basic SQL query (we'll teach the rest)",
    ],
  },
  {
    id: 3,
    initials: "TA",
    title: "Data Science Co-op",
    organization: "Tidewater Analytics",
    type: "Co-op",
    place: "Cambridge, MA (on-site)",
    length: "Jul–Dec 2027",
    match: 78,
    deadline: "2027-03-01",
    description:
      "Clean and study public transit data, then build dashboards that show city planners where buses run late and why.",
    tags: ["Python", "pandas", "Data visualization"],
    pay: "$26–29/hr",
    hours: "40 hours a week, in the Cambridge office",
    about:
      "Tidewater Analytics helps cities make sense of their transit data. Its reports have been used to change bus schedules in three Massachusetts cities.",
    responsibilities: [
      "Clean messy bus arrival data so it can be trusted",
      "Find patterns in when and where buses run late",
      "Build charts and dashboards that city planners can read quickly",
      "Present one finding to a city team at the end of your co-op",
    ],
    requirements: [
      "Have written Python for a class or a project",
      "Curious about cities, maps, or public transit",
      "Comfortable explaining numbers to people who aren't data experts",
    ],
  },
  {
    id: 4,
    initials: "GS",
    title: "Cybersecurity Intern",
    organization: "Granite Shield Security",
    type: "Internship",
    place: "Remote",
    length: "12 weeks, summer 2027",
    match: 71,
    deadline: "2027-02-14",
    description:
      "Learn how security teams find and fix weak spots by helping test a company's websites, with weekly lessons from the team.",
    tags: ["Networking", "Linux", "Security basics"],
    pay: "$24/hr",
    hours: "30 hours a week",
    about:
      "Granite Shield Security tests websites for small businesses and nonprofits that can't afford a full security team. Interns learn alongside the testers every day.",
    responsibilities: [
      "Help test websites for common security mistakes",
      "Write short, clear reports of what you found",
      "Join a weekly lesson on a new security topic",
      "Practice on the team's safe test websites before real ones",
    ],
    requirements: [
      "No security experience needed",
      "Have used the command line a little, or want to learn",
      "Careful and patient: testing means checking the same thing many ways",
    ],
  },
  {
    id: 5,
    initials: "FC",
    title: "Student Web Developer",
    organization: "Fenway Code Club",
    type: "Part-time",
    place: "Boston, MA (hybrid)",
    length: "10 hours a week",
    match: 66,
    deadline: "2026-12-05",
    description:
      "Keep a youth coding club's website up to date and help build a sign-up page for its spring classes. Fits around your class schedule.",
    tags: ["HTML", "CSS", "Accessibility"],
    pay: "$20/hr",
    hours: "10 hours a week, you pick when",
    about:
      "Fenway Code Club runs free after-school coding classes for Boston middle and high schoolers. It's run by volunteers and two part-time staff.",
    responsibilities: [
      "Keep the club's website up to date with new classes and events",
      "Build a sign-up page for spring classes",
      "Make sure the site works well on phones and with screen readers",
    ],
    requirements: [
      "Have built a website with HTML and CSS",
      "Can work about 10 hours a week around your classes",
      "Bonus: you've been to a coding club yourself",
    ],
  },
];
