import React, { Component } from 'react';

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from './pages/Home';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import { auth } from './services/firebase';
import Spinner from 'react-loader-spinner'
import SnackbarProvider from 'react-simple-snackbar'

import './styles.css';

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
// la page de chat
function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/chat' />}
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
    auth().onAuthStateChanged((user) => {
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
            </Switch>
          </Router>
        </SnackbarProvider>
      );
  }
}




export default App;
