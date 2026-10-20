// AccountMenu.jsx is your circle in the top bar, and the dropdown that opens
// when you click it. The dropdown has links to your profile, Settings,
// Preferences, Profile picture, and Log out.
// NavBar.jsx uses it, so it shows up on every page that has the top bar.
// The styles are in index.css, under "Top bar: account menu".
//
// How it closes: click the circle again, click anywhere else on the page,
// press Escape, Tab out of it, or pick one of the items.

// useState lets the menu remember if it's open or closed.
// useRef keeps a reference to something on the screen (here: the circle and the menu).
// useEffect runs a bit of code after the page has been redrawn.
import { useEffect, useRef, useState } from "react";
// Link makes a clickable link to another page of our site.
import { Link } from "react-router";
// markLoggedOut forgets that you're logged in (login-status.js)
import { markLoggedOut } from "../login-status.js";

function AccountMenu() {
  // "open" is true while the dropdown is showing. It starts closed (false)
  const [open, setOpen] = useState(false);

  // The wrapper around the circle and the dropdown, so the code can tell
  // whether a click happened inside the menu or somewhere else
  const menuRef = useRef(null);
  // The circle button, so the code can put the keyboard focus back on it
  const buttonRef = useRef(null);

  // While the menu is open, listen for clicks outside it and for the Escape key.
  // The "return" part stops listening once the menu closes (or the page is left)
  useEffect(() => {
    if (!open) return;

    // A click anywhere that isn't inside the menu closes it
    function handleClickOutside(event) {
      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Escape closes it and puts the keyboard focus back on the circle,
    // so keyboard users don't get lost (WCAG)
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Runs when the keyboard focus leaves something inside the menu.
  // event.relatedTarget is where the focus went. If it went somewhere
  // outside the menu (for example, Tab past the last item), close it
  function handleBlur(event) {
    if (!menuRef.current.contains(event.relatedTarget)) {
      setOpen(false);
    }
  }

  // Closes the menu. Each item runs this when it's clicked
  function closeMenu() {
    setOpen(false);
  }

  // Runs when "Log out" is clicked: forgets the login, then closes the menu
  function handleLogOut() {
    markLoggedOut();
    setOpen(false);
  }

  return (
    <div className="account-menu" ref={menuRef} onBlur={handleBlur}>
      {/* Your circle. Clicking it opens or closes the dropdown
          ("!open" means "the opposite of open").
          aria-expanded tells screen readers if the dropdown is open, and
          aria-controls says which part of the page it opens (WCAG).
          aria-label gives it a name, because "RMV" alone doesn't say what it does */}
      <button
        type="button"
        ref={buttonRef}
        className="feed-post-avatar account-menu-button"
        aria-expanded={open}
        aria-controls="account-menu-list"
        aria-label="Account menu"
        onClick={() => setOpen(!open)}
      >
        RMV
      </button>

      {/* "open && (...)" means "only draw the dropdown while it's open" */}
      {open && (
        <div id="account-menu-list" className="account-menu-list">
          {/* Your name and a link to your profile.
              It's always the same made-up person for now */}
          <div className="account-menu-header">
            <p className="account-menu-name">Roemer Mallari</p>
            <Link to="/profile" className="account-menu-item account-menu-profile-link" onClick={closeMenu}>
              View profile
            </Link>
          </div>

          {/* The items. It's a list (<ul>), so screen readers say how many there are */}
          <ul>
            <li>
              <Link to="/settings" className="account-menu-item" onClick={closeMenu}>
                Settings
              </Link>
            </li>
            {/* "#preferences" opens the Preferences tab on the Settings page */}
            <li>
              <Link to="/settings#preferences" className="account-menu-item" onClick={closeMenu}>
                Preferences
              </Link>
            </li>
            <li>
              <Link to="/settings#account" className="account-menu-item" onClick={closeMenu}>
                Profile picture
              </Link>
            </li>
          </ul>

          {/* The thin line above Log out. It's only decoration */}
          <div className="account-menu-divider" aria-hidden="true"></div>

          {/* Log out forgets the login (see login-status.js) and goes to the Log in page */}
          <Link to="/login" className="account-menu-item" onClick={handleLogOut}>
            Log out
          </Link>
        </div>
      )}
    </div>
  );
}

// "export default" lets other files import AccountMenu (NavBar.jsx does this).
export default AccountMenu;
