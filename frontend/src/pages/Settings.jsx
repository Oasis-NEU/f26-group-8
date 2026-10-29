// Settings.jsx is the Settings page (yoursite.com/settings).
// You get here from the dropdown under your circle in the top bar.
// It has a column of tabs on the left. Clicking one shows its box on the right:
//   Account          your name, email, and profile picture (coming soon)
//   Preferences      the kinds of jobs you want to see (coming soon)
//   Appearance       light or dark, the site's colors, and heading style
//   Privacy & data   who can see your profile and what's on it
//   Accessibility    font, text size, contrast, spacing, motion, ...
// Appearance and Accessibility work right away, on every page. The choices
// are saved in this browser (see settings.js). Privacy is saved too, but it
// won't change what others see until the site is connected to the backend.
// The styles for this page are in index.css, under "Settings page".

// useState lets the page remember a value and redraw itself when it changes.
// useRef keeps a reference to something on the screen (here: the tabs),
// so the code can move the keyboard focus to them.
import { useRef, useState } from 'react';
// useLocation tells the page what the web address is, including the "#..." at the end.
// useNavigate lets the page change the web address.
import { useLocation, useNavigate } from 'react-router';
// NavBar is the bar across the top of the page (components/NavBar.jsx).
import NavBar from '../components/NavBar.jsx';
// The code that saves the choices and puts them into effect (settings.js)
import { applySettings, defaultSettings, loadSettings, saveSettings } from '../settings.js';
// useTheme reads and changes Light / Dark / System (theme.js). It's the same
// choice as the sun/moon button in the top bar, so both always agree
import { useTheme } from '../theme.js';

// ---------- The tabs ----------
// The "id" is also the end of the web address: yoursite.com/settings#privacy
// opens the Privacy & data tab. That's how the dropdown's links open a tab.
const tabs = [
    { id: 'account', label: 'Account' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'privacy', label: 'Privacy & data' },
    { id: 'accessibility', label: 'Accessibility' },
];

// Which settings each tab's "Reset" button puts back to normal
const appearanceSettings = ['palette', 'headings'];
const privacySettings = ['profileVisibility', 'shareEmail', 'shareSchool', 'shareConnections', 'shareProfileViews', 'shareResume', 'allowMessages'];
const accessibilitySettings = ['font', 'textSize', 'highContrast', 'textSpacing', 'underlineLinks', 'reduceMotion', 'strongFocus'];

// ---------- Pieces of the page ----------

