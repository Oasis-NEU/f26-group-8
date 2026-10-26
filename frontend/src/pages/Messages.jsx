// Messages.jsx is the Messages page (yoursite.com/messages).
// On the left is the list of your conversations; on the right is the
// conversation you picked, with a box at the bottom to type a message.
// On phones there's only room for one side, so it shows the list first,
// then the conversation after you pick one (with a Back button).
// The conversations come from the backend (see "What the backend sends"
// below), and messages you send are saved there, so they're still there
// after a refresh and the other person can see them.
// The styles for this page are in index.css, under "Messages page".

// useState lets the page remember a value and redraw itself when it changes.
// useEffect runs a bit of code after the page has been redrawn.
// useRef keeps a reference to something on the screen (like the typing box),
// so the code can scroll it or move the keyboard focus to it.
import { useEffect, useRef, useState } from 'react';
// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from '../components/NavBar.jsx';
// api talks to our backend and sends your login token along (api.js)
import { api } from '../api.js';

// ---------- What the backend sends ----------
// GET /api/conversations sends back a list like this, one item per person
// you've messaged:
// [
//     {
//         id: '...',             // the other person's profile id
//         name: 'Maya Chen',
//         initials: 'MC',
//         headline: 'Junior @ Boston Latin School',
//         unread: false,         // true if they sent something you haven't opened
//         messages: [            // oldest first
//             { id: 1, from: 'them', text: 'Hi!', created_at: '2026-10-26T14:12:00Z' },
//         ],
//     },
// ]
// "from" is 'them' for their messages and 'me' for yours. The backend can
// tell which is which because your login token says who you are.
// POST /api/messages takes { receiverId, text } and sends back the saved
// message, in the same shape as one item in "messages".
// POST /api/conversations/<their id>/read marks that conversation as read,
// so it isn't "unread" again after a refresh. It doesn't need to send anything back.
// This has to match what the backend team (Anthony) builds, so if either
// side changes, change this comment too.

// True when the screen is phone-sized (760px wide or less, the same size
// where index.css shows one side at a time)
function isPhoneSize() {
    return window.matchMedia('(max-width: 760px)').matches;
}

