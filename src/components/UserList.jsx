import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from 'components/MatchaBox';
import { withFirebase } from 'services/Firebase';
// import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    try {
      this.ref = this.props.firebase.users().on('value', (snapshot) => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
          uid: key,
        }));

        this.setState({
          users: usersList,
          loading: false,
          error: null,
        });
      });
    } catch (error) {
      console.log(error.message);
      this.setState({ error });
    }
  }

  componentWillUnmount() {
    this.props.firebase.users().off('value', this.ref);
  }

  render() {
    const { users, loading } = this.state;

    return (
      <MatchaBox title='Users'>
        {loading && <div>Loading ...</div>}
        <table className='divide-y divide-gray-200-auto '>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Username
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Firstname
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Lastname
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{user.username}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {user.firstname}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>{user.lastname}</td>
                <td className='px-6 py-4 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white'>
                  <Link
                    to={{
                      pathname: `/admin/${user.uid}`,
                      state: { user },
                    }}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.state.error && <li>{this.state.error.message}</li>}
      </MatchaBox>
    );
  }
}

export default withFirebase(UserList);