// A group of choices where you pick ONE (radio buttons), like "Color theme".
// props.options is the list of choices, props.value is the one that's picked,
// and props.onChange runs with the new value when another one is picked.
// <fieldset> and <legend> group them under one title, which screen readers
// read along with each choice (WCAG)
function ChoiceGroup(props) {
    return (
        <fieldset className="settings-group">
            <legend className="settings-legend">{props.legend}</legend>
            {props.hint && <p className="settings-hint">{props.hint}</p>}
            <div className="settings-choices">
                {props.options.map((option) => (
                    // The whole box is the label, so clicking anywhere on it picks it
                    <label key={option.value} className="settings-choice">
                        {/* Radio buttons with the same "name" are one group:
                            picking one un-picks the others */}
                        <input
                            type="radio"
                            name={props.name}
                            value={option.value}
                            checked={props.value === option.value}
                            onChange={() => props.onChange(option.value)}
                        />
                        {/* The two-color circle, only on the Color theme choices.
                            It's decoration, since the name says the same thing */}
                        {option.swatch && (
                            <span className={'settings-swatch settings-swatch-' + option.value} aria-hidden="true"></span>
                        )}
                        <span className="settings-choice-text">
                            <span className="settings-choice-label">{option.label}</span>
                            {option.description && (
                                <span className="settings-choice-description">{option.description}</span>
                            )}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

// One on/off choice (a checkbox), like "High contrast".
// props.checked is true when it's on. props.onChange runs with true or false
function Toggle(props) {
    return (
        <label className="settings-choice">
            <input
                type="checkbox"
                checked={props.checked}
                onChange={(event) => props.onChange(event.target.checked)}
            />
            <span className="settings-choice-text">
                <span className="settings-choice-label">{props.label}</span>
                <span className="settings-choice-description">{props.description}</span>
            </span>
        </label>
    );
}

// Settings is the whole page. It puts the pieces above together.
function Settings() {
    // All the choices, read from the browser when the page opens.
    // (Passing loadSettings without () means "only read them the first time")
    const [settings, setSettings] = useState(loadSettings);

    // The message next to a Reset button, or after "Download my data"
    const [message, setMessage] = useState('');

    // Light / Dark / System (see theme.js)
    const { theme, setTheme } = useTheme();

    // The tab buttons, so the arrow keys can move the keyboard focus between them
    const tabRefs = useRef([]);

    const location = useLocation();
    const navigate = useNavigate();

    // Which tab is open comes from the end of the web address.
    // "#privacy".slice(1) is "privacy". If it isn't one of the tabs (or there's
    // nothing there), the Account tab is open
    const hashId = location.hash.slice(1);
    const activeTab = tabs.some((tab) => tab.id === hashId) ? hashId : 'account';

    // Opens a tab by changing the end of the web address.
    // "replace" means switching tabs doesn't fill up the Back button's history
    function openTab(id) {
        setMessage('');
        navigate({ hash: '#' + id }, { replace: true });
    }

    // The arrow keys move between tabs, like they do in tabs on a computer.
    // Home and End jump to the first and last tab (WCAG)
    function handleTabKeyDown(event, index) {
        let next = null;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        // Any other key: do nothing special
        if (next === null) return;

        // Stops the arrow keys from also scrolling the page
        event.preventDefault();
        openTab(tabs[next].id);
        tabRefs.current[next].focus();
    }

    // Changes one choice, then saves all of them and puts them into effect.
    // [name]: value means "the setting called whatever is in name", so
    // changeSetting('palette', 'mint') sets settings.palette to 'mint'
    function changeSetting(name, value) {
        const newSettings = { ...settings, [name]: value };
        setSettings(newSettings);
        saveSettings(newSettings);
        applySettings(newSettings);
        setMessage('');
    }

    // Puts the listed settings back to how they started
    function resetSettings(names) {
        const newSettings = { ...settings };
        names.forEach((name) => {
            newSettings[name] = defaultSettings[name];
        });
        setSettings(newSettings);
        saveSettings(newSettings);
        applySettings(newSettings);
        setMessage('Back to the defaults.');
    }

    return (
        <>
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>Settings | ScoutSearch</title>
            <NavBar />

            <main className="settings-page">
                <h1 className="settings-title">Settings</h1>

                <div className="settings-layout">
                    {/* The column of tabs. role="tablist" and role="tab" tell screen
                        readers these are tabs, so they say "tab, 3 of 5" (WCAG).
                        Only the open tab is a Tab-key stop (tabIndex 0); the arrow
                        keys move between the others (tabIndex -1) */}
                    <div className="settings-tabs" role="tablist" aria-label="Settings sections" aria-orientation="vertical">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                id={'settings-tab-' + tab.id}
                                aria-selected={activeTab === tab.id}
                                aria-controls={'settings-panel-' + tab.id}
                                tabIndex={activeTab === tab.id ? 0 : -1}
                                className="settings-tab"
                                // Saves this button in the list, so handleTabKeyDown can focus it
                                ref={(element) => { tabRefs.current[index] = element; }}
                                onClick={() => openTab(tab.id)}
                                onKeyDown={(event) => handleTabKeyDown(event, index)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* The boxes, one per tab. Every box is always on the page, but
                        "hidden" hides all but the open one. role="tabpanel" and
                        aria-labelledby connect each box to its tab (WCAG) */}
                    <div>
                        {/* ----- Account ----- */}
                        <section
                            id="settings-panel-account"
                            role="tabpanel"
                            aria-labelledby="settings-tab-account"
                            hidden={activeTab !== 'account'}
                            className="settings-panel"
                        >
                            <h2 className="settings-panel-title">Account</h2>
                            <p className="settings-text">Change your name, email, and password here. Coming soon.</p>

                            <div className="settings-group">
                                <h3 className="settings-legend">Profile picture</h3>
                                <div className="settings-picture-row">
                                    {/* Your current circle. It's decoration, because the
                                        text next to it explains it (WCAG) */}
                                    <div className="feed-post-avatar" aria-hidden="true">RMV</div>
                                    <p className="settings-text">Uploading a new picture is coming soon. For now, your initials are shown.</p>
                                </div>
                            </div>
                        </section>

                        {/* ----- Preferences ----- */}
                        <section
                            id="settings-panel-preferences"
                            role="tabpanel"
                            aria-labelledby="settings-tab-preferences"
                            hidden={activeTab !== 'preferences'}
                            className="settings-panel"
                        >
                            <h2 className="settings-panel-title">Preferences</h2>
                            <p className="settings-text">
                                Pick the kinds of jobs you want to see (internships, co-ops,
                                research positions) and how you get notified. Coming soon.
                            </p>
                        </section>

                        {/* ----- Appearance ----- */}
                        <section
                            id="settings-panel-appearance"
                            role="tabpanel"
                            aria-labelledby="settings-tab-appearance"
                            hidden={activeTab !== 'appearance'}
                            className="settings-panel"
                        >
                            <h2 className="settings-panel-title">Appearance</h2>
                            <p className="settings-text">Change how ScoutSearch looks. Changes show up right away, on every page.</p>

                            {/* The same choice as the sun/moon button in the top bar */}
                            <ChoiceGroup
                                legend="Light or dark"
                                name="theme"
                                value={theme}
                                onChange={(value) => {
                                    setTheme(value);
                                    setMessage('');
                                }}
                                options={[
                                    { value: 'light', label: 'Light', description: 'Always light' },
                                    { value: 'dark', label: 'Dark', description: 'Always dark' },
                                    { value: 'system', label: 'System', description: 'Match your device' },
                                ]}
                            />

                            <ChoiceGroup
                                legend="Colors"
                                name="palette"
                                value={settings.palette}
                                onChange={(value) => changeSetting('palette', value)}
                                options={[
                                    { value: 'blue', label: 'Blue', description: 'The normal look', swatch: true },
                                    { value: 'mint', label: 'Mint', description: 'Soft green-blue', swatch: true },
                                    { value: 'lavender', label: 'Lavender', description: 'Soft purple-blue', swatch: true },
                                ]}
                            />

                            <ChoiceGroup
                                legend="Heading style"
                                hint="The font used for the big titles on each page."
                                name="headings"
                                value={settings.headings}
                                onChange={(value) => changeSetting('headings', value)}
                                options={[
                                    { value: 'classic', label: 'Classic', description: 'The same font as the text' },
                                    { value: 'sign', label: 'Road sign', description: 'Bold, like highway signs' },
                                ]}
                            />

                            <div className="settings-footer">
                                {/* Puts the colors and headings back, and Light or dark back to System */}
                                <button
                                    type="button"
                                    className="settings-button"
                                    onClick={() => {
                                        setTheme('system');
                                        resetSettings(appearanceSettings);
                                    }}
                                >
                                    Reset appearance
                                </button>
                                {/* role="status" makes screen readers read the message out loud (WCAG) */}
                                <p role="status" className="settings-message">{activeTab === 'appearance' ? message : ''}</p>
                            </div>
                        </section>

                        {/* ----- Privacy & data ----- */}
                        <section
                            id="settings-panel-privacy"
                            role="tabpanel"
                            aria-labelledby="settings-tab-privacy"
                            hidden={activeTab !== 'privacy'}
                            className="settings-panel"
                        >
                            <h2 className="settings-panel-title">Privacy &amp; data</h2>
                            <p className="settings-text">
                                Choose who can see your profile and what's on it. These are saved in
                                this browser for now, and will take effect once the site is connected
                                to the backend.
                            </p>

                            <ChoiceGroup
                                legend="Who can see your profile"
                                name="profileVisibility"
                                value={settings.profileVisibility}
                                onChange={(value) => changeSetting('profileVisibility', value)}
                                options={[
                                    { value: 'everyone', label: 'Everyone', description: 'Anyone on ScoutSearch, including job listers' },
                                    { value: 'members', label: 'Students only', description: 'Other students, but not job listers' },
                                    { value: 'connections', label: 'Only connections', description: 'People you have connected with' },
                                ]}
                            />

                            {/* A group of on/off choices. It's a <fieldset> too, so screen
                                readers read "What to share on your profile" with each one */}
                            <fieldset className="settings-group">
                                <legend className="settings-legend">What to share on your profile</legend>
                                <div className="settings-choices">
                                    <Toggle label="School" description="Where you go to school" checked={settings.shareSchool} onChange={(value) => changeSetting('shareSchool', value)} />
                                    <Toggle label="Email" description="Your email address" checked={settings.shareEmail} onChange={(value) => changeSetting('shareEmail', value)} />
                                    <Toggle label="Connections" description="How many connections you have" checked={settings.shareConnections} onChange={(value) => changeSetting('shareConnections', value)} />
                                    <Toggle label="Profile views" description="How many people viewed your profile" checked={settings.shareProfileViews} onChange={(value) => changeSetting('shareProfileViews', value)} />
                                    <Toggle label="Resume" description="Job listers can open your resume" checked={settings.shareResume} onChange={(value) => changeSetting('shareResume', value)} />
                                </div>
                            </fieldset>

                            <fieldset className="settings-group">
                                <legend className="settings-legend">Messages</legend>
                                <div className="settings-choices">
                                    <Toggle label="Messages from job listers" description="Companies can message you about jobs" checked={settings.allowMessages} onChange={(value) => changeSetting('allowMessages', value)} />
                                </div>
                            </fieldset>

                            {/* Your data. These buttons only show a message for now,
                                because the data lives on the backend */}
                            <div className="settings-group">
                                <h3 className="settings-legend">Your data</h3>
                                <p className="settings-hint">Get a copy of everything ScoutSearch has saved about you, or delete your account.</p>
                                <div className="settings-footer">
                                    <button type="button" className="settings-button" onClick={() => setMessage('Downloading your data will work once the site is connected to the backend.')}>
                                        Download my data
                                    </button>
                                    <button type="button" className="settings-button settings-button-danger" onClick={() => setMessage('Deleting your account will work once the site is connected to the backend.')}>
                                        Delete my account
                                    </button>
                                </div>
                            </div>

                            <div className="settings-footer">
                                <button type="button" className="settings-button" onClick={() => resetSettings(privacySettings)}>
                                    Reset privacy
                                </button>
                                <p role="status" className="settings-message">{activeTab === 'privacy' ? message : ''}</p>
                            </div>
                        </section>

                        {/* ----- Accessibility ----- */}
                        <section
                            id="settings-panel-accessibility"
                            role="tabpanel"
                            aria-labelledby="settings-tab-accessibility"
                            hidden={activeTab !== 'accessibility'}
                            className="settings-panel"
                        >
                            <h2 className="settings-panel-title">Accessibility</h2>
                            <p className="settings-text">Make ScoutSearch easier to see, read, and use. Changes show up right away, on every page.</p>

                            <ChoiceGroup
                                legend="Font"
                                name="font"
                                value={settings.font}
                                onChange={(value) => changeSetting('font', value)}
                                options={[
                                    { value: 'default', label: 'Default', description: "The site's normal fonts" },
                                    { value: 'readable', label: 'Easy to read', description: 'Atkinson Hyperlegible, made for low vision' },
                                    { value: 'wide', label: 'Wide letters', description: 'Verdana, with roomy letters' },
                                ]}
                            />

                            {/* Text size: a slider you drag left (smaller) or right (bigger).
                                The <label> is its title, and htmlFor ties it to the slider,
                                so screen readers say "Text size" when they reach it (WCAG) */}
                            <div className="settings-group">
                                <label htmlFor="settings-text-size" className="settings-legend">Text size</label>
                                <p id="settings-text-size-hint" className="settings-hint">
                                    Drag the slider, or use the arrow keys, to make the text and everything around it bigger.
                                </p>
                                <div className="settings-slider-row">
                                    {/* A small "A" and a big "A" at each end, showing which way is bigger.
                                        They're decoration, so screen readers skip them (WCAG) */}
                                    <span className="settings-slider-small-a" aria-hidden="true">A</span>
                                    {/* type="range" is the browser's own slider, so it already works
                                        with the mouse, a finger, and the arrow keys.
                                        min/max/step: from 100% to 150%, 1% at a time, so you can pick any size in between.
                                        aria-valuetext makes screen readers say "125%", not just "125" (WCAG) */}
                                    <input
                                        type="range"
                                        id="settings-text-size"
                                        className="settings-slider"
                                        min="100"
                                        max="150"
                                        step="1"
                                        value={settings.textSize}
                                        aria-describedby="settings-text-size-hint"
                                        aria-valuetext={settings.textSize + '%'}
                                        // How far along the knob is: 0 at 100%, 1 at 150%.
                                        // index.css uses it to color the track blue up to the knob.
                                        // (This is the only style set in JSX, because it changes
                                        // as you drag. The look itself stays in index.css)
                                        style={{ '--slider-fill': (settings.textSize - 100) / 50 }}
                                        // While you drag, only the number next to the slider changes.
                                        // (The slider grows with the page, so changing the size mid-drag
                                        // would make it jump around under the mouse.)
                                        // Number() turns the slider's text "125" into the number 125
                                        onChange={(event) => setSettings({ ...settings, textSize: Number(event.target.value) })}
                                        // When you let go, or press an arrow key, the new size is saved and put into effect.
                                        // onBlur (leaving the slider) is a backup, in case the mouse was let go somewhere else
                                        onPointerUp={(event) => changeSetting('textSize', Number(event.target.value))}
                                        onKeyUp={(event) => changeSetting('textSize', Number(event.target.value))}
                                        onBlur={(event) => changeSetting('textSize', Number(event.target.value))}
                                    />
                                    <span className="settings-slider-big-a" aria-hidden="true">A</span>
                                    {/* The size it's on now, like "125%" */}
                                    <span className="settings-slider-value">{settings.textSize}%</span>
                                </div>
                            </div>

                            <fieldset className="settings-group">
                                <legend className="settings-legend">Reading and seeing</legend>
                                <div className="settings-choices">
                                    <Toggle label="High contrast" description="Darker text and lines that stand out more" checked={settings.highContrast} onChange={(value) => changeSetting('highContrast', value)} />
                                    <Toggle label="More text spacing" description="More room between lines, letters, and words" checked={settings.textSpacing} onChange={(value) => changeSetting('textSpacing', value)} />
                                    <Toggle label="Underline links" description="So links don't rely on color alone" checked={settings.underlineLinks} onChange={(value) => changeSetting('underlineLinks', value)} />
                                </div>
                            </fieldset>

                            <fieldset className="settings-group">
                                <legend className="settings-legend">Motion and keyboard</legend>
                                <div className="settings-choices">
                                    <Toggle label="Reduce motion" description="Turn off animations and fades" checked={settings.reduceMotion} onChange={(value) => changeSetting('reduceMotion', value)} />
                                    <Toggle label="Stronger keyboard outline" description="A thicker outline around what the Tab key reached" checked={settings.strongFocus} onChange={(value) => changeSetting('strongFocus', value)} />
                                </div>
                            </fieldset>

                            <div className="settings-footer">
                                <button type="button" className="settings-button" onClick={() => resetSettings(accessibilitySettings)}>
                                    Reset accessibility
                                </button>
                                <p role="status" className="settings-message">{activeTab === 'accessibility' ? message : ''}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

// Lets App.jsx import this page.
export default Settings
