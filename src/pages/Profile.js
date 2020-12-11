import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from "react-router-dom";
import UserIcon from '../Icons/UserIcon';
import PencilButton from '../components/PencilButton';
import CheckButton from '../components/CheckButton';
import { isEmptyString } from '../helpers/validation'
import { withFirebase } from '../services/Firebase'
import RedBox from '../components/RedBox';
import IndigoBox from '../components/IndigoBox';
import PasswordChangeForm from 'components/PasswordChangeForm';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      displayName: "",
      updatingDisplayName: false,
      updatingDescription: false,
      loadingUser: false,
      description: ""
    };
    this.updateTheDisplayName = this.updateTheDisplayName.bind(this);
    this.updateTheDescription = this.updateTheDescription.bind(this);
    this.handleDisplayNameInput = this.handleDisplayNameInput.bind(this);
    this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // retrieve user profile data from db
  async componentDidMount() {
    const { auth, user } = this.props.firebase

    this.setState({ error: null, loadingUser: true })
    try {
      user(auth.currentUser.uid)
        .on("value", snapshot => {
          const userData = snapshot.val();
          if (userData) {
            console.log("user.description=" + userData.description)
            this.setState({ displayName: userData.username, description: userData.description });
          }
          this.setState({ loadingUser: false })
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

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateTheDisplayName() {
    // make displayName editable 
    this.setState({ updatingDisplayName: true })
  }

  async handleDisplayNameInput() {
    const { auth, user } = this.props.firebase
    if (isEmptyString(this.state.displayName))
      this.setState({ error: 'Display Name cannot be empty' })
    else {
      this.setState({ error: '' })
      try {
        return user(auth.currentUser.uid)
          .update({
            username: this.state.displayName,
          })
      } catch (error) {
        this.setState({ error: error.message })
      }
    }
    // reset display name to read only
    this.setState({ updatingDisplayName: false })
  }

  async handleDescriptionInput() {
    const { auth, user } = this.props.firebase
    this.setState({ error: '' })
    try {
      await user(auth.currentUser.uid)
        .update({
          description: this.state.description
        })

    } catch (error) {
      this.setState({ error: error.message });
    }
    // reset description to read only
    this.setState({ updatingDescription: false })
  }

  updateTheDescription() {
    this.setState({ updatingDescription: true })
  }

  render() {
    const { auth } = this.props.firebase

    return (
      <div className="profile">
        <Header></Header>
        <section className="p-5 shadow">
          <IndigoBox title="Profile">
            {auth.currentUser
              ? <div>
                <table className="table-auto">
                  {/*                   <thead>
                    <tr><th colSpan="2" className="text-center text-2xl">Profile</th></tr>
                  </thead> */}
                  <tbody>
                    <tr>
                      <th>Display Name</th>
                      <td>
                        {this.state.updatingDisplayName
                          ? <span><input name="displayName" placeholder="Display Name" value={this.state.displayName} type="text" onChange={this.handleChange} onKeyUp={this.handleKeyUp} required></input><CheckButton onClick={this.handleDisplayNameInput} /></span>
                          : <span>{this.state.displayName}<PencilButton onClick={this.updateTheDisplayName} /></span>
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Email</th><td>{auth.currentUser.email}</td></tr>
                    <tr>
                      <th>Photo</th><td>
                        {auth.currentUser.photoURL
                          ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={auth.currentUser.photoURL} alt={auth.currentUser.displayName} />
                          : <UserIcon height={16} width={16}  ></UserIcon>
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>My description</th>
                      <td>
                        {this.state.updatingDescription
                          ? <span><textarea name="description" placeholder="Description" rows="5" value={this.state.description} onChange={this.handleChange}></textarea><CheckButton onClick={this.handleDescriptionInput} /></span>
                          : <span><textarea placeholder="Description" rows="5" defaultValue={this.state.description} readOnly></textarea><PencilButton onClick={this.updateTheDescription} /></span>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              : <div class="alert alert-light" role="alert">
                Weird! You don't seem to be properly authenticated
                    </div>
            }
          </IndigoBox>
        </section>
        <section className="p-5 shadow">
          <IndigoBox title="Reset password">
            <PasswordChangeForm />
          </IndigoBox>
        </section>
        <section className="p-5 shadow">
          <RedBox title="Danger Zone">
            <Link className="hover:underline" to="/deleteaccount">Delete your account </Link>
          </RedBox>
        </section >
        <Footer></Footer>
      </div>
    )
  }
}

export default withFirebase(Profile)