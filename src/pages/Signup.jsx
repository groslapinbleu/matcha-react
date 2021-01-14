import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

import userNameGenerator from '../helpers/userNameGenerator';
import { isEmptyString } from '../helpers/validation';
import RefreshButton from '../components/RefreshButton';
import { withFirebase } from '../services/Firebase';
import MatchaBox from '../components/MatchaBox';
import { isValidEmail } from 'helpers/validation';
import MatchaButton from 'components/MatchaButton';
import { defaultUserData } from 'models/User';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
      username: userNameGenerator(),
      firstname: '',
      lastname: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
    this.setUserName = this.setUserName.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  setUserName() {
    this.setState({
      username: userNameGenerator(),
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const { doCreateUserWithEmailAndPassword, user } = this.props.firebase;
    if (isEmptyString(this.state.username))
      this.setState({ error: 'Display Name cannot be empty' });
    else {
      this.setState({ error: '' });

      doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((authUser) => {
          if (authUser) {
            const now = Date.now();
            let dbUser = {
              ...defaultUserData,
              username: this.state.username,
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
              created: now,
              updated: now,
            };
            return user(authUser.user.uid).set(dbUser);
          }
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
    }
  }

  async googleSignIn() {
    const { doSignInWithGoogle } = this.props.firebase;

    try {
      await doSignInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    const { doSignInWithGithub } = this.props.firebase;

    try {
      await doSignInWithGithub();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  // TODO: add a more thorough validation of email and password
  // with clearer feedback to the user, field by field
  render() {
    const { email, password } = this.state;

    const isInvalid = !isValidEmail(email) || password === '';

    return (
      <div className='login pt-20'>
        <MatchaBox title='Sign Up'>
          <form onSubmit={this.handleSubmit}>
            <p>Fill in the form below to create an account.</p>
            <hr />

            <div>
              <input
                placeholder='Email'
                name='email'
                type='email'
                onChange={this.handleChange}
                value={this.state.email}
              ></input>
            </div>
            <div>
              <input
                placeholder='Password'
                name='password'
                onChange={this.handleChange}
                value={this.state.password}
                type='password'
              ></input>
            </div>
            <div className='inline-flex'>
              <input
                placeholder='Username'
                name='username'
                onChange={this.handleChange}
                value={this.state.username}
                type='text'
                required
              ></input>
              <RefreshButton
                onClick={() => {
                  this.setUserName();
                }}
              />
            </div>
            <div>
              <input
                placeholder='Firstname'
                name='firstname'
                onChange={this.handleChange}
                value={this.state.firstname}
                type='text'
                required
              ></input>
            </div>
            <div>
              <input
                placeholder='Lastname'
                name='lastname'
                onChange={this.handleChange}
                value={this.state.lastname}
                type='text'
                required
              ></input>
            </div>
            <div>
              {this.state.error ? (
                <p className='text-red-500'>{this.state.error}</p>
              ) : null}
              <MatchaButton
                text='Sign Up'
                type='Submit'
                disabled={isInvalid}
              ></MatchaButton>

              <p>Or</p>
              <p>
                <button
                  className='hover:underline '
                  onClick={this.googleSignIn}
                  type='button'
                >
                  Sign up with Google
                </button>
              </p>
              <p>
                <button
                  className='hover:underline'
                  type='button'
                  onClick={this.githubSignIn}
                >
                  Sign up with GitHub
                </button>
              </p>
            </div>
            <hr />
            <p>
              Already have an account?{' '}
              <Link className='hover:underline' to='/login'>
                Login
              </Link>{' '}
            </p>
          </form>
        </MatchaBox>
        <Footer></Footer>
      </div>
    );
  }
}

export default withFirebase(SignUp);
