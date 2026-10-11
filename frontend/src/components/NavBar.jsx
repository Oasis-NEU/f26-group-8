// Separate file for NavBar as they are used in both Feed and Profile

function NavBar() {
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

export default NavBar;
