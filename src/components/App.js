import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from 'pages/Home';
import Chat from 'pages/Chat';
import Profile from 'pages/Profile';
import Signup from 'pages/Signup';
import Login from 'pages/Login';
import ForgotPassword from 'pages/ForgotPassword';
import NotFound from 'pages/NotFound';
import DeleteAccount from 'pages/DeleteAccount';
import Notification from 'pages/Notification';

import { withFirebase } from 'services/Firebase'

import Spinner from 'react-loader-spinner'
import SnackbarProvider from 'react-simple-snackbar'

import 'styles/styles.css';
import Admin from 'pages/Admin';

// cette fonction est un HOC : Higher Order Component
// elle renvoit le bon composant si on est authentifié, sinon elle revoit vers
// la page de login
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

// cette fonction est un HOC : Higher Order Component
// elle renvoit le bon composant si on est pas authentifié (soit signup et login), sinon elle revoit vers
// la home page
function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
  }
  componentDidMount() {
    // firebase is expected to be provided as a prop
    const { auth } = this.props.firebase
    // subscribe to auth state change and store listener
    // for future cleanup
    this.listener = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }

  componentWillUnmount() {
    // remove listener to avoid emory leak
    this.listener();
  }

  render() {

    return this.state.loading === true ? (
      <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
    ) : (
        <SnackbarProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute
                path="/profile"
                authenticated={this.state.authenticated}
                component={Profile}
              />
              <PrivateRoute
                path="/chat"
                authenticated={this.state.authenticated}
                component={Chat}
              />
              <PrivateRoute
                path="/admin"
                authenticated={this.state.authenticated}
                component={Admin}
              />
              <PrivateRoute
                path="/notification"
                authenticated={this.state.authenticated}
                component={Notification}
              />
              <PrivateRoute
                path="/deleteaccount"
                authenticated={this.state.authenticated}
                component={DeleteAccount}
              />
              <PublicRoute
                path="/signup"
                authenticated={this.state.authenticated}
                component={Signup}
              />
              <PublicRoute
                path="/login"
                authenticated={this.state.authenticated}
                component={Login}
              />
              <PublicRoute
                path="/forgotpassword"
                authenticated={this.state.authenticated}
                component={ForgotPassword}
              />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </SnackbarProvider>
      );
  }
}


// App is wrapped within the Firebase context 
// so that the Firebase instance is available as a prop
export default withFirebase(App);
