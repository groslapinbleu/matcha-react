import React, { Component } from 'react'
import { Link } from "react-router-dom"
import RedBox from '../components/RedBox'
import { withFirebase } from '../services/Firebase'
import Footer from '../components/Footer';
import { withSnackbar } from 'react-simple-snackbar'

class DeleteAccount extends Component {

    handleDelete = () => {
        const { auth, doDelete } = this.props.firebase
        console.log("Ready to delete account of user " + auth.currentUser)
        const { openSnackbar } = this.props

        doDelete()
            .then(function () {
                // User deleted.
                console.log('Account deleted!')
                // note: we are automatically redirected to landing page
            })
            .catch(function (error) {
                // An error happened.
                console.log('Account deletion failed')
                openSnackbar(error.message)
            })
    }

    render() {
        const { auth } = this.props.firebase

        return (
            <div className="p-5">
                <RedBox title="Delete Account">
                    <p>{auth.currentUser.email}/{auth.currentUser.displayName}</p>
                    <p className="text-3xl">Are you sure?</p>
                    <p className="text-xl">This action cannot be undone</p>
                    <button className="m-2 p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="button" onClick={this.handleDelete}>Confirm deletion</button>
                    <Link className="hover:underline" to="/profile">Cancel</Link>
                </RedBox>
                <Footer></Footer>
            </div>
        )
    }
}

export default withFirebase(withSnackbar(DeleteAccount))