import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from 'components/MatchaBox';
import MatchaButton from 'components/MatchaButton';
import Avatar from 'components/Avatar';
import { isBFriendOfA } from 'models/User';
import { withFirebase } from 'services/Firebase';
import Star from 'Icons/Star';
import age from 'helpers/age';
import Spinner from 'react-loader-spinner';

// import * as ROUTES from '../../constants/routes';

class UserSearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      error: null,
      limit: 5,
      searchString: '',
    };
    this.extractFilteredUsers = this.extractFilteredUsers.bind(this);
    this.askConnection = this.askConnection.bind(this);
    this.cancelRequestForConnection = this.cancelRequestForConnection.bind(
      this
    );
    this.acceptConnection = this.acceptConnection.bind(this);
    this.rejectConnection = this.rejectConnection.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.onListenForUsers();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    // TODO: implement search
  }

  askConnection(toUser) {
    console.log('askConnection');
    const { authUser, user } = this.props.firebase;

    const isFriend = isBFriendOfA(authUser, toUser);

    if (isFriend) {
      // already friends, don't do anything
      console.log(
        'askConnection: user ' +
          authUser.uid +
          ' is already friend with ' +
          toUser.uid
      );
    } else {
      const friends = {
        ...authUser.friends,
      };
      friends[toUser.uid] = false;
      user(authUser.uid).child('friends').update(friends);
    }
  }

  cancelRequestForConnection(toUser) {
    console.log('cancelConnection');
    const { authUser, user } = this.props.firebase;
    const isFriend = isBFriendOfA(authUser, toUser);

    if (isFriend === false) {
      const friends = {
        ...authUser.friends,
      };
      friends[toUser.uid] = null;
      user(authUser.uid).child('friends').update(friends);
    }
  }

  acceptConnection(fromUser) {
    console.log('acceptConnection');
    const { authUser, user } = this.props.firebase;

    const isFriend = isBFriendOfA(fromUser, authUser);

    if (isFriend) {
      // already friends, don't do anything
      console.log(
        'acceptConnection: user ' +
          authUser.uid +
          ' is already friend with ' +
          fromUser.uid
      );
    } else {
      const friends = {
        ...fromUser.friends,
      };
      friends[authUser.uid] = true;
      user(fromUser.uid).child('friends').update(friends);
    }
  }

  rejectConnection(fromUser) {
    console.log('rejectConnection');
  }

  extractFilteredUsers(snapshot, uid) {
    console.log('extractFilteredUsers');
    const usersObject = snapshot.val();
    if (usersObject) {
      const usersList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
        uid: key,
      }));

      // remove self and invisible users from user list
      const filteredUserList = usersList.filter(
        (user) => user.uid !== uid && user.visible === true
      );
      this.setState({
        users: filteredUserList,
      });
    }
    this.setState({
      loading: false,
      error: null,
    });
  }

  // returns true if the authenticated user and another user
  // have compatible gender preferrences
  isCompatible(user) {
    const { authUser } = this.props.firebase;

    return (
      (authUser.preferredGender === 0 && user.preferredGender === 0) ||
      (authUser.preferredGender === 0 &&
        authUser.gender == user.preferredGender) ||
      (authUser.preferredGender === user.gender &&
        authUser.gender == user.preferredGender)
    );
  }

  onListenForUsers = () => {
    const { preferredGender, uid } = this.props.firebase.authUser;

    console.log('preferredGender = ' + preferredGender);
    this.setState({ loading: true });
    try {
      preferredGender === 0
        ? this.props.firebase
            .users()
            .orderByChild('gender')
            .limitToLast(this.state.limit)
            .on('value', (snapshot) => this.extractFilteredUsers(snapshot, uid))
        : this.props.firebase
            .users()
            .orderByChild('gender')
            .limitToLast(this.state.limit)
            .equalTo(preferredGender)
            .on('value', (snapshot) =>
              this.extractFilteredUsers(snapshot, uid)
            );
    } catch (error) {
      console.log(error.message);
      this.setState({ error, loading: false });
    }
  };

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  // this function is used to select users that will be displayed at render time
  selectUser = (user) => {
    const { searchString } = this.state;
    const ret = user.username.includes(searchString);
    // console.log("user.username = " + user.username + " searchString=" + searchString + " includes = " + ret)
    return ret;
  };

  render() {
    console.log('UserSearchList render');
    const { users, loading } = this.state;
    const filteredUsers = users.filter(this.selectUser);

    const { authUser } = this.props.firebase;
    return (
      <>
        {loading && (
          <div className='flex items-center justify-center'>
            <Spinner type='Puff' color='#038E9F' height={50} width={50} />
          </div>
        )}
        <form onSubmit={this.onSubmit}>
          <input
            type='text'
            name='searchString'
            placeholder='Enter search string'
            value={this.state.searchstring}
            onChange={this.handleChange}
          ></input>
        </form>
        <table className='table-auto '>
          <thead>
            <tr>
              <th className='border border-indigo-800'>Photo</th>
              <th className='border border-indigo-800'>Username</th>
              <th className='border border-indigo-800'>Age</th>
              <th className='border border-indigo-800'>Connected on my side</th>
              <th className='border border-indigo-800'>
                Connected on their side
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const isListedUserMyFriend = isBFriendOfA(authUser, user);
              const amIFriendOfListedUser = isBFriendOfA(user, authUser);
              const compatible = this.isCompatible(user);
              if (compatible)
                return (
                  <tr key={user.uid}>
                    <td className='border border-indigo-800'>
                      <Avatar
                        username={user.username}
                        photoURL={user.photoURL}
                      ></Avatar>
                    </td>
                    <td className='border border-indigo-800'>
                      {user.username}
                    </td>
                    <td className='border border-indigo-800'>
                      {age(new Date(user.birthday))}
                    </td>
                    <td className='border border-indigo-800'>
                      {isListedUserMyFriend === null ? (
                        <>
                          {' '}
                          Not my friend yet <Star /> <br />
                          <MatchaButton
                            text='Ask for connection'
                            type='button'
                            onClick={() => this.askConnection(user)}
                          ></MatchaButton>
                        </>
                      ) : isListedUserMyFriend ? (
                        <>
                          {' '}
                          Already my friend <Star fill='yellow' />{' '}
                        </>
                      ) : (
                        <>
                          {' '}
                          Request to be friends already sent <br />
                          <MatchaButton
                            text='Cancel connection request'
                            type='button'
                            onClick={() =>
                              this.cancelRequestForConnection(user)
                            }
                          />
                        </>
                      )}
                    </td>
                    <td className='border border-indigo-800'>
                      {amIFriendOfListedUser === null ? (
                        'I am not their friend yet'
                      ) : amIFriendOfListedUser ? (
                        <>
                          {' '}
                          I am their friend already
                          <br />
                          <MatchaButton
                            text='Reject connection request'
                            type='button'
                            onClick={() => this.rejectConnection(user)}
                          />
                        </>
                      ) : (
                        <>
                          {' '}
                          They have asked me to be friends <br />
                          <MatchaButton
                            text='Accept connection request'
                            type='button'
                            onClick={() => this.acceptConnection(user)}
                          />
                          <MatchaButton
                            text='Reject connection request'
                            type='button'
                            onClick={() => this.rejectConnection(user)}
                          />
                        </>
                      )}
                    </td>
                    {isListedUserMyFriend && amIFriendOfListedUser ? (
                      <td>
                        <MatchaButton>
                          <Link
                            to={{
                              // pathname: `/admin/${user.uid}`,
                              pathname: `/chat/${user.uid}/${user.username}`,
                              state: { user },
                            }}
                          >
                            Chat
                          </Link>
                        </MatchaButton>
                      </td>
                    ) : null}
                  </tr>
                );
            })}
          </tbody>
        </table>
        {this.state.error && <li>{this.state.error.message}</li>}
      </>
    );
  }
}

export default withFirebase(UserSearchList);
