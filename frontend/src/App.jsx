// App.jsx decides which page to show, based on the web address.
// For example, going to /login shows the Login page.

// Routes: a group of all the pages.
// Route: one page. It matches a web address (path) to a component (element).
// Navigate: sends the visitor to a different address automatically.
import { Routes, Route, Navigate } from "react-router";
// Each page lives in its own file inside the pages folder.
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Network from "./pages/Network.jsx";
import Messages from "./pages/Messages.jsx";
import Settings from "./pages/Settings.jsx";

// A "component" is a function that returns what should appear on the screen.
function App() {
  return (
    <Routes>
      {/* "/" is the homepage. It sends visitors straight to the About page */}
      <Route path="/" element={<Navigate to="/about" />} />
      {/* yoursite.com/about shows the About page */}
      <Route path="/about" element={<About />} />
      {/* yoursite.com/login shows the Login page */}
      <Route path="/login" element={<Login />} />
      {/* yoursite.com/signup shows the Signup page */}
      <Route path="/signup" element={<Signup />} />
      {/* yoursite.com/feed shows the Feed page */}
      <Route path="/feed" element={<Feed />} />
      {/* yoursite.com/profile shows the Profile page */}
      <Route path="/profile" element={<Profile />} />
      {/* yoursite.com/profile shows the EditProfile page */}
      <Route path="/editprofile" element={<EditProfile />} />
      {/* yoursite.com/network shows the Network page */}
      <Route path="/network" element={<Network />} />
      {/* yoursite.com/messages shows the Messages page */}
      <Route path="/messages" element={<Messages />} />
      {/* yoursite.com/settings shows the Settings page */}
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

// "export default" lets other files import App (main.jsx does this).
export default App;
