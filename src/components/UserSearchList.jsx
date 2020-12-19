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
      limit: 5
    }
    this.extractFilteredUsers = this.extractFilteredUsers.bind(this);
    this.askConnection = this.askConnection.bind(this);

  }

  componentDidMount() {
    this.onListenForUsers()
  }

  askConnection(userUid) {
    console.log("askConnection")
    // const { uid } = this.props.firebase.authUser
    // this.props.firebase.user(userUid).child('')    
  }

  extractFilteredUsers(snapshot, uid) {
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
      this.setState({ error })
    }
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
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
            {users.map(user => (
              <tr key={user.uid}>
                <td className="border border-indigo-800">
                  <Avatar username={user.username} photoURL={user.photoURL}></Avatar>
                </td>
                <td className="border border-indigo-800">
                  {user.username}
                </td>
                <td className="border border-indigo-800">
                  CONNECTED YES/NO
                </td>
                <td>
                  <MatchaButton>
                    <Link
                      to={{
                        // pathname: `/admin/${user.uid}`,
                        pathname: `/chat`,
                        state: { user },
                      }}
                    >

                      Engage conversation
                </Link>
                  </MatchaButton>
                </td>
                <td>
                  <MatchaButton text="Ask for connection" type="button" onClick={() => this.askConnection(user.uid)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.error && <li>{this.state.error.message}</li>}
      </MatchaBox>);
  }
}

export default withFirebase(UserSearchList);
