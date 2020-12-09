import React from 'react';
import { Link } from 'react-router-dom';
//import { auth } from '../services/firebase';
import { FirebaseContext } from '../services/Firebase'

function Header() {
  return (
    <header>
      <nav className="flex shadow px-8 py-6 items-center justify-between flex-wrap">
        <div className="flex items-center flex-grow flex-shrink lg:pb-0">
          <Link className="text-xl hover:underline" to="/">Matcha-React</Link>
        </div>

        <div className="flex-grow flex items-center w-auto">
          <div className="flex-grow">
            <div className="float-right space-x-4">
              <FirebaseContext.Consumer>
                {firebase => {
                  return (firebase.auth.currentUser
                    ?
                    <React.Fragment>
                      <span className="" >Logged in as </span><span className="italic">{firebase.auth.currentUser.displayName}</span>
                      <Link className="hover:underline" to="/profile">Profile</Link>
                      <Link className="hover:underline" to="/chat">Chat</Link>
                      <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" onClick={() => firebase.auth.signOut()}>Logout</button>

                      {/* <button className="nav-item -mr-1 flex p-2 rounded-md bg-indigo-100 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2" onClick={() => auth().signOut()}>Logout</button> */}
                    </React.Fragment>
                    : <React.Fragment>
                      <Link className="hover:underline" to="/login">Sign In</Link>
                      <Link className="hover:underline" to="/signup">Sign Up</Link>
                    </React.Fragment>
                  )
                }
                }
              </FirebaseContext.Consumer>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header

