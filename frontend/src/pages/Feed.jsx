// Feed.jsx is the Feed page (yoursite.com/feed), the main page you see after logging in.
// It has 3 columns: your profile on the left, posts in the middle,
// and suggestions (people and topics) on the right.
// Everything on it is made-up sample data for now, because the site
// doesn't have a backend (server and database) yet.
// The styles for this page are in index.css, under "Feed page".

// useState lets the page remember a value and redraw itself when it changes.
import { useState } from "react";

// ---------- Sample data ----------
// These lists hold the made-up content shown on the page.
// [ ] is a list, each { } inside it is one item,
// and each "name: value" is one piece of info about that item.
// Later, this data would come from the backend instead.

// The rows in the "Your space" box (left column)
const spaceItems = [
  { label: "Saved posts", count: 12 },
  { label: "My communities", count: 8 },
  { label: "Upcoming events", count: 3 },
  { label: "Applications", count: 0 },
];

// The posts in the middle column.
// Each post has: a unique number (id), who wrote it (author, initials, headline),
// how long ago (time), what it says (text), and its counts (likes, comments).
const posts = [
  {
    id: 1,
    author: "Roemer Mallari",
    initials: "RMV",
    headline:
      "Computer Science & Business Administration @ Northeastern University",
    time: "1h",
    text: "Thrilled to share that I've been accepted to this semester's Oasis Cohort!",
    likes: 222,
    comments: 18,
  },
  {
    id: 2,
    author: "David Ripalda",
    initials: "DR",
    headline: "Business Administration @ El Camino College",
    time: "4h",
    text: "Proud to represent Mekhi Industries!",
    likes: 1,
    comments: 0,
  },
  {
    id: 3,
    author: "Cire Younger",
    initials: "CY",
    headline: "CEO of Mekhi Industries!",
    time: "22h",
    text: "Proud Owner of Mekhi Industries!",
    likes: 1000000,
    comments: 120,
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
    headline: "Vice President @ Mekhi Industries",
  },
];

// The hashtags in the "Trending Topics" box (right column)
const topics = [
  { id: 1, tag: "OasisCohort", posts: "1.2k posts" },
  { id: 2, tag: "Internships", posts: "860 posts" },
  { id: 3, tag: "Hackathon", posts: "430 posts" },
];

// ---------- Pieces of the page ----------
// Each function below is a component: one piece of the page.
// The Feed component at the bottom puts all the pieces together.

// The profile card at the top of the left column.
// It always shows the same made-up profile for now.
function ProfileCard() {
  return (
    // "feed-profile-card" is the white box around everything below
    <div className="feed-profile-card">
      {/* The blue strip across the top of the card */}
      <div className="feed-profile-banner"></div>
      {/* The circle with your initials. The CSS pulls it up so it overlaps the strip */}
      <div className="feed-profile-avatar">RMV</div>
      {/* Your name */}
      <h2 className="feed-profile-name">Roemer Mallari</h2>
      {/* Your major */}
      <p className="feed-profile-bio">
        Computer Science & Business Administration
      </p>
      {/* Your school */}
      <p className="feed-profile-school">Northeastern University</p>
      {/* The row with two numbers side by side */}
      <div className="feed-profile-stats">
        {/* Left stat: the number, with its label under it */}
        <div className="feed-profile-stat">
          <p className="feed-profile-stat-number">222</p>
          <p className="feed-profile-stat-label">Connections</p>
        </div>
        {/* Right stat */}
        <div className="feed-profile-stat">
          <p className="feed-profile-stat-number">1.2k</p>
          <p className="feed-profile-stat-label">Profile views</p>
        </div>
      </div>
      {/* href="#" is a placeholder: the link doesn't go anywhere yet,
          because there's no profile page yet */}
      <a className="feed-profile-link" href="#">
        View your profile <span>→</span>
      </a>
    </div>
  );
}

