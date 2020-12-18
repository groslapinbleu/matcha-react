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
    };
  }

  componentDidMount() {
    const { user } = this.state
    if (user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', (snapshot) => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  onSendPasswordResetEmail() {
    const { openSnackbar } = this.props
    try {
      this.props.firebase.doUseDeviceLanguage()
      this.props.firebase.doPasswordReset(this.state.user.email)
      openSnackbar('Password reset message sent')
    } catch (error) {
      openSnackbar(error.message)
    }
  }

  render() {
    const { user, loading } = this.state;
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
              <strong>Firstrname:</strong>
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
              <MatchaButton
                text="Send Password Reset"
                onClick={this.onSendPasswordResetEmail}
              />
            </p>
          </div>
        )}
      </MatchaBox>
    );
  }
}

export default withFirebase(withSnackbar(UserItem));
