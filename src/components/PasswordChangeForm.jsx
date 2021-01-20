import React, { Component } from 'react';
import { withSnackbar } from 'react-simple-snackbar';
import { withTranslation } from 'react-i18next';
import { withFirebase } from 'services/Firebase';
import MatchaButton from 'components/MatchaButton';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;
    const { openSnackbar } = this.props;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        openSnackbar(
          t(
            'password_change_form.password_successfully_changed',
            'Password successfully changed'
          )
        );
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const { t } = this.props;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div className='space-x-4'>
          <input
            name='passwordOne'
            value={passwordOne}
            onChange={this.onChange}
            type='password'
            placeholder={t('password_change_form.new_password', 'New Password')}
          />
          <input
            name='passwordTwo'
            value={passwordTwo}
            onChange={this.onChange}
            type='password'
            placeholder={t(
              'password_change_form.confirm_new_password',
              'Confirm New Password'
            )}
          />
          <MatchaButton
            text={t('password_change_form.reset_password', 'Reset my password')}
            disabled={isInvalid}
            type='submit'
          ></MatchaButton>
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withTranslation()(
  withFirebase(withSnackbar(PasswordChangeForm))
);