// The "Your space" box under the profile card (left column)
function YourSpace() {
  return (
    <div className="feed-space-card">
      {/* The small gray heading. The CSS shows it in ALL CAPS */}
      <h3 className="feed-space-title">Your space</h3>
      {/* <ul> is a list, and each <li> is one row in it */}
      <ul className="feed-space-list">
        {/* .map() goes through spaceItems one at a time and makes a row for each.
            "item" is the current one, like { label: "Saved posts", count: 12 }.
            key={...} gives each row a unique name so React can keep track of it */}
        {spaceItems.map((item) => (
          <li key={item.label} className="feed-space-item">
            {/* The words on the left, like "Saved posts" */}
            <span>{item.label}</span>
            {/* The number on the right, like 12 */}
            <span>{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The "People to know" box (right column)
function PeopleToKnow() {
  return (
    // "feed-side-card" is the white box used for both boxes in the right column
    <div className="feed-side-card">
      {/* Uses the same heading style as "Your space" */}
      <h3 className="feed-space-title">People to know</h3>
      <ul className="feed-space-list">
        {/* Makes one row for each person in the people list */}
        {people.map((person) => (
          <li key={person.id} className="feed-person">
            {/* Their initials in a circle */}
            <div className="feed-post-avatar">{person.initials}</div>
            {/* Their name, with their headline under it */}
            <div className="feed-person-info">
              <p className="feed-post-author">{person.name}</p>
              <p className="feed-post-headline">{person.headline}</p>
            </div>
            {/* Doesn't do anything when clicked yet */}
            <button className="feed-connect-btn">Connect</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The "Trending Topics" box (right column)
function TrendingTopics() {
  return (
    <div className="feed-side-card">
      <h3 className="feed-space-title">Trending Topics</h3>
      <ul className="feed-space-list">
        {/* Makes one row for each topic in the topics list */}
        {topics.map((topic) => (
          <li key={topic.id} className="feed-topic">
            {/* The "#" is plain text, so it shows as a hashtag like #Internships */}
            <span>#{topic.tag}</span>
            {/* How many posts use the topic, like "860 posts" */}
            <span>{topic.posts}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The "start a post" box at the top of the middle column.
// It's only for looks right now: typing and clicking don't post anything yet.
function PostComposer() {
  return (
    <div className="feed-composer">
      {/* Top row: your circle next to the typing box */}
      <div className="feed-composer-top">
        <div className="feed-post-avatar">RMV</div>
        {/* The label tells screen readers what this box is for (WCAG).
            htmlFor="feed-composer" connects it to the input with id="feed-composer".
            "sr-only" (screen reader only) hides it on the screen, but screen
            readers still read it. The placeholder alone isn't enough,
            because it disappears once you start typing */}
        <label htmlFor="feed-composer" className="sr-only">
          Write a post
        </label>
        {/* placeholder is the gray hint text that shows while the box is empty */}
        <input
          id="feed-composer"
          className="feed-composer-input"
          placeholder="Type here..."
        />
      </div>
      {/* Bottom row of buttons. It uses the same button style as the posts */}
      <div className="feed-post-actions">
        <button>Photo</button>
        <button>Event</button>
        <button>Article</button>
      </div>
    </div>
  );
}

// One post in the middle column.
// "props" holds the info passed in by Feed below. For example,
// <Post author="David Ripalda" /> makes props.author equal "David Ripalda".
function Post(props) {
  // "liked" remembers whether you clicked Like on this post. It starts as false.
  // Each post gets its own "liked", so liking one post doesn't like the others.
  const [liked, setLiked] = useState(false);
  return (
    // "feed-post" is the white box around the post
    <div className="feed-post">
      {/* Top of the post: the circle, then the name, headline, and time stacked */}
      <div className="feed-post-header">
        <div className="feed-post-avatar">{props.initials}</div>
        <div>
          <p className="feed-post-author">{props.author}</p>
          <p className="feed-post-headline">{props.headline}</p>
          <p className="feed-post-time">{props.time}</p>
        </div>
      </div>
      {/* What the post says */}
      <p className="feed-post-text">{props.text}</p>
      <div className="feed-post-counts">
        {/* "liked ? A : B" means: if liked is true, use A. Otherwise, use B.
            So the count goes up by 1 while you have the post liked */}
        <span>{liked ? props.likes + 1 : props.likes} reactions</span>
        <span>{props.comments} comments</span>
      </div>
      <div className="feed-post-actions">
        {/* Clicking Like flips "liked": false becomes true, true becomes false.
            ("!" means "the opposite of".)
            While liked, the button gets the "feed-liked" class,
            which makes it blue and bold (see index.css).
            aria-pressed={liked} tells screen readers this is an on/off button
            and whether it's on right now, like "Liked, toggle button, pressed" (WCAG) */}
        <button
          onClick={() => setLiked(!liked)}
          className={liked ? "feed-liked" : ""}
          aria-pressed={liked}
        >
          {/* The button's words change too */}
          {liked ? "Liked" : "Like"}
        </button>
        {/* These two don't do anything yet */}
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
}

// The bar across the top of the Feed page. It stays at the top while you scroll.
function FeedNav() {
  return (
    // <nav> tells screen readers this is the site's navigation (WCAG)
    <nav className="feed-nav">
      {/* Left side: the site name and the search box */}
      <div className="feed-nav-left">
        <span className="feed-nav-logo">ScoutSearch</span>
        {/* A hidden label for screen readers, like the one in the post box (WCAG) */}
        <label htmlFor="feed-search" className="sr-only">
          Search
        </label>
        {/* The search box. It doesn't search yet */}
        <input
          id="feed-search"
          className="feed-nav-search"
          placeholder="Search..."
        />
      </div>
      {/* Right side: links to other pages, then your circle.
          href="#" means the links don't go anywhere yet */}
      <div className="feed-nav-right">
        <a href="#">Home</a>
        <a href="#">Network</a>
        <a href="#">Messages</a>
        <div className="feed-post-avatar">RMV</div>
      </div>
    </nav>
  );
}

// Feed is the whole page. It puts all the pieces above together.
function Feed() {
  return (
    // <> </> is a "fragment": an invisible wrapper. A component can only
    // return one thing, so this groups the top bar and the page together
    <>
      {/* The top bar */}
      <FeedNav />
      {/* <main> is the main content of the page (screen readers can jump to it).
          "feed-page" splits it into the 3 columns */}
      <main className="feed-page">
        {/* Left column. <aside> means side content */}
        <aside className="feed-left">
          <ProfileCard />
          <YourSpace />
        </aside>
        {/* Middle column: the post box, then all the posts */}
        <section className="feed-middle">
          <PostComposer />
          {/* Makes one <Post> for each post in the posts list.
              Each line like author={post.author} passes one piece of info
              into the Post component, where it becomes props.author */}
          {posts.map((post) => (
            <Post
              key={post.id}
              author={post.author}
              initials={post.initials}
              headline={post.headline}
              time={post.time}
              text={post.text}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </section>

        {/* Right column: suggestions */}
        <aside className="feed-right">
          <PeopleToKnow />
          <TrendingTopics />
        </aside>
      </main>
    </>
  );
}

// "export default" lets other files import Feed (App.jsx does this).
export default Feed;
