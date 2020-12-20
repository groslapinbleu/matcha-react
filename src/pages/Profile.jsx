import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from "react-router-dom";
import { withFirebase } from '../services/Firebase'
import MatchaBox from '../components/MatchaBox';
import ProfileForm from 'components/ProfileForm'
import PasswordChangeForm from 'components/PasswordChangeForm';
import Spinner from 'react-loader-spinner'


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loadingUser: true,
      userData: null,
      roles: {},
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // retrieve user profile data from db
  componentDidMount() {
    const { auth, user } = this.props.firebase
    try {
      user(auth.currentUser.uid)
        .on("value", snapshot => {
          this.setState({ loadingUser: true })
          console.log("Profile ComponentDidMount callback : just read user data from db")
          const userData = snapshot.val();
          if (userData) {
            console.log("Profile ComponentDidMount :  user.description = " + userData.description)
            this.setState({ userData: userData, roles: userData.roles, loadingUser: false });
          } else {
            console.log("Profile ComponentDidMount : weird, no data retrieved in db")
            this.setState({ loadingUser: false })
          }

        });
    } catch (error) {
      this.setState({ error: error.message, loadingUser: false })
    }
  }

  componentWillUnmount() {
    const { auth, user } = this.props.firebase
    if (auth.currentUser)
      user(auth.currentUser.uid).off()
  }

  // this allows to validate the field when pressing the Enter key
  handleKeyUp = (e) => {
    if (e.keyCode === 13) { // alternativement on peut tester e.key === 'Enter'

      console.log('Enter key has been pressed')
      this.handleDisplayNameInput()
    }

  }


  async handleFormSubmit(userData) {
    const { user, auth } = this.props.firebase
    await user(auth.currentUser.uid)
      .update(userData)
      .catch(error => this.setState({ error: error.message }))

    this.setState({
      userData: userData
    })
  }

  render() {
    const { userData } = this.state
    console.log("Profile render : userData = " + userData)
    return (
      <div className="profile">
        <Header></Header>

        {this.state.loadingUser
          ? <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
          : this.state.roles && this.state.roles.ADMIN === true
            ? <section className="p-5 shadow">
              <MatchaBox title="Admin">
                <Link className="hover:underline" to="/admin">Go to admin menu</Link>
              </MatchaBox>
            </section>
            : null}
        <section className="p-5 shadow">
          {userData
            ? <MatchaBox title="Profile">
              <ProfileForm user={userData} onSubmit={this.handleFormSubmit} />
            </MatchaBox>
            : <div className="flex items-center justify-center"><Spinner type='Puff' color='#038E9F' height={50} width={50} /></div>
          }
        </section>
        <section className="p-5 shadow">
          <MatchaBox title="Reset password">
            <PasswordChangeForm />
          </MatchaBox>
        </section>
        <section className="p-5 shadow">
          <MatchaBox title="Danger Zone" color="red">
            <Link className="hover:underline" to="/deleteaccount">Delete your account </Link>
          </MatchaBox>
        </section >
        <Footer></Footer>
      </div>
    )
  }
}

export default withFirebase(Profile)