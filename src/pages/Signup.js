import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { signup, updateUserProfile, signInWithGoogle, signInWithGitHub } from "../helpers/auth";


export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
      displayName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // check for non string, empty string, blank string...
  isEmptyString(str) {
    return str === ""
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.isEmptyString(this.state.displayName))
      this.setState({ error: 'Display Name cannot be empty' })
    else {
      this.setState({ error: '' })
      try {
        await signup(this.state.email, this.state.password);
        await updateUserProfile(this.state.displayName)
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGitHub();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }


  render() {
    return (
      <div className="login pt-20">
        <div className="p-6 max-w-sm mx-auto bg-indigo-50 rounded-xl shadow-md flex items-center space-x-4 border-l-8 border-indigo-500">

          <form onSubmit={this.handleSubmit}>
            <h1 className="text-center text-2xl">
              Sign Up to
          <Link className="px-1 hover:underline" to="/">Chatty</Link>
            </h1>
            <p>Fill in the form below to create an account.</p>
            <hr />
            <div>
              <input placeholder="Display Name" name="displayName" onChange={this.handleChange} value={this.state.displayName} type="text"></input>
            </div>
            <div>
              <input placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
            </div>
            <div>
              <input placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
            </div>
            <div>
              {this.state.error ? <p className="text-red-500">{this.state.error}</p> : null}
              <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="submit">Sign up</button>
              <p>Or</p>
              <p>
                <button className="hover:underline " onClick={this.googleSignIn} type="button">
                  Sign up with Google
            </button>
              </p>
              <p>
                <button className="hover:underline" type="button" onClick={this.githubSignIn}>
                  Sign up with GitHub
            </button>
              </p>
            </div>
            <hr />
            <p>Already have an account? <Link className="hover:underline" to="/login">Login</Link> </p>
          </form>
        </div>
      </div>
    )
  }
}