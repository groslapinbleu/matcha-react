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
import SearchAndOrder from 'components/SearchAndOrder';
import { regions } from 'models/User';
import { withTranslation } from 'react-i18next';

class Suggestions extends Component {
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

  componentWillUnmount() {
    this.props.firebase.unsubscribeFromUsers();
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

  onNextPage = () => {
    this.setState(
      (state) => ({ limit: state.limit + 5 }),
      this.onListenForUsers
    );
  };

  onSubmit = (event) => {
    event.preventDefault();
    // TODO: implement search
  };

  like = (toUser) => {
    console.log('like');
    const { authUser, updateFriends } = this.props.firebase;

    const isFriend = isBFriendOfA(authUser, toUser);

    if (isFriend) {
      // already friends, don't do anything
      console.log(
        'like: user ' + authUser.uid + ' is already friend with ' + toUser.uid
      );
    } else {
      const friends = {
        ...authUser.friends,
      };
      friends[toUser.uid] = true;
      updateFriends(authUser.uid, friends);
    }
  };

  unlike = (toUser) => {
    console.log('unlike');
    const { authUser, updateFriends } = this.props.firebase;
    const isFriend = isBFriendOfA(authUser, toUser);

    if (isFriend) {
      const friends = {
        ...authUser.friends,
      };
      friends[toUser.uid] = false;
      updateFriends(authUser.uid, friends);
    }
  };
  extractFilteredUsers = (usersList) => {
    const { uid } = this.props.firebase.authUser;
    console.log('extractFilteredUsers');
    if (usersList) {
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
    const { preferredGender } = this.props.firebase.authUser;

    console.log('preferredGender = ' + preferredGender);
    this.setState({ loading: true });
    try {
      preferredGender === 0
        ? this.props.firebase.subscribeToUsers(
            this.state.limit,
            this.extractFilteredUsers
          )
        : this.props.firebase.subscribeToUsersWithPreferredGender(
            this.state.limit,
            preferredGender,
            this.extractFilteredUsers
          );
    } catch (error) {
      console.log(error.message);
      this.setState({ error, loading: false });
    }
  };

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
    console.log('Suggestions render');
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
        <div className='m-2 p-2'>
          <MatchaButton
            text={t('user_search_list.get_more_users_button', 'Get more users')}
            type='button'
            onClick={this.onNextPage}
          />
        </div>
        <SearchAndOrder
          sortOrder={this.state.sortOrder}
          changeString={this.handleChangeString}
          changeOrder={this.handleChangeOrder}
        />

        <div>
          <div className='shadow  border-b border-gray-200 rounded-lg'>
            <table className='divide-y divide-gray-200'>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredUsers.map((user) => {
                  const didILikeListedUser = isBFriendOfA(authUser, user);
                  const didListedUserLikeMe = isBFriendOfA(user, authUser);
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
                          {didILikeListedUser === false ? (
                            <>
                              <Star /> <br />
                              <MatchaButton
                                text='Like'
                                type='button'
                                onClick={() => this.like(user)}
                              ></MatchaButton>
                            </>
                          ) : (
                            <>
                              <Star fill='yellow' /> <br />
                              <MatchaButton
                                text='Unlike'
                                type='button'
                                onClick={() => this.unlike(user)}
                              />
                            </>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {didListedUserLikeMe === null ? (
                            'They did not like me yet'
                          ) : didListedUserLikeMe ? (
                            <>
                              {' '}
                              They liked me already
                              <br />
                            </>
                          ) : (
                            <>
                              {' '}
                              They liked me
                              <br />
                            </>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {didILikeListedUser && didListedUserLikeMe ? (
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

export default withTranslation()(withFirebase(Suggestions));
