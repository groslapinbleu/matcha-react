import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import * as MISC from '../constants/miscConsts';
import MatchaButton from 'components/MatchaButton';
import { isValidEmail } from 'helpers/validation';
import { withTranslation } from 'react-i18next';
import Alert from 'components/Alert';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      // firebase instance is provided via a prop
      await this.props.firebase.doSignInWithEmailAndPassword(
        this.state.email,
        this.state.password
      );
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    const { t } = this.props;

    const { email, password } = this.state;
    const isInvalid = !isValidEmail(email) || password === '';
    const title = t('login_page.login_to', 'Login to') + ' ' + MISC.APP_NAME;

    return (
      <div className='profile pt-20'>
        <MatchaBox title={title}>
          <div className=''>
            <form className='' autoComplete='off' onSubmit={this.handleSubmit}>
              <p>
                {t(
                  'login_page.fill_in_message',
                  'Fill in the form below to login to your account.'
                )}
              </p>
              <hr />
              <div>
                <input
                  placeholder={t('login_page.email', 'Email')}
                  name='email'
                  type='email'
                  onChange={this.handleChange}
                  value={this.state.email}
                />
              </div>
              <div>
                <input
                  placeholder={t('login_page.password', 'Password')}
                  name='password'
                  onChange={this.handleChange}
                  value={this.state.password}
                  type='password'
                />
              </div>
              <div>
                {this.state.error ? (
                  <Alert>
                    <p>{this.state.error}</p>
                  </Alert>
                ) : null}
                <MatchaButton
                  text={t('login_page.login_button', 'Login')}
                  type='submit'
                  disabled={isInvalid}
                ></MatchaButton>
              </div>
              <hr />
              <p>
                {t('login_page.forgot_password', 'Forgot your password?')}{' '}
                <Link
                  className='hover:underline'
                  to={{
                    pathname: '/resetpassword',
                    state: {
                      email: this.state.email,
                    },
                  }}
                >
                  {t('login_page.reset_password', 'Reset Password')}
                </Link>
              </p>
              <p>
                {t('login_page.no_account', 'Do not have an account?')}{' '}
                <Link className='hover:underline' to='/signup'>
                  {t('login_page.signup', 'Sign Up')}
                </Link>
              </p>
            </form>
          </div>
        </MatchaBox>
        <Footer></Footer>
      </div>
    );
  }
}

// Login is wrapped within the Firebase context
// so that the Firebase instance is available as a prop,
// and in the i18next translation context for internationalization
export default withTranslation()(withFirebase(Login));
