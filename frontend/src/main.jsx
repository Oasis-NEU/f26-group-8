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
// The choices from the Settings page (colors, fonts, text size, ...), see settings.js
import { loadSettings, applySettings } from './settings.js'
// ThemeProvider keeps track of Light / Dark / System for every page
// (components/ThemeProvider.jsx)
import ThemeProvider from './components/ThemeProvider.jsx'

// Put the saved Settings choices into effect before anything is drawn,
// so the page doesn't flash in the default colors first
applySettings(loadSettings())

// index.html has an empty <div id="root"></div>. This line finds that div
// and tells React to draw the app inside it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Everything inside BrowserRouter can use pages and links.
        useTransitions={false} makes a page change happen right away instead of
        a moment later, which the smooth fade between pages (SmoothLink) needs */}
    <BrowserRouter useTransitions={false}>
      {/* Everything inside ThemeProvider can use useTheme(), so every
          page gets light and dark mode, including pages added later */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
