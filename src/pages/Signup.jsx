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
import { withTranslation } from 'react-i18next';
import Alert from 'components/Alert';

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

    const {
      doCreateUserWithEmailAndPassword,
      createUser,
    } = this.props.firebase;
    const { t } = this.props;

    if (isEmptyString(this.state.username))
      this.setState({
        error: t('signup_page.username_error', 'Username cannot be empty'),
      });
    else {
      this.setState({ error: '' });

      doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async (authUser) => {
          if (authUser) {
            let dbUser = {
              ...defaultUserData,
              username: this.state.username,
              email: this.state.email,
              firstname: this.state.firstname,
              lastname: this.state.lastname,
            };
            return await createUser(authUser.user.uid, dbUser);
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
    const { t } = this.props;

    const { email, password } = this.state;

    const isInvalid = !isValidEmail(email) || password === '';

    return (
      <div className='login pt-20'>
        <MatchaBox title={t('signup_page.signup', 'Sign Up')}>
          <form onSubmit={this.handleSubmit}>
            <p>
              {t(
                'signup_page.fill_in_message',
                'Fill in the form below to create an account.'
              )}
            </p>
            <hr />

            <div>
              <input
                placeholder={t('signup_page.email', 'Email')}
                name='email'
                type='email'
                onChange={this.handleChange}
                value={this.state.email}
              ></input>
            </div>
            <div>
              <input
                placeholder={t('signup_page.password', 'Password')}
                name='password'
                onChange={this.handleChange}
                value={this.state.password}
                type='password'
              ></input>
            </div>
            <div className='inline-flex'>
              <input
                placeholder={t('signup_page.username', 'Username')}
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
                placeholder={t('signup_page.firstname', 'Firstname')}
                name='firstname'
                onChange={this.handleChange}
                value={this.state.firstname}
                type='text'
                required
              ></input>
            </div>
            <div>
              <input
                placeholder={t('signup_page.lastname', 'Lastname')}
                name='lastname'
                onChange={this.handleChange}
                value={this.state.lastname}
                type='text'
                required
              ></input>
            </div>
            <div>
              {this.state.error ? <Alert>{this.state.error}</Alert> : null}
              <MatchaButton
                text={t('signup_page.signup_button', 'Sign Up')}
                type='submit'
                disabled={isInvalid}
              ></MatchaButton>

              <p>{t('signup_page.or', 'Or')}</p>
              <p>
                <button
                  className='hover:underline '
                  onClick={this.googleSignIn}
                  type='button'
                >
                  {t('signup_page.signup_with_google', 'Sign up with Google')}
                </button>
              </p>
              <p>
                <button
                  className='hover:underline'
                  type='button'
                  onClick={this.githubSignIn}
                >
                  {t('signup_page.signup_with_github', 'Sign up with Github')}
                </button>
              </p>
            </div>
            <hr />
            <p>
              {t(
                'signup_page.already_have_account',
                'Already have an account?'
              )}{' '}
              <Link className='hover:underline' to='/login'>
                {t('signup_page.login', 'Login')}
              </Link>{' '}
            </p>
          </form>
        </MatchaBox>
        <Footer></Footer>
      </div>
    );
  }
}

export default withTranslation()(withFirebase(SignUp));
