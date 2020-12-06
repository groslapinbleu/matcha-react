import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';


function Header() {
  return (


    <header>
      <nav className="flex shadow px-8 py-6 items-center justify-between flex-wrap">
        <div className="flex items-center flex-grow flex-shrink lg:pb-0">
          <Link className="text-xl hover:underline" to="/">Matcha-React</Link>
        </div>

        {/* <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 text-dark outline-none" aria-label="Menu">
            <svg className="h-6 w-6 text-dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="24" height="24"><path d="M4 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
          </button>
        </div> */}

        <div className="flex-grow flex items-center w-auto">
          <div className="flex-grow">
            <div className="float-right space-x-4">
              {auth().currentUser
                ?
                <React.Fragment>
                  <span className="" >Logged in as </span><span className="italic">{auth().currentUser.displayName}</span>
                  <Link className="hover:underline" to="/profile">Profile</Link>
                  <Link className="hover:underline" to="/chat">Chat</Link>
                  <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" onClick={() => auth().signOut()}>Logout</button>

                  {/* <button className="nav-item -mr-1 flex p-2 rounded-md bg-indigo-100 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2" onClick={() => auth().signOut()}>Logout</button> */}
                </React.Fragment>
                : <React.Fragment>
                  <Link className="hover:underline" to="/login">Sign In</Link>
                  <Link className="hover:underline" to="/signup">Sign Up</Link>
                </React.Fragment>}
              {/*               <div className="nav-item">
                <a href="#features" className="no-underline text-blue hover:underline">Features</a>
              </div>
              <div className="nav-item">
                <a href="#Pricing" className="no-underline text-blue hover:underline">Pricing</a>
              </div>
              <div className="nav-item">
                <a href="#about" className="no-underline text-blue hover:underline">About</a>
              </div> */}
            </div>
          </div>
        </div>
      </nav>
      {/* <nav className="navbar navbar-expand-sm fixed-top navbar-light bg-light">
        <Link className="navbar-brand" to="/">Chatty</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          {auth().currentUser
            ? 
           <div className="navbar-nav">
           <span className="nav-item nav-link disabled" >Hi {auth().currentUser.email}</span>
           <Link className="nav-item nav-link mr-3" to="/profile">Profile</Link>
           <Link className="nav-item nav-link mr-3" to="/chat">Chat</Link>
   
              <button className="btn btn-primary mr-3" onClick={() => auth().signOut()}>Logout</button>
            </div>
            : <div className="navbar-nav">
              <Link className="nav-item nav-link mr-3" to="/login">Sign In</Link>
              <Link className="nav-item nav-link mr-3" to="/signup">Sign Up</Link>
            </div>}
        </div>
      </nav> */}
    </header>
  );
}

export default Header;

