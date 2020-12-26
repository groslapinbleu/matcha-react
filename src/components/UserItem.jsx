import React, { Component } from 'react';

import { withFirebase } from 'services/Firebase';
import MatchaButton from 'components/MatchaButton';
import MatchaBox from 'components/MatchaBox';
import { withSnackbar } from 'react-simple-snackbar'

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    }
    this.onSendPasswordResetEmail = this.onSendPasswordResetEmail.bind(this)
    this.upgradeToAdmin = this.upgradeToAdmin.bind(this)
    this.downGradeToNormal = this.downGradeToNormal.bind(this)

  }

  componentDidMount() {
    const { user } = this.state
    if (user) {
      return;
    }

    this.setState({ loading: true });

    this.ref = this.props.firebase
      .user(this.props.match.params.id)
      .on('value', (snapshot) => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    if (this.ref)
      this.props.firebase.user(this.props.match.params.id).off('value', this.ref);
  }

  onSendPasswordResetEmail() {
    const { openSnackbar } = this.props

    const { user } = this.state
    try {
      this.props.firebase.doUseDeviceLanguage()
      this.props.firebase.doPasswordReset(user.email)
      openSnackbar('Password reset message sent')
    } catch (error) {
      openSnackbar(error.message)
    }
  }

  setAdmin(val) {
    const { openSnackbar } = this.props
    const uid = this.state.user.uid
    const { user } = this.props.firebase
    try {
      user(uid).child('roles').set({ ADMIN: val })
      this.props.history.push("/admin")
    } catch (error) {
      openSnackbar(error.message)
    }
  }

  upgradeToAdmin() {
    this.setAdmin(true)
  }

  downGradeToNormal() {
    this.setAdmin(false)
  }

  render() {
    const { user, loading } = this.state
    const isAdmin = user.roles && user.roles.ADMIN && user.roles.ADMIN === true

    return (
      <MatchaBox title="User">
        {loading && <div>Loading ...</div>}
        {user && (
          <div>
            <p>
              <strong>ID:</strong>
              {' '}
              {this.props.match.params.id}
            </p>
            <p>
              <strong>E-Mail:</strong>
              {' '}
              {user.email}
            </p>
            <p>
              <strong>Username:</strong>
              {' '}
              {user.username}
            </p>
            <p>
              <strong>Firstname:</strong>
              {' '}
              {user.firstname}
            </p>
            <p>
              <strong>Lastname:</strong>
              {' '}
              {user.lastname}
            </p>
            <p>
              <strong>Description:</strong>
              {' '}
              {user.description}
            </p>
            <p>
              <strong>Visible:</strong>
              {user.visible ? ' Yes' : ' No'}
            </p>
            <p>
              <strong>Admin:</strong>
              {isAdmin ? ' Yes' : ' No'}
            </p>
            <p>
              <MatchaButton
                text="Send Password Reset"
                onClick={this.onSendPasswordResetEmail}
              />
              {isAdmin
                ?
                <MatchaButton
                  text="Downgrade to normal profile"
                  onClick={this.downGradeToNormal}
                />
                :
                <MatchaButton
                  text="Upgrade to admin profile"
                  onClick={this.upgradeToAdmin}
                />
              }
            </p>
          </div>
        )}
      </MatchaBox>
    );
  }
}

export default withFirebase(withSnackbar(UserItem));
