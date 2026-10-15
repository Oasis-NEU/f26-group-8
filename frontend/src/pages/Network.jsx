// useState lets the page remember a value and redraw itself when it changes.
import {useState} from 'react';
// Link makes a clickable link to another page of our site.
import { Link } from 'react-router';
// useNavigate lets the page send the user to another page of our site.
import { useNavigate } from 'react-router';
// NavBar is the bar across the top of the page. It lives in its own file
// (components/NavBar.jsx) because the Feed page uses it too.
import NavBar from '../components/NavBar.jsx';

function Network() {
    return (
        <>
            <NavBar />
            <main>
                <h1>Network</h1>
            </main>
        </>
    );
}

export default Network;