// Turns the time the backend sends (like '2026-10-26T14:12:00Z') into
// something short to show: just the time for today ("10:12 AM"),
// or the date for older messages ("Oct 18").
// new Date(...) reads the time; toLocale... writes it the way your computer
// is set up to show times
function showTime(createdAt) {
    const date = new Date(createdAt);
    if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ---------- Pieces of the page ----------

// One conversation in the list on the left. Clicking it opens that conversation.
// "props" holds the info passed in by Messages below
function ConversationButton(props) {
    const person = props.conversation;
    // The last message, shown under the name. The list is oldest first,
    // so the last one is at position length - 1
    const lastMessage = person.messages[person.messages.length - 1];

    return (
        <li>
            {/* aria-current="true" tells screen readers which conversation is open (WCAG).
                The id lets the code move the focus back here after "Back" on phones */}
            <button
                type="button"
                id={'conversation-' + person.id}
                className={person.unread ? 'messages-person-button messages-person-unread' : 'messages-person-button'}
                aria-current={props.isOpen ? 'true' : undefined}
                onClick={props.onOpen}
            >
                {/* The circle with their initials. Their name is right next to
                    it, so screen readers skip the circle (WCAG) */}
                <span className="feed-post-avatar" aria-hidden="true">{person.initials}</span>
                <span className="messages-person-text">
                    <span className="messages-person-top">
                        <span className="messages-person-name">{person.name}</span>
                        <span className="messages-person-time">{showTime(lastMessage.created_at)}</span>
                    </span>
                    <span className="messages-person-preview">
                        {/* The blue dot is only a picture, so screen readers
                            hear the word "Unread" instead (WCAG) */}
                        {person.unread && <span className="messages-unread-dot" aria-hidden="true"></span>}
                        {person.unread && <span className="sr-only">Unread: </span>}
                        <span className="messages-person-preview-text">
                            {/* If you sent the last message, it starts with "You: " */}
                            {lastMessage.from === 'me' ? 'You: ' : ''}{lastMessage.text}
                        </span>
                    </span>
                </span>
            </button>
        </li>
    );
}

// Messages is the whole page. It puts the pieces above together.
function Messages() {
    // All the conversations. They start empty and get filled in once the
    // backend answers. Sending a message or opening an unread conversation
    // changes this, so it lives in state
    const [conversations, setConversations] = useState([]);

    // Which conversation is open (its id). null means none yet, because
    // the list hasn't loaded
    const [openId, setOpenId] = useState(null);

    // true while we're waiting for the backend to send the conversations,
    // so the page can say "Loading..."
    const [loading, setLoading] = useState(true);

    // What went wrong if the conversations didn't load ('' if nothing did)
    const [loadError, setLoadError] = useState('');

    // true while a message is on its way to the backend
    const [sending, setSending] = useState(false);

    // What went wrong if a message didn't send ('' if nothing did)
    const [sendError, setSendError] = useState('');

    // Phones only: true while the conversation is showing instead of the list
    const [showChat, setShowChat] = useState(false);

    // What's typed in the box, kept separately for each conversation, so
    // switching to another chat and back doesn't lose a half-written message.
    // It looks like { 'abc': 'Sure, how about', 'xyz': '' }, by conversation id
    const [drafts, setDrafts] = useState({});

    // The id of the message you just sent, so only that one eases in
    const [justSentId, setJustSentId] = useState(null);

    // Things on the screen the code needs to reach (see the comments where they're used)
    const threadRef = useRef(null);     // the scrolling list of messages
    const inputRef = useRef(null);      // the typing box
    const chatNameRef = useRef(null);   // the name at the top of the chat

    // When your last message finished saving (Date.now(), in milliseconds).
    // The check for new messages below uses it. It's a ref, not state,
    // because changing it doesn't need to redraw the page
    const lastSentAt = useRef(0);

    // Runs once when the page opens (the empty [] at the end means "only
    // once"): ask the backend for your conversations and open the first one.
    // Then ask again every 5 seconds, so messages other people send you show
    // up without refreshing the page
    useEffect(() => {
        function loadConversations() {
            // When this check started (see "lastSentAt" below)
            const startedAt = Date.now();
            api('/conversations')
                .then((data) => {
                    // If you sent a message while this check was waiting for the
                    // backend, this list might be from just before it saved, and
                    // your message would flash away. Skip it; the next check has it
                    if (lastSentAt.current > startedAt) return;
                    setConversations(data);
                    setLoadError('');
                    // Open the first conversation, but only if none is open yet.
                    // "(current) =>" gets the open id as it is right now.
                    // "??" means "if current is null, use the part after it"
                    setOpenId((current) => current ?? (data.length > 0 ? data[0].id : null));
                })
                .catch((error) => setLoadError(error.message))
                // .finally runs either way, whether it worked or not
                .finally(() => setLoading(false));
        }

        loadConversations();
        // setInterval runs loadConversations again every 5000 milliseconds (5 seconds).
        // document.hidden is true when this tab isn't the one you're looking
        // at, so it doesn't keep asking the backend while nobody's watching
        const timer = setInterval(() => {
            if (!document.hidden) loadConversations();
        }, 5000);
        // When you leave the page, stop checking
        return () => clearInterval(timer);
    }, []);

    // The open conversation. .find() goes through the list and gives back
    // the first one whose id matches. It's undefined while nothing is open
    // (still loading, or you have no conversations yet)
    const openConversation = conversations.find((conversation) => conversation.id === openId);
    const messageCount = openConversation ? openConversation.messages.length : 0;

    // After opening a conversation or sending a message, scroll the messages
    // to the bottom, so the newest one is in view
    useEffect(() => {
        // The messages aren't on the screen until a conversation is open
        if (!threadRef.current) return;
        threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, [openId, messageCount]);

    // true if the open conversation has a message you haven't read
    const openIsUnread = openConversation ? openConversation.unread : false;

    // When you're looking at an unread conversation (you just opened it, or a
    // new message came in while it's open), you've seen it, so mark it read:
    // tell the backend, so it stays read after a refresh, and take off the
    // "unread" mark on screen
    useEffect(() => {
        if (!openIsUnread) return;
        // On phones the list covers the chat until you tap one, so the first
        // conversation is "open" but you can't see it yet. Wait until you can
        if (isPhoneSize() && !showChat) return;

        api('/conversations/' + openId + '/read', { method: 'POST' })
            // If the backend didn't get it, it'll still say "unread" next
            // time we check for new messages, and this runs again then.
            // So there's nothing to show; just log it for us in the console (F12)
            .catch((error) => console.error('mark as read failed:', error))
            // Either way, take the mark off on screen, since you've seen it
            .finally(() => {
                setConversations((old) => old.map((conversation) =>
                    conversation.id === openId ? { ...conversation, unread: false } : conversation
                ));
            });
    }, [openIsUnread, openId, showChat]);

    // Phones only: which side was showing last time, so the code below can
    // tell when it changed. (It skips the first time the page opens)
    const shownChat = useRef(showChat);

    // Phones only: when one side is swapped for the other, the button you
    // clicked disappears, so move the keyboard focus somewhere useful (WCAG):
    // to the person's name when a chat opens, or back to that conversation
    // in the list after "Back"
    useEffect(() => {
        if (shownChat.current === showChat) return;
        shownChat.current = showChat;
        if (showChat) {
            chatNameRef.current.focus();
        } else {
            document.getElementById('conversation-' + openId).focus();
        }
    }, [showChat, openId]);

    // Runs when a conversation in the list is clicked
    function openChat(id) {
        setOpenId(id);
        setJustSentId(null);
        // An error from sending in the last chat doesn't belong to this one
        setSendError('');
        // (Taking off the "unread" mark happens in the useEffect above,
        // once the conversation is open and on screen)
        // On phones, swap the list for the chat
        if (isPhoneSize()) setShowChat(true);
    }

    // Runs when the form is sent (Send is clicked, or Enter is pressed).
    // "async" lets us "await": wait for the backend to answer before going on
    async function handleSend(event) {
        // Normally sending a form reloads the whole page. This stops that.
        event.preventDefault();
        // .trim() removes spaces at the start and end, so a message of only
        // spaces counts as empty and isn't sent
        const text = (drafts[openId] || '').trim();
        // Also stop if a message is still on its way, so pressing Enter twice
        // quickly doesn't send it twice
        if (!text || sending) return;

        // Remember who this is going to. While we wait for the backend you
        // could click another conversation, and then openId would be someone else
        const sendTo = openId;
        setSending(true);
        setSendError('');

        // "try" runs the code, and if anything in it fails, "catch" runs instead
        try {
            // Save it in the database. The backend sends back the saved message
            // (with its real id and time), so we show that one
            const newMessage = await api('/messages', {
                method: 'POST',
                // JSON.stringify turns the object into text, since that's
                // what gets sent over the internet
                body: JSON.stringify({ receiverId: sendTo, text: text }),
            });
            // Remember when it saved, so a check for new messages that
            // started before this doesn't hide it (see loadConversations)
            lastSentAt.current = Date.now();

            // Add it to the end of that conversation's messages.
            // "(old) =>" uses the newest list. While we were waiting for the
            // backend the list could have changed, so "conversations" might be out of date
            setConversations((old) => old.map((conversation) =>
                conversation.id === sendTo
                    ? { ...conversation, messages: [...conversation.messages, newMessage] }
                    : conversation
            ));
            setJustSentId(newMessage.id);

            // Empty the box (only now that it's saved, so nothing is lost if it fails)
            setDrafts((old) => ({ ...old, [sendTo]: '' }));
        } catch (error) {
            // It didn't save. What they typed stays in the box so they can try again
            setSendError(error.message);
        }

        setSending(false);
        // Keep the focus in the box so you can type the next message right
        // away (clicking Send would otherwise move the focus to the button)
        inputRef.current.focus();
    }

    // The line under the title: what's happening with the list, if anything
    let listStatus = '';
    if (loading) {
        listStatus = 'Loading your messages...';
    } else if (loadError) {
        listStatus = loadError;
    } else if (conversations.length === 0) {
        listStatus = 'No messages yet.';
    }

    return (
        // "messages-site" makes the page exactly one screen tall, so only the
        // lists inside scroll (see index.css)
        <div className="messages-site">
            {/* <title> is the name shown on the browser tab (WCAG) */}
            <title>Messages | ScoutSearch</title>
            <NavBar />
            <main className="messages-page">
                {/* The big box. On phones, "messages-panel-showing-chat"
                    swaps the list for the chat */}
                <div className={showChat ? 'messages-panel messages-panel-showing-chat' : 'messages-panel'}>

                    {/* Left: the list of conversations */}
                    <section className="messages-list-column" aria-labelledby="messages-title">
                        {/* <h1> is the main heading. Each page should have only one */}
                        <h1 id="messages-title" className="messages-title">Messages</h1>
                        {/* "Loading...", "No messages yet.", or what went wrong.
                            role="status" makes screen readers read it out when it changes (WCAG) */}
                        <p className="messages-status" role="status">{listStatus}</p>
                        <ul className="messages-list">
                            {conversations.map((conversation) => (
                                <ConversationButton
                                    key={conversation.id}
                                    conversation={conversation}
                                    isOpen={conversation.id === openId}
                                    onOpen={() => openChat(conversation.id)}
                                />
                            ))}
                        </ul>
                    </section>

                    {/* Right: the open conversation. "&&" means only show it
                        once there is one (not while loading or with no conversations) */}
                    {openConversation && (
                        <section className="messages-chat-column" aria-labelledby="messages-chat-name">
                            {/* Who you're talking to */}
                            <div className="messages-chat-header">
                                {/* Phones only (index.css hides it on bigger screens) */}
                                <button
                                    type="button"
                                    className="messages-back-button"
                                    aria-label="Back to conversations"
                                    onClick={() => setShowChat(false)}
                                >
                                    Back
                                </button>
                                <span className="feed-post-avatar" aria-hidden="true">{openConversation.initials}</span>
                                <div>
                                    {/* tabIndex={-1} lets the code focus the name on phones
                                        (see the useEffect above) without adding it to the Tab order */}
                                    <h2 id="messages-chat-name" className="messages-chat-name" ref={chatNameRef} tabIndex={-1}>
                                        {openConversation.name}
                                    </h2>
                                    <p className="messages-chat-headline">{openConversation.headline}</p>
                                </div>
                            </div>

                            {/* The messages. role="log" tells screen readers that new
                                messages get added at the end, so they read out each new
                                one (WCAG). key={openId} builds it fresh for each
                                conversation, so switching doesn't read out the whole chat */}
                            <div
                                className="messages-thread"
                                ref={threadRef}
                                key={openId}
                                role="log"
                                aria-label={'Messages with ' + openConversation.name}
                            >
                                {openConversation.messages.map((message) => {
                                    // Your messages get the "from-me" class (on the right,
                                    // in blue). The one you just sent also gets "new" (it eases in)
                                    let rowClass = 'messages-bubble-row';
                                    if (message.from === 'me') rowClass += ' messages-bubble-row-from-me';
                                    if (message.id === justSentId) rowClass += ' messages-bubble-row-new';

                                    return (
                                        <div key={message.id} className={rowClass}>
                                            <p className="messages-bubble">
                                                {/* Screen readers can't see which side a bubble
                                                    is on, so they hear who said it (WCAG) */}
                                                <span className="sr-only">
                                                    {message.from === 'me' ? 'You' : openConversation.name} said:{' '}
                                                </span>
                                                {message.text}
                                            </p>
                                            <p className="messages-bubble-time">{showTime(message.created_at)}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* What went wrong if a message didn't send. It's here, next
                                to the typing box, because on phones the list (and its
                                status line) is hidden while a chat is open */}
                            <p className="messages-status" role="status">{sendError}</p>

                            {/* The typing box and Send button */}
                            <form className="messages-composer" onSubmit={handleSend}>
                                {/* A hidden label for screen readers: "Message Maya Chen" (WCAG) */}
                                <label htmlFor="messages-input" className="sr-only">
                                    {'Message ' + openConversation.name}
                                </label>
                                {/* value and onChange keep what's typed in "drafts" (above),
                                    under this conversation's id. autoComplete="off" stops
                                    the browser from suggesting old messages */}
                                <input
                                    id="messages-input"
                                    ref={inputRef}
                                    className="messages-input"
                                    placeholder="Write a message..."
                                    autoComplete="off"
                                    value={drafts[openId] || ''}
                                    onChange={(event) => setDrafts({ ...drafts, [openId]: event.target.value })}
                                />
                                <button type="submit" className="messages-send-button">Send</button>
                            </form>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Messages;
