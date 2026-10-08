import { useState } from "react";

const spaceItems = [
  { label: "Saved posts", count: 12 },
  { label: "My communities", count: 8 },
  { label: "Upcoming events", count: 3 },
  { label: "Applications", count: 0 },
];

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

const topics = [
  { id: 1, tag: "OasisCohort", posts: "1.2k posts" },
  { id: 2, tag: "Internships", posts: "860 posts" },
  { id: 3, tag: "Hackathon", posts: "430 posts" },
];

function ProfileCard(s) {
  return (
    <div className="feed-profile-card">
      <div className="feed-profile-banner"></div>
      <div className="feed-profile-avatar">RMV</div>
      <h2 className="feed-profile-name">Roemer Mallari</h2>
      <p className="feed-profile-bio">
        Computer Science & Business Administration
      </p>
      <p className="feed-profile-school">Northeastern University</p>
      <div className="feed-profile-stats">
        <div className="feed-profile-stat">
          <p className="feed-profile-stat-number">222</p>
          <p className="feed-profile-stat-label">Connections</p>
        </div>
        <div className="feed-profile-stat">
          <p className="feed-profile-stat-number">1.2k</p>
          <p className="feed-profile-stat-label">Profile views</p>
        </div>
      </div>
      <a className="feed-profile-link" href="#">
        View your profile <span>→</span>
      </a>
    </div>
  );
}

function YourSpace() {
  return (
    <div className="feed-space-card">
      <h3 className="feed-space-title">Your space</h3>
      <ul className="feed-space-list">
        {spaceItems.map((item) => (
          <li key={item.label} className="feed-space-item">
            <span>{item.label}</span>
            <span>{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PeopleToKnow() {
  return (
    <div className="feed-side-card">
      <h3 className="feed-space-title">People to know</h3>
      <ul className="feed-space-list">
        {people.map((person) => (
          <li key={person.id} className="feed-person">
            <div className="feed-post-avatar">{person.initials}</div>
            <div className="feed-person-info">
              <p className="feed-post-author">{person.name}</p>
              <p className="feed-post-headline">{person.headline}</p>
            </div>
            <button className="feed-connect-btn">Connect</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendingTopics() {
  return (
    <div className="feed-side-card">
      <h3 className="feed-space-title">Trending Topics</h3>
      <ul className="feed-space-list">
        {topics.map((topic) => (
          <li key={topic.id} className="feed-topic">
            <span>#{topic.tag}</span>
            <span>{topic.posts}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostComposer() {
  return (
    <div className="feed-composer">
      <div className="feed-composer-top">
        <div className="feed-post-avatar">RMV</div>
        <input className="feed-composer-input" placeholder="Type here..." />
      </div>
      <div className="feed-post-actions">
        <button>Photo</button>
        <button>Event</button>
        <button>Article</button>
      </div>
    </div>
  );
}

function Post(props) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="feed-post">
      <div className="feed-post-header">
        <div className="feed-post-avatar">{props.initials}</div>
        <div>
          <p className="feed-post-author">{props.author}</p>
          <p className="feed-post-headline">{props.headline}</p>
          <p className="feed-post-time">{props.time}</p>
        </div>
      </div>
      <p className="feed-post-text">{props.text}</p>
      <div className="feed-post-counts">
        <span>{liked ? props.likes + 1 : props.likes} reactions</span>
        <span>{props.comments} comments</span>
      </div>
      <div className="feed-post-actions">
        <button
          onClick={() => setLiked(!liked)}
          className={liked ? "feed-liked" : ""}
        >
          {liked ? "Liked" : "Like"}
        </button>
        <button>Comment</button>
        <button>Share</button>
      </div>
    </div>
  );
}

function FeedNav() {
  return (
    <nav className="feed-nav">
      <div className="feed-nav-left">
        <span className="feed-nav-logo">ScoutSearch</span>
        <input className="feed-nav-search" placeholder="Search..." />
      </div>
      <div className="feed-nav-right">
        <a href="#">Home</a>
        <a href="#">Network</a>
        <a href="#">Messages</a>
        <div className="feed-post-avatar">RMV</div>
      </div>
    </nav>
  );
}
function Feed() {
  return (
    <>
      <FeedNav />
      <main className="feed-page">
        <aside className="feed-left">
          <ProfileCard />
          <YourSpace />
        </aside>
        <section className="feed-middle">
          <PostComposer />
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

        <aside className="feed-right">
          <PeopleToKnow />
          <TrendingTopics />
        </aside>
      </main>
    </>
  );
}

export default Feed;
