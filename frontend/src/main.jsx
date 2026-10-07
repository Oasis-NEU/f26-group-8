// main.jsx is the very first file that runs. It starts React and puts the
// whole app onto the web page.

// StrictMode: a helper from React that warns you about mistakes while you're
// developing. It shows nothing on the page and is turned off on the real site.
import { StrictMode } from 'react'
// createRoot: tells React which spot on the web page it is in charge of.
import { createRoot } from 'react-dom/client'
// BrowserRouter: lets the app have different pages (/about, /login, /signup)
// by watching the web address bar.
import { BrowserRouter } from 'react-router'
// Loads all the styles (colors, sizes, spacing) for the whole site.
import './index.css'
// App is the component that decides which page to show (see App.jsx).
import App from './App.jsx'

// index.html has an empty <div id="root"></div>. This line finds that div
// and tells React to draw the app inside it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Everything inside BrowserRouter can use pages and links */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
