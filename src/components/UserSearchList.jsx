import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from "components/MatchaBox"
import MatchaButton from "components/MatchaButton"
import Avatar from "components/Avatar"

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
    this.cancelConnection = this.cancelConnection.bind(this);
  }

  componentDidMount() {
    this.onListenForUsers()
  }

  askConnection(toUser) {
    console.log("askConnection")
    const isFriend = this.isFriend(toUser.uid)

    const { authUser, user } = this.props.firebase
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
        .then(
          this.setState({
            toggleRefresh: !this.state.toggleRefresh
          })
        )
    }
  }

  cancelConnection(toUser) {
    console.log("cancelConnection")
    const isFriend = this.isFriend(toUser.uid)

    const { authUser, user } = this.props.firebase
    if (isFriend === false) {
      const friends = {
        ...authUser.friends,
      }
      friends[toUser.uid] = null
      user(authUser.uid)
        .child('friends')
        .update(friends)
        .then(
          this.setState({
            toggleRefresh: !this.state.toggleRefresh
          })
        )
    }
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


  isFriend(uid) {
    const { authUser } = this.props.firebase
    if (uid in authUser.friends) {
      if (authUser.friends[uid]) {
        return true
      } else
        return false
    }
    return null
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

    return (
      <MatchaBox title="Users">
        {loading && <div>Loading ...</div>}
        <table className="table-auto ">
          <thead>
            <tr>
              <th className="border border-indigo-800">Photo</th>
              <th className="border border-indigo-800">Username</th>
              <th className="border border-indigo-800">Connected</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isFriend = this.isFriend(user.uid)
              return (
                <tr key={user.uid}>
                  <td className="border border-indigo-800">
                    <Avatar username={user.username} photoURL={user.photoURL}></Avatar>
                  </td>
                  <td className="border border-indigo-800">
                    {user.username}
                  </td>
                  <td className="border border-indigo-800">
                    {isFriend === null
                      ? 'Not friend yet'
                      : isFriend
                        ? 'Already my friend'
                        : 'Request to be friends already sent'
                    }
                  </td>
                  {isFriend
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
                  {isFriend === null // only show connection button if not already friends
                    ? <td>
                      <MatchaButton text="Ask for connection" type="button" onClick={() => this.askConnection(user)} />
                    </td>
                    : null
                  }
                  {isFriend === false // only show connection button if not already friends
                    ? <td>
                      <MatchaButton text="Cancel connection request" type="button" onClick={() => this.cancelConnection(user)} />
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
