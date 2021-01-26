import React, { Component } from 'react';
import { withSnackbar } from 'react-simple-snackbar';
import { withTranslation } from 'react-i18next';
import { withFirebase } from 'services/Firebase';
import MatchaButton from 'components/MatchaButton';
import { isValidEmail } from 'helpers/validation';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  newEmail: '',
  error: null,
};

class EmailChangeForm extends Component {
  state = { ...INITIAL_STATE };

  onSubmit = async (event) => {
    const { newEmail } = this.state;
    const { openSnackbar } = this.props;
    const { t } = this.props;
    const { updateUser, auth } = this.props.firebase;
    event.preventDefault();

    try {
      await this.props.firebase.doUseDeviceLanguage();

      //1. update email
      await this.props.firebase.doUpdateEmail(newEmail);
    } catch (error) {
      // uh uh, it failed ! display an error and exit
      openSnackbar(error.message);
      this.setState({ error });
      return;
    }

    // 2. all, good, proceed and change RealtimeDB as well
    updateUser(auth.currentUser.uid, {
      email: newEmail,
    })
      .then(() => {
        openSnackbar(
          t(
            'email_change_form.email_successfully_changed',
            'Email successfully changed'
          )
        );
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        openSnackbar(error.message);
        this.setState({ error });
      });
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { newEmail, error } = this.state;
    const { t } = this.props;
    const { currentEmail } = this.props;
    const isInvalid = !isValidEmail(newEmail);

    return (
      <>
        <div>
          {t('email_change_form.current_email', 'Current email')}:{' '}
          {currentEmail}
        </div>
        <form onSubmit={this.onSubmit}>
          <div className='space-x-4'>
            <input
              name='newEmail'
              value={newEmail}
              onChange={this.onChange}
              type='email'
              placeholder={t('email_change_form.new_email', 'New Email')}
            />
            <MatchaButton
              text={t('email_change_form.reset_password', 'Change email')}
              disabled={isInvalid}
              type='submit'
            ></MatchaButton>
          </div>
          {error && <p>{error.message}</p>}
        </form>
      </>
    );
  }
}

EmailChangeForm.propTypes = {
  currentEmail: PropTypes.string.isRequired,
};
export default withTranslation()(withFirebase(withSnackbar(EmailChangeForm)));
