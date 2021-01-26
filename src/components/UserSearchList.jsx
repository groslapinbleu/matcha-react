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
import { withTranslation } from 'react-i18next';
import SearchAndOrder from './SearchAndOrder';
import { regions } from 'models/User';

// import * as ROUTES from '../../constants/routes';

class UserSearchList extends Component {
  state = {
    loading: false,
    users: [],
    error: null,
    limit: 5,
    searchString: '',
    sortOrder: 'asc',
  };

  componentDidMount() {
    this.onListenForUsers();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleChangeString = (newString) => {
    this.setState({
      searchString: newString,
    });
  };

  handleChangeOrder = (value) => {
    this.setState({
      sortOrder: value,
    });
  };

  onSubmit = (event) => {
    event.preventDefault();
    // TODO: implement search
  };

  askConnection = (toUser) => {
    console.log('askConnection');
    const { authUser, updateFriends } = this.props.firebase;

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
      updateFriends(authUser.uid, friends);
    }
  };

  cancelRequestForConnection = (toUser) => {
    console.log('cancelConnection');
    const { authUser, updateFriends } = this.props.firebase;
    const isFriend = isBFriendOfA(authUser, toUser);

    if (isFriend === false) {
      const friends = {
        ...authUser.friends,
      };
      friends[toUser.uid] = null;
      updateFriends(authUser.uid, friends);
    }
  };

  acceptConnection = (fromUser) => {
    console.log('acceptConnection');
    const { authUser, updateFriends } = this.props.firebase;

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
      updateFriends(fromUser.uid, friends);
    }
  };

  rejectConnection = (fromUser) => {
    console.log('rejectConnection');
  };

  extractFilteredUsersFromDB = (snapshot, uid) => {
    console.log('extractFilteredUsersFromDB');
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
  };

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
            .on('value', (snapshot) =>
              this.extractFilteredUsersFromDB(snapshot, uid)
            )
        : this.props.firebase
            .users()
            .orderByChild('gender')
            .limitToLast(this.state.limit)
            .equalTo(preferredGender)
            .on('value', (snapshot) =>
              this.extractFilteredUsersFromDB(snapshot, uid)
            );
    } catch (error) {
      console.log(error.message);
      this.setState({ error, loading: false });
    }
  };

  componentWillUnmount() {
    this.props.firebase.unsubscribeFromUsers();
  }

  // this function is used to select users that will be displayed at render time
  selectUser = (user) => {
    const { searchString } = this.state;
    const ret = user.username
      .toUpperCase()
      .includes(searchString.toUpperCase());
    // console.log("user.username = " + user.username + " searchString=" + searchString + " includes = " + ret)
    return ret;
  };

  render() {
    console.log('UserSearchList render');
    const { users, loading } = this.state;
    const order = this.state.sortOrder === 'asc' ? 1 : -1;
    const filteredUsers = users.filter(this.selectUser);
    filteredUsers.sort((a, b) => {
      if (a.username.toUpperCase() < b.username.toUpperCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    });
    const { t } = this.props;
    const { authUser } = this.props.firebase;
    return (
      <div className=''>
        {loading && (
          <div className='flex items-center justify-center'>
            <Spinner type='Puff' color='#038E9F' height={50} width={50} />
          </div>
        )}

        <SearchAndOrder
          sortOrder={this.state.sortOrder}
          changeString={this.handleChangeString}
          changeOrder={this.handleChangeOrder}
        />

        <div>
          <div className='shadow  border-b border-gray-200 rounded-lg'>
            <table className='divide-y divide-gray-200'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {t('user_search_list.username', 'Username')}
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {t('user_search_list.age', 'Age')}
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {t('user_search_list.region', 'Region')}
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {t('user_search_list.rating', 'Rating')}
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Connected on my side
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Connected on their side
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  ></th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredUsers.map((user) => {
                  const isListedUserMyFriend = isBFriendOfA(authUser, user);
                  const amIFriendOfListedUser = isBFriendOfA(user, authUser);
                  const compatible = this.isCompatible(user);
                  if (compatible)
                    return (
                      <tr key={user.uid}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 '>
                              <Avatar
                                username={user.username}
                                photoURL={user.photoURL}
                                small={true}
                              ></Avatar>
                            </div>
                            <span className='pl-3 pr-6'>{user.username}</span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {age(new Date(user.birthday))}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {regions[user.region]}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {user.rating}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
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
                        <td className='px-6 py-4 whitespace-nowrap'>
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
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {isListedUserMyFriend && amIFriendOfListedUser ? (
                            <MatchaButton>
                              <Link
                                to={{
                                  pathname: `/chat/${user.uid}`,
                                  state: { user },
                                }}
                              >
                                Chat
                              </Link>
                            </MatchaButton>
                          ) : null}
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
          {this.state.error && <li>{this.state.error.message}</li>}
        </div>
      </div>
    );
  }
}

export default withTranslation()(withFirebase(UserSearchList));
