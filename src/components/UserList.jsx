import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from 'components/MatchaBox';
import { withFirebase } from 'services/Firebase';
import MatchaButton from './MatchaButton';
import { withTranslation } from 'react-i18next';

// import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      error: null,
      limit: 10,
    };
  }

  componentDidMount() {
    this.onListenForUsers();
  }

  componentWillUnmount() {
    this.props.firebase.unsubscribeFromUsers();
  }

  onListenForUsers = () => {
    console.log('UserList onListenForUsers');
    this.setState({ loading: true });
    try {
      this.props.firebase.subscribeToUsers(this.state.limit, (usersList) => {
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
  };

  onNextPage = () => {
    this.setState(
      (state) => ({ limit: state.limit + 5 }),
      this.onListenForUsers
    );
  };

  componentWillUnmount() {
    this.props.firebase.users().off('value', this.ref);
  }

  render() {
    const { users, loading } = this.state;
    const { t } = this.props;

    return (
      <MatchaBox title='Users'>
        {loading && <div>Loading ...</div>}
        <div className='m-2 p-2'>
          <MatchaButton
            text={t('user_list.get_more_users_button', 'Get more users')}
            type='button'
            onClick={this.onNextPage}
          />
        </div>
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

export default withTranslation()(withFirebase(UserList));
