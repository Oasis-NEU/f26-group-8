// Separate file for NavBar as they are used in both Feed and Profile
// NavBar.jsx is the bar across the top of the page. It stays at the top while you scroll.
// It used to be a function inside Feed.jsx, but the Profile page needs the
// same bar. So it moved into its own file, and both pages import it with:
//   import NavBar from "../components/NavBar.jsx";
// Now a change here shows up on both pages.
// The styles are in index.css, under "Feed page". The class names still
// start with "feed-" because the bar was first made for the Feed page.

// Link makes a clickable link to another page of our site.
import { Link } from "react-router";
// AccountMenu is your circle and the dropdown it opens (components/AccountMenu.jsx).
import AccountMenu from "./AccountMenu.jsx";
// SiteLogo is the binoculars picture and the name (components/SiteLogo.jsx).
import SiteLogo from "./SiteLogo.jsx";
// The top bar
function NavBar() {
  return (
    // <nav> tells screen readers this is the site's navigation (WCAG).
    // aria-label="Main" names it, so it can be told apart from other
    // sets of links on a page (like "Profile sections" on the Profile page)
    <nav className="feed-nav" aria-label="Main">
      {/* Left side: the site name and the search box */}
      <div className="feed-nav-left">
        {/* The logo. Clicking it goes to the About page. Since you're
            logged in, its top bar shows a Home button and your circle there */}
        <Link to="/about" className="feed-nav-logo">
          <SiteLogo />
        </Link>
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
      {/* Right side: links to other pages, then your circle */}
      <div className="feed-nav-right">
        <Link to="/feed">Home</Link>
        <Link to="/network">Network</Link>
        <Link to="/messages">Messages</Link>
{/* Your circle. Clicking it opens a dropdown with View profile,
            Settings, Preferences, Profile picture, and Log out */}
        <AccountMenu />
      </div>
    </nav>
  );
}

// "export default" lets other files import NavBar (Feed.jsx and Profile.jsx do this).
export default NavBar;
