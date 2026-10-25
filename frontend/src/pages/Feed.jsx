// Feed.jsx is the Feed page (yoursite.com/feed), the main page you see after logging in.
// At the top: a big title and two tabs (For you and Following).
// Under that, 2 columns: the post box and the posts on the left, and
// today's date, opportunities, and people to know on the right.
// Everything on it is made-up sample data for now, because the site
// doesn't have a backend (server and database) yet.
// The styles for this page are in index.css, under "Feed page".

// useState lets the page remember a value and redraw itself when it changes.
// useEffect runs some code after the page shows up on screen.
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
// Link makes a clickable link to another page of our site.
import { Link } from "react-router";

// ---------- Sample data ----------
// These lists hold the made-up content shown on the page.
// [ ] is a list, each { } inside it is one item,
// and each "name: value" is one piece of info about that item.
// Later, this data would come from the backend instead.

// The tabs under the title. "For you" shows every post, and
// "Following" shows only posts from people you follow
const tabs = ["For you", "Following"];

// The posts.
// Each post has: a unique number (id), who wrote it (author, initials, headline),
// how long ago (time), what kind of post it is (kind, shown on the colored strip),
// the strip's color (color: "blue", "dark", or "sky"), a title,
// what it says (text), whether you follow the author (following: true shows it
// on the "Following" tab), and its counts (likes, comments).
const posts = [
  {
    id: 1,
    author: "Kevin Liu",
    initials: "KL",
    headline: "Student @ Northeastern University",
    time: "42 min",
    kind: "Update",
    color: "blue",
    title: "Building ScoutSearch!",
    text: "Excited to be building ScoutSearch with my Oasis team!",
    following: true,
    likes: 48,
    comments: 9,
  },
  {
    id: 2,
    author: "Roemer Mallari",
    initials: "RMV",
    headline: "Computer Science & Business Administration @ Northeastern University",
    time: "1h",
    kind: "Big news",
    color: "dark",
    title: "I'm in the Oasis Cohort!",
    text: "Thrilled to share that I've been accepted to this semester's Oasis Cohort!",
    following: true,
    likes: 222,
    comments: 18,
  },
  {
    id: 3,
    author: "Jayden Gajewski",
    initials: "JG",
    headline: "Student @ Northeastern University",
    time: "4h",
    kind: "Update",
    color: "sky",
    title: "Loving Oasis so far!",
    text: "Having a great time at Oasis this semester. Can't wait to show everyone what we're building!",
    following: false,
    likes: 31,
    comments: 4,
  },
  {
    id: 4,
    author: "Anthony Dorsey",
    initials: "AD",
    headline: "Student @ Northeastern University",
    time: "22h",
    kind: "Big news",
    color: "dark",
    title: "Proud of our team!",
    text: "Proud of what our team is building at Oasis!",
    following: false,
    likes: 64,
    comments: 12,
  },
];

// The jobs and programs in the "Opportunities for you" box (right column).
// These are made-up examples (the box says so), because there are no real
// listings yet. "type" is what kind of opportunity it is.
// "color" picks the square's color
const opportunities = [
  {
    id: 1,
    initials: "GL",
    color: "sky",
    type: "Internship",
    title: "Climate Data Intern",
    place: "GreenLine Labs · Remote",
    when: "Apply by Nov 14",
  },
  {
    id: 2,
    initials: "M+",
    color: "blue",
    type: "Competition",
    title: "Design Challenge",
    place: "Mobility+ Youth Lab",
    when: "Starts Dec 2",
  },
];

// The people in the "People to know" box (right column)
const people = [
  { id: 1, name: "Kyle Vergara", initials: "KV", headline: "Nursing Student" },
  {
    id: 2,
    name: "Richie Rich",
    initials: "RR",
    headline: "Business @ Northeastern",
  },
  {
    id: 3,
    name: "Ethan Ripalda",
    initials: "ER",
    headline: "Student @ Northeastern University",
  },
];

