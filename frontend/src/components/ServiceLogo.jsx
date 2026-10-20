// ServiceLogo.jsx draws the Google and Microsoft logos used on the Sign up
// and Log in pages' "Google" and "Microsoft" buttons.
// They're small pictures (SVG). They keep their official brand colors, which
// is the one place the site uses colors outside :root. They're decoration,
// because the button's words already say the name, so aria-hidden hides them
// from screen readers (WCAG).
//
// How to use it:
//   <ServiceLogo name="google" />   or   <ServiceLogo name="microsoft" />

// "props.name" picks which logo to draw.
function ServiceLogo(props) {
    return (
        <svg className="signup-social-logo" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            {props.name === 'google' && (
                <>
                    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.51 5.51 0 0 1-2.39 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.09A12 12 0 0 0 12 24Z" />
                    <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l4-3.09Z" />
                    <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l4 3.09C6.23 6.86 8.88 4.75 12 4.75Z" />
                </>
            )}
            {props.name === 'microsoft' && (
                <>
                    <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
                    <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
                    <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
                    <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
                </>
            )}
        </svg>
    );
}

// Lets other files import ServiceLogo (Signup.jsx and Login.jsx do this).
export default ServiceLogo
