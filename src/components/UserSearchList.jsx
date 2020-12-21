import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from "components/MatchaBox"
import MatchaButton from "components/MatchaButton"
import Avatar from "components/Avatar"
import { isBFriendOfA } from 'models/User'
import { withFirebase } from 'services/Firebase';
// import * as ROUTES from '../../constants/routes';


class UserSearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      error: null,
      limit: 5,
      toggleRefresh: false
    }
    this.extractFilteredUsers = this.extractFilteredUsers.bind(this);
    this.askConnection = this.askConnection.bind(this);
    this.cancelRequestForConnection = this.cancelRequestForConnection.bind(this);
    this.acceptConnection = this.acceptConnection.bind(this);
    this.rejectConnection = this.rejectConnection.bind(this);

  }

  componentDidMount() {
    this.onListenForUsers()
  }

  askConnection(toUser) {
    console.log("askConnection")
    const { authUser, user } = this.props.firebase

    const isFriend = isBFriendOfA(authUser, toUser)

    if (isFriend) {
      // already friends, don't do anything
      console.log("askConnection: user " + authUser.uid + " is already friend with " + toUser.uid)
    } else {
      const friends = {
        ...authUser.friends,
      }
      friends[toUser.uid] = false
      user(authUser.uid)
        .child('friends')
        .update(friends)
    }
  }

  cancelRequestForConnection(toUser) {
    console.log("cancelConnection")
    const { authUser, user } = this.props.firebase
    const isFriend = isBFriendOfA(authUser, toUser)

    if (isFriend === false) {
      const friends = {
        ...authUser.friends,
      }
      friends[toUser.uid] = null
      user(authUser.uid)
        .child('friends')
        .update(friends)
    }
  }

  acceptConnection(fromUser) {
    console.log("acceptConnection")
    const { authUser, user } = this.props.firebase

    const isFriend = isBFriendOfA(fromUser, authUser)

    if (isFriend) {
      // already friends, don't do anything
      console.log("acceptConnection: user " + authUser.uid + " is already friend with " + fromUser.uid)
    } else {
      const friends = {
        ...fromUser.friends,
      }
      friends[authUser.uid] = true
      user(fromUser.uid)
        .child('friends')
        .update(friends)
    }
  }

  rejectConnection(fromUser) {
    console.log("rejectConnection")

  }

  extractFilteredUsers(snapshot, uid) {
    console.log("extractFilteredUsers")
    const usersObject = snapshot.val();
    if (usersObject) {
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }))

      // remove self and invisible users from user list
      const filteredUserList = usersList.filter(user => user.uid !== uid && user.visible === true)
      this.setState({
        users: filteredUserList,
      })

    }
    this.setState({
      loading: false,
      error: null
    })
  }



  onListenForUsers = () => {
    const { preferredGender, uid } = this.props.firebase.authUser

    console.log("preferredGender = " + preferredGender)
    this.setState({ loading: true });
    try {
      preferredGender === 0
        ? this.props.firebase.users()
          .orderByChild('gender')
          .limitToLast(this.state.limit)
          .on('value', snapshot => this.extractFilteredUsers(snapshot, uid))

        : this.props.firebase.users()
          .orderByChild('gender')
          .limitToLast(this.state.limit)
          .equalTo(preferredGender)
          .on('value', snapshot => this.extractFilteredUsers(snapshot, uid))

    } catch (error) {
      console.log(error.message)
      this.setState({ error, loading: false })
    }
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }


  render() {
    console.log("UserSearchList render")
    const { users, loading } = this.state;
    const { authUser } = this.props.firebase
    return (
      <MatchaBox title="Users">
        {loading && <div>Loading ...</div>}
        <table className="table-auto ">
          <thead>
            <tr>
              <th className="border border-indigo-800">Photo</th>
              <th className="border border-indigo-800">Username</th>
              <th className="border border-indigo-800">Connected on my side</th>
              <th className="border border-indigo-800">Connected on their side</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isListedUserMyFriend = isBFriendOfA(authUser, user)
              const amIFriendOfListedUser = isBFriendOfA(user, authUser)
              return (
                <tr key={user.uid}>
                  <td className="border border-indigo-800">
                    <Avatar username={user.username} photoURL={user.photoURL}></Avatar>
                  </td>
                  <td className="border border-indigo-800">
                    {user.username}
                  </td>
                  <td className="border border-indigo-800">
                    {isListedUserMyFriend === null
                      ? <> Not my friend yet <br />
                        <MatchaButton text="Ask for connection" type="button" onClick={() => this.askConnection(user)} />
                      </>
                      : isListedUserMyFriend
                        ? 'Already my friend'
                        : <> Request to be friends already sent <br />
                          <MatchaButton text="Cancel connection request" type="button" onClick={() => this.cancelRequestForConnection(user)} />
                        </>
                    }


                  </td>
                  <td className="border border-indigo-800">
                    {amIFriendOfListedUser === null
                      ? 'I am not their friend yet'
                      : amIFriendOfListedUser
                        ? <> I am their friend already<br />
                          <MatchaButton text="Reject connection request" type="button" onClick={() => this.rejectConnection(user)} />
                        </>

                        : <> They have asked me to be friends <br />
                          <MatchaButton text="Accept connection request" type="button" onClick={() => this.acceptConnection(user)} />
                          <MatchaButton text="Reject connection request" type="button" onClick={() => this.rejectConnection(user)} />
                        </>
                    }
                  </td>
                  {isListedUserMyFriend && amIFriendOfListedUser
                    ?
                    <td>
                      <MatchaButton>
                        <Link
                          to={{
                            // pathname: `/admin/${user.uid}`,
                            pathname: `/chat`,
                            state: { user },
                          }}
                        >
                          Chat
                </Link>
                      </MatchaButton>
                    </td>
                    : null
                  }

                </tr>
              )
            })}
          </tbody>
        </table>
        {this.state.error && <li>{this.state.error.message}</li>}
      </MatchaBox>);
  }
}

export default withFirebase(UserSearchList);
