import React, { Component } from 'react';

import { withFirebase } from 'services/Firebase';
import MatchaButton from 'components/MatchaButton';
import MatchaBox from 'components/MatchaBox';
import { withSnackbar } from 'react-simple-snackbar';
import formatDateTime from 'helpers/formatDateTime';
import { withTranslation } from 'react-i18next';

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
    this.onSendPasswordResetEmail = this.onSendPasswordResetEmail.bind(this);
    this.upgradeToAdmin = this.upgradeToAdmin.bind(this);
    this.downGradeToNormal = this.downGradeToNormal.bind(this);
  }

  componentDidMount() {
    const { user } = this.state;
    if (user) {
      return;
    }

    this.setState({ loading: true });

    this.ref = this.props.firebase.subscribeToUser(
      this.props.match.params.id,
      (user) => {
        this.setState({
          user,
          loading: false,
        });
      }
    );
  }

  componentWillUnmount() {
    console.log('UserItem componentWillUnmount');
    this.props.firebase.unsubscribeFromUser(
      this.props.match.params.id,
      this.ref
    );
  }

  onSendPasswordResetEmail() {
    const { openSnackbar } = this.props;
    const { t } = this.props;
    const { user } = this.state;
    try {
      this.props.firebase.doUseDeviceLanguage();
      this.props.firebase.doPasswordReset(user.email);
      openSnackbar(
        t(
          'user_item.password_reset_message_sent',
          'Password reset message sent'
        )
      );
    } catch (error) {
      openSnackbar(error.message);
    }
  }

  setAdmin(val) {
    const { openSnackbar } = this.props;
    const uid = this.state.user.uid;
    const { updateRoles } = this.props.firebase;
    try {
      updateRoles(uid, { ADMIN: val });
      this.props.history.push('/admin');
    } catch (error) {
      openSnackbar(error.message);
    }
  }

  upgradeToAdmin() {
    this.setAdmin(true);
  }

  downGradeToNormal() {
    this.setAdmin(false);
  }

  render() {
    const { user, loading } = this.state;
    const isAdmin = user.roles && user.roles.ADMIN && user.roles.ADMIN === true;
    const { t } = this.props;

    return (
      <MatchaBox title='User'>
        {loading && <div>Loading ...</div>}
        {user && (
          <div>
            <p>
              <strong>ID:</strong> {this.props.match.params.id}
            </p>
            <p>
              <strong>E-Mail:</strong> {user.email}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Firstname:</strong> {user.firstname}
            </p>
            <p>
              <strong>Lastname:</strong> {user.lastname}
            </p>
            <p>
              <strong>Description:</strong> {user.description}
            </p>
            <p>
              <strong>Visible:</strong>
              {user.visible ? ' Yes' : ' No'}
            </p>
            <p>
              <strong>Creation date:</strong>
              {formatDateTime(user.created)}
            </p>
            <p>
              <strong>Latest update:</strong>
              {formatDateTime(user.updated)}
            </p>
            <p>
              <strong>Admin:</strong>
              {isAdmin ? ' Yes' : ' No'}
            </p>
            <p>
              <MatchaButton
                text={t('user_item.send_password_reset', 'Send Password Reset')}
                onClick={this.onSendPasswordResetEmail}
              />
              {isAdmin ? (
                <MatchaButton
                  text={t(
                    'user_item.downgrade_profile',
                    'Downgrade to normal profile'
                  )}
                  onClick={this.downGradeToNormal}
                />
              ) : (
                <MatchaButton
                  text={t(
                    'user_item.upgrade_profile',
                    'Upgrade to normal profile'
                  )}
                  onClick={this.upgradeToAdmin}
                />
              )}
            </p>
          </div>
        )}
      </MatchaBox>
    );
  }
}

export default withTranslation()(withFirebase(withSnackbar(UserItem)));