// Turns a number into easy-to-read words for the post counts.
// For example, countWords(1000000, "like") gives "1,000,000 likes",
// and countWords(1, "comment") gives "1 comment" (no "s" when there's only one).
// toLocaleString() adds the commas.
function countWords(number, word) {
  if (number === 1) {
    return "1 " + word;
  }
  return number.toLocaleString() + " " + word + "s";
}

// ---------- Small icons ----------
// Each icon is a tiny drawing (SVG) on a 24 by 24 grid.
// stroke="currentColor" makes it the same color as the words around it.
// aria-hidden="true" hides it from screen readers, because the words next
// to it already say the same thing (WCAG)

// A picture: a box with a small circle (the sun) and a mountain line
function ImageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

// A sparkle: a big 4-pointed star with a small one next to it
function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 3 11.8 8.2 17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8Z" />
      <path d="M18 15v6" />
      <path d="M15 18h6" />
    </svg>
  );
}

// A calendar: a box with two rings on top and a line across
function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

// An eye: an almond shape with a circle (the pupil) in the middle
function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ---------- Pieces of the page ----------
// Each function below is a component: one piece of the page.
// The Feed component at the bottom puts all the pieces together.

// The big title at the top of the page
// Splits a word into its letters, each in its own <span>, so the CSS can
// move every letter by itself (a "split text" effect).
// For example, splitLetters("See") gives <span>S</span><span>e</span><span>e</span>.
// .split("") turns "See" into the list ["S", "e", "e"].
// The key is the letter's place in the word (0, 1, 2...), which is fine here
// because the words never change
function splitLetters(word) {
  return word.split("").map((letter, place) => (
    <span key={place} className="feed-title-letter">
      {letter}
    </span>
  ));
}

// The letters rise in one after another the first time you open the Feed,
// and a wave runs through them when the mouse is over the title
// (see "Feed: motion" in index.css).
function FeedHeader() {
  // "playIntro" is true only the first time you see the Feed in this browser tab.
  // sessionStorage is a small notebook the browser keeps until you close the tab.
  // If it already says "feed-title-played", the animation already played, so skip it.
  // try/catch: in some private windows the notebook is turned off, and reading it
  // causes an error. If that happens, just skip the animation
  const [playIntro] = useState(() => {
    try {
      return sessionStorage.getItem("feed-title-played") === null;
    } catch {
      return false;
    }
  });

  // After the title shows up, write in the notebook that it played,
  // so it doesn't play again when you come back to the Feed
  useEffect(() => {
    try {
      sessionStorage.setItem("feed-title-played", "yes");
    } catch {
      // The notebook is turned off. Nothing to do
    }
  }, []);

  return (
    <header className="feed-header">
      {/* The page's one <h1> (WCAG).
          While playIntro is true, it also gets the "feed-title-intro" class,
          which is what turns the first-visit animation on */}
      <h1 className={playIntro ? "feed-title feed-title-intro" : "feed-title"}>
        {/* Screen readers read this hidden copy of the title as one normal
            sentence. Without it, they could read the split-up letters one
            at a time, like "S, e, e" (WCAG) */}
        <span className="sr-only">See what people are making.</span>
        {/* The title you SEE: every word split into letters.
            aria-hidden="true" hides it from screen readers, since they read
            the hidden copy above instead */}
        <span aria-hidden="true">
          <span className="feed-title-word">{splitLetters("See")}</span>{" "}
          <span className="feed-title-word">{splitLetters("what")}</span>{" "}
          <span className="feed-title-word">{splitLetters("people")}</span>{" "}
          <span className="feed-title-word">{splitLetters("are")}</span>{" "}
          {/* The last word is blue */}
          <span className="feed-title-word feed-title-blue">
            {splitLetters("making.")}
          </span>
        </span>
      </h1>
      <p className="feed-subtitle">
        Fresh work, honest progress, and opportunities picked for your path.
      </p>
    </header>
  );
}

