import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IndigoBox from "components/IndigoBox"
import { withFirebase } from 'services/Firebase';
// import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    console.log("usersObject : calling firebase")
    try {
      this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();
        console.log("UserList: usersObject = " + usersObject)
        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }))

        this.setState({
          users: usersList,
          loading: false,
        })
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <IndigoBox title="Users">
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>Username:</strong> {user.username}
              </span>
              <span className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white">
                <Link
                  to={{
                    pathname: `/admin/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </IndigoBox>);
  }
}

export default withFirebase(UserList);
