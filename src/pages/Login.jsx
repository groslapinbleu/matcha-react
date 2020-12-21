import React, { Component } from "react";
import { Link } from "react-router-dom";
// import Header from "../components/Header";
// import { signin } from "../helpers/auth";
import Footer from '../components/Footer'
import MatchaBox from '../components/MatchaBox'
import { withFirebase } from '../services/Firebase'
import * as MISC from '../constants/miscConsts'
import MatchaButton from 'components/MatchaButton'
import {isValidEmail} from 'helpers/validation'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      // firebase instance is provided via a prop
      await this.props.firebase.doSignInWithEmailAndPassword(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { email, password } = this.state
    const isInvalid = !isValidEmail(email) || password === ''

    return (
      <div className="profile pt-20">
        <MatchaBox title={`Login to ${MISC.APP_NAME}`}>
          <form className=""
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
              
            <p>Fill in the form below to login to your account.</p>
            <hr />
            <div>
              <input
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
            <div>
              <input
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
              />
            </div>
            <div>
              {this.state.error ? (
                <p>{this.state.error}</p>
              ) : null}
              <MatchaButton text="Login" type="submit" disabled={isInvalid}></MatchaButton>
            </div>
            <hr />
            <p>
              Forgot your password? <Link className="hover:underline" to={{
                pathname: '/forgotpassword',
                state: {
                  email: this.state.email
                }
              }}>Reset Password</Link>
            </p>
            <p>
              Do not have an account? <Link className="hover:underline" to="/signup">Sign up</Link>
            </p>
          </form>
        </MatchaBox>
        <Footer></Footer>
      </div>
    );
  }
}

// Login is wrapped within the Firebase context 
// so that the Firebase instance is available as a prop
export default withFirebase(Login)