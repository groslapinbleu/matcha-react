import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import { withSnackbar } from 'react-simple-snackbar';
import MatchaButton from 'components/MatchaButton';

class DeleteAccount extends Component {
  handleDelete = async () => {
    const { auth, doDelete, user, deleteFiles } = this.props.firebase;
    console.log('Ready to delete account of user ' + auth.currentUser);
    const { openSnackbar } = this.props;

    user(auth.currentUser.uid)
      .remove() // 1. remove user data in Realtime DB
      .then(console.log('Account database information deleted!'))
      // 2. TODO: delete images as well !
      .then(deleteFiles(auth.currentUser.uid))
      .then(async () => {
        try {
          await doDelete(); // 3. delete authentication information
        } catch (error) {
          // An error happened. Currently not properly handled : the user data is deleted by the authentication info remains
          console.log(
            'Account authentication deletion failed. Please logout then login and try to delete your account again'
          );
          openSnackbar(error.message);
        }
      })
      .then(console.log('Account authentication information deleted!'))
      // note: we are automatically redirected to landing page
      .catch((error) => {
        // An error happened.
        console.log('Account deletion failed');
        openSnackbar(error.message);
      });
  };

  render() {
    const { auth, authUser } = this.props.firebase;

    return (
      <div className='p-5'>
        <MatchaBox title='Delete Account' color='red'>
          <p>
            {auth.currentUser.email}/{authUser.username}
          </p>
          <p className='text-3xl'>Are you sure?</p>
          <p className='text-xl'>This action cannot be undone</p>
          <MatchaButton
            text='Confirm deletion'
            type='button'
            onClick={this.handleDelete}
            color='red'
          ></MatchaButton>
          <Link className='hover:underline' to='/profile'>
            Cancel
          </Link>
        </MatchaBox>
        <Footer></Footer>
      </div>
    );
  }
}

export default withFirebase(withSnackbar(DeleteAccount));
