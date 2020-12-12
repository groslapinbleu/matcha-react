import React from "react"
import { Link, useLocation } from 'react-router-dom';
import { withFirebase } from 'services/Firebase'
import * as MISC from 'constants/miscConsts'
import Menu from 'Icons/Menu'
import MatchaButton from "./MatchaButton";



// inspired from https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/navbars
function Navbar({ firebase }) {
    const [navbarOpen, setNavbarOpen] = React.useState(false)
    const location = useLocation()

    const decorateLink = (locationPath) => {
        let deco = "px-3 py-2 flex items-center text-xs font-bold leading-snug text-white hover:opacity-75"
        if (location.pathname === locationPath) {
            deco += " underline"
        }
        return deco
    }

    return (
        <>
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-indigo-300 mb-3">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <Link className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white hover:opacity-75" to="/">{MISC.APP_NAME}</Link>

                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        ><Menu />
                        </button>
                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            {
                                firebase.auth.currentUser
                                    ?
                                    <React.Fragment>
                                        <li className="nav-item">
                                            <span className="px-3 py-2 flex items-center text-xs font-bold leading-snug text-gray-200" >Hello {firebase.auth.currentUser.email}</span>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/profile")} to="/profile">Profile</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/chat")} to="/chat">Chat</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/notification")} to="/notification">Notification</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/admin")} to="/admin">Admin</Link>
                                        </li>
                                        <li className="nav-item">
                                            <MatchaButton text="Logout" onClick={() => firebase.auth.signOut()}>    </MatchaButton>
                                        </li>
                                    </React.Fragment>
                                    : <React.Fragment>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/login")} to="/login">Sign In</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={decorateLink("/signup")} to="/signup">Sign Up</Link>
                                        </li>
                                    </React.Fragment>

                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default withFirebase(Navbar)