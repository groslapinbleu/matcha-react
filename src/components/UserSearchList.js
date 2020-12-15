import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from "components/MatchaBox"
import Avatar from "components/Avatar"

import { withFirebase } from 'services/Firebase';
// import * as ROUTES from '../../constants/routes';

class UserSearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      error: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    try {
      this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }))

        this.setState({
          users: usersList,
          loading: false,
          error: null
        })
      })
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
                <td className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">
                  <Link
                    to={{
                      // pathname: `/admin/${user.uid}`,
                      pathname: `/chat`,
                      state: { user },
                    }}
                  >
                    Chat
                </Link>
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