// The row of tabs (For you and Following).
// "props.picked" is the tab that's on right now, and "props.setPicked"
// changes it. They live in Feed (below), because Feed needs to know
// the picked tab to choose which posts to show
function FeedTabs(props) {
  return (
    // role="group" + aria-label tells screen readers these buttons belong
    // together and what they're for (WCAG)
    <div className="feed-tabs" role="group" aria-label="Show posts from">
      {/* Makes one button for each tab in the tabs list */}
      {tabs.map((tab) => (
        <button
          key={tab}
          // While this tab is the picked one, it also gets the
          // "feed-tab-picked" class, which adds the blue line under it
          className={
            tab === props.picked ? "feed-tab feed-tab-picked" : "feed-tab"
          }
          // aria-pressed tells screen readers which tab is on (WCAG)
          aria-pressed={tab === props.picked}
          // Clicking a tab makes it the picked one
          onClick={() => props.setPicked(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// The "Share something you're working on" box at the top of the posts.
// It's only for looks right now: typing and clicking don't post anything yet.
function PostComposer() {
  return (
    <div className="feed-composer">
      {/* Top row: your circle next to the typing box */}
      <div className="feed-composer-top">
        <div className="feed-post-avatar" aria-hidden="true">
          RMV
        </div>
        {/* The label tells screen readers what this box is for (WCAG).
            htmlFor="feed-composer" connects it to the input with id="feed-composer".
            "sr-only" (screen reader only) hides it on the screen, but screen
            readers still read it. The placeholder alone isn't enough,
            because it disappears once you start typing */}
        <label htmlFor="feed-composer" className="sr-only">
          Share something you're working on
        </label>
        {/* placeholder is the hint text that shows while the box is empty */}
        <input
          id="feed-composer"
          className="feed-composer-input"
          placeholder="What are you working on?"
        />
      </div>
      {/* The two buttons under the typing box. They don't do anything yet */}
      <div className="feed-composer-buttons">
        <button className="feed-composer-button">
          <ImageIcon />
          Add photo
        </button>
        <button className="feed-composer-button">
          <SparkleIcon />
          Write update
        </button>
      </div>
    </div>
  );
}

// One post.
// "props" holds the info passed in by Feed below. For example,
// <Post author="David Ripalda" /> makes props.author equal "David Ripalda".
function Post(props) {
  // "liked" remembers whether you clicked Like on this post. It starts as false.
  // Each post gets its own "liked", so liking one post doesn't like the others.
  const [liked, setLiked] = useState(false);
  // "change" remembers which way the like count just moved, so the CSS knows
  // which way to roll the number: "up" (you liked it) or "down" (you unliked it).
  // It starts as null ("nothing yet"), so the counts don't roll when the page first loads
  const [change, setChange] = useState(null);

  // Runs when you click Like
  function toggleLike() {
    // If it was liked, the count goes down. If it wasn't, it goes up
    setChange(liked ? "down" : "up");
    // Flip "liked": false becomes true, true becomes false ("!" means "the opposite of")
    setLiked(!liked);
  }

  return (
    // <article> means "one post that makes sense on its own" (screen readers
    // can jump from post to post)
    <article className="feed-post">
      {/* The colored strip across the top, like "Build log".
          The color comes from props.color, so "blue" gives the class
          "feed-post-strip-blue" (see index.css) */}
      <p className={"feed-post-strip feed-post-strip-" + props.color}>
        {props.kind}
      </p>
      {/* Everything under the strip */}
      <div className="feed-post-body">
        {/* Who posted it: the circle, then the name with school and time under it */}
        <div className="feed-post-header">
          {/* Hidden from screen readers, because the name is right next to it */}
          <div className="feed-post-avatar" aria-hidden="true">
            {props.initials}
          </div>
          <div className="feed-post-who">
            <p className="feed-post-author">{props.author}</p>
            <p className="feed-post-headline">
              {props.headline}
              {/* The dot is decoration, so screen readers skip it */}
              <span aria-hidden="true"> · </span>
              {props.time}
            </p>
          </div>
        </div>
        {/* The post's title. An <h2>, because each post is one part of the page */}
        <h2 className="feed-post-title">{props.title}</h2>
        {/* What the post says */}
        <p className="feed-post-text">{props.text}</p>
        <div className="feed-post-counts">
          {/* "liked ? A : B" means: if liked is true, use A. Otherwise, use B.
              So the count goes up by 1 while you have the post liked.
              countWords (near the top of this file) adds commas and the right
              ending, like "1,000,000 likes" or "1 like" */}
          {/* The like count. While liked, it gets the "feed-like-count-on" class,
              which turns it blue (see index.css) */}
          <span className={liked ? "feed-like-count feed-like-count-on" : "feed-like-count"}>
            {/* key={...} gives this <span> a new name every time "liked" flips.
                A new name makes React swap in a brand new <span>, and a brand new
                one plays its roll-in animation (see index.css). The class adds
                "-up" or "-down" so it rolls the right way */}
            <span
              key={liked ? "liked" : "not-liked"}
              className={change ? "feed-like-number feed-like-number-" + change : "feed-like-number"}
            >
              {countWords(liked ? props.likes + 1 : props.likes, "like")}
            </span>
          </span>
          <span>{countWords(props.comments, "comment")}</span>
        </div>
        <div className="feed-post-actions">
          {/* Clicking Like runs toggleLike (above), which flips "liked".
              While liked, the button gets the "feed-liked" class,
              which makes it blue and bold (see index.css).
              aria-pressed={liked} tells screen readers this is an on/off button
              and whether it's on right now, like "Liked, toggle button, pressed" (WCAG).
              Every post has a Like button, so aria-label tells screen readers
              WHOSE post each one is for, like "Like Kevin Liu's post". It starts
              with the word "Like" so voice control ("click Like") still works (WCAG) */}
          <button
            onClick={toggleLike}
            className={liked ? "feed-liked" : ""}
            aria-pressed={liked}
            aria-label={"Like " + props.author + "'s post"}
          >
            {/* The button's words change too */}
            {liked ? "Liked" : "Like"}
          </button>
          {/* These two don't do anything yet */}
          <button>Comment</button>
          <button>Share</button>
        </div>
      </div>
    </article>
  );
}

// The sky blue box with today's date (top of the right column).
// It's just for looks: a friendly "here's today" at the top of the page
function TodayCard() {
  // new Date() is the date and time right now, on the visitor's computer
  const today = new Date();
  // toLocaleDateString turns it into words, like "Saturday" and "October 24"
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const monthAndDay = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  return (
    <div className="feed-today">
      <SparkleIcon />
      {/* <time> marks it as a date. dateTime gives computers the exact date,
          like "2026-10-24" (the first 10 letters of toISOString) */}
      <time
        className="feed-today-words"
        dateTime={today.toISOString().slice(0, 10)}
      >
        <span className="feed-today-weekday">{weekday}</span>
        <span className="feed-today-date">{monthAndDay}</span>
      </time>
    </div>
  );
}

// The "Opportunities for you" box: jobs and programs that fit you (right column)
function OpportunityRadar() {
  return (
    <section className="feed-side-card">
      {/* The box's title. The small "Examples" tag says these jobs are
          made up for now, so nobody thinks they're real listings */}
      <h2 className="feed-side-title">
        Opportunities for you{" "}
        <span className="feed-side-note">Examples</span>
      </h2>
      <ul className="feed-side-list">
        {/* Makes one row for each item in the opportunities list */}
        {opportunities.map((job) => (
          <li key={job.id} className="feed-opportunity">
            {/* The colored square with the company's initials.
                Hidden from screen readers, because the company name is in the words */}
            <div
              className={"feed-opportunity-logo feed-opportunity-logo-" + job.color}
              aria-hidden="true"
            >
              {job.initials}
            </div>
            <div className="feed-opportunity-info">
              {/* What kind of opportunity it is, like "Internship" */}
              <p className="feed-opportunity-type">{job.type}</p>
              {/* The job's name. An <h3>, because it's inside the box's <h2> */}
              <h3 className="feed-opportunity-title">{job.title}</h3>
              <p className="feed-opportunity-place">{job.place}</p>
              {/* The deadline, with a little calendar next to it */}
              <p className="feed-opportunity-when">
                <CalendarIcon />
                {job.when}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// The "People to know" box (right column)
function PeopleToKnow() {
  return (
    <section className="feed-side-card">
      <h2 className="feed-side-title">People to know</h2>
      <ul className="feed-side-list">
        {/* Makes one row for each person in the people list */}
        {people.map((person) => (
          <li key={person.id} className="feed-person">
            {/* Their initials in a circle (hidden from screen readers,
                because their name is right next to it) */}
            <div className="feed-person-avatar" aria-hidden="true">
              {person.initials}
            </div>
            {/* Their name, with their headline under it */}
            <div className="feed-person-info">
              <p className="feed-person-name">{person.name}</p>
              <p className="feed-person-headline">{person.headline}</p>
            </div>
            {/* The eye button: takes you to their profile.
                It's a <Link> (not a <button>) because it goes to another page.
                Everyone's own profile page doesn't exist yet, so for now it
                goes to the Profile page. Later, "/profile" can become each
                person's own page.
                It has no words on it, so aria-label tells screen readers
                what it does and WHO it's for, like "View Kyle Vergara's profile" (WCAG) */}
            <Link
              to="/profile"
              className="feed-profile-button"
              aria-label={"View " + person.name + "'s profile"}
              // The site remembers how far down you scrolled, so without this the
              // profile would open partway down the page. This jumps to the very
              // top first (right away, with no glide), so the profile opens at the top
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              <EyeIcon />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Feed is the whole page. It puts all the pieces above together.
function Feed() {
  // "picked" remembers which tab is on. It starts on "For you".
  const [picked, setPicked] = useState("For you");

  // Picks which posts to show, based on the tab.
  // "For you" shows every post. On "Following", .filter() goes through the
  // posts and keeps only the ones where "following" is true
  let shownPosts = posts;
  if (picked === "Following") {
    shownPosts = posts.filter((post) => post.following);
  }

  return (
    // <> </> is a "fragment": an invisible wrapper. A component can only
    // return one thing, so this groups the top bar and the page together
    <>
      {/* The words on the browser tab (WCAG). React puts this in the right place for us */}
      <title>Feed | ScoutSearch</title>
      {/* The top bar */}
      <NavBar />
      {/* <main> is the main content of the page (screen readers can jump to it) */}
      <main className="feed-page">
        {/* The big title, then the tabs. Both stretch across the whole page */}
        <FeedHeader />
        <FeedTabs picked={picked} setPicked={setPicked} />

        {/* Left column: the post box, then the posts */}
        <section className="feed-middle" aria-label="Posts">
          <PostComposer />
          {/* "A ? B : C" again: if there are posts to show, show them.
              Otherwise, show a short message instead of an empty space */}
          {shownPosts.length > 0 ? (
            // Makes one <Post> for each post that passed the filter above.
            // Each line like author={post.author} passes one piece of info
            // into the Post component, where it becomes props.author
            shownPosts.map((post) => (
              <Post
                key={post.id}
                author={post.author}
                initials={post.initials}
                headline={post.headline}
                time={post.time}
                kind={post.kind}
                color={post.color}
                title={post.title}
                text={post.text}
                likes={post.likes}
                comments={post.comments}
              />
            ))
          ) : (
            <p className="feed-empty">
              No posts from people you follow yet.
            </p>
          )}
        </section>

        {/* Right column: today's date, then suggestions */}
        <aside className="feed-right">
          <TodayCard />
          <OpportunityRadar />
          <PeopleToKnow />
        </aside>
      </main>
    </>
  );
}

// "export default" lets other files import Feed (App.jsx does this).
export default Feed;
