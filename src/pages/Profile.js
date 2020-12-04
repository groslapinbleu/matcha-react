import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import UserIcon from '../Icons/UserIcon';
import PencilButton from '../components/PencilButton';
import CheckButton from '../components/CheckButton';
import isEmptyString from '../helpers/isEmptyString'
import { updateUserProfile } from "../helpers/auth";


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      displayName: auth().currentUser.displayName,
      updateDisplayName: false,
      description: ""
    };
    this.updateTheDisplayName = this.updateTheDisplayName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
    this.handleDisplayNameInput = this.handleDisplayNameInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  updateTheDisplayName() {
    // make displayName editable 
    this.setState({ updateDisplayName: true })
  }

  async handleDisplayNameInput() {
    // TO DO: save display name to database 
    if (isEmptyString(this.state.displayName))
      this.setState({ error: 'Display Name cannot be empty' })
    else {
      this.setState({ error: '' })
      try {
        await updateUserProfile(this.state.displayName)
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
    // reset display name to read only
    this.setState({ updateDisplayName: false })
  }

  updateDescription() {

  }

  render() {
    return (
      <div className="profile">
        <Header></Header>
        <section className="pt-20">
          <div className="p-6 max-w-sm mx-auto bg-blue-50 rounded-xl shadow-md flex items-center space-x-4 border-l-8 border-blue-500">
            <div className="flex-shrink-0">
              {auth().currentUser
                ? <div>
                  <table className="table-auto">
                    <thead>
                      <tr><th colSpan="2" className="text-center text-2xl">Profile</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Display Name</th>
                        <td>
                          {this.state.updateDisplayName
                            ? <span><input name="displayName" placeholder="Display Name" value={this.state.displayName} type="text" onChange={this.handleChange} required></input><CheckButton onClick={this.handleDisplayNameInput}/></span>
                            : <span>{this.state.displayName}<PencilButton onClick={this.updateTheDisplayName} /></span>
                          }
                        </td>
                      </tr>
                      <tr>
                        <th>Email</th><td>{auth().currentUser.email}</td></tr>
                      <tr>
                        <th>Photo</th><td>
                          {auth().currentUser.photoURL
                            ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={auth().currentUser.photoURL} alt={auth().currentUser.displayName} />
                            : <UserIcon height={16} width={16}  ></UserIcon>
                          }
                        </td>
                      </tr>
                      <tr>
                        <th>My description</th><td><textarea readOnly></textarea></td><td><PencilButton onClick={this.updateDescription} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                : <div class="alert alert-light" role="alert">
                  Weird! You don't seem to be properly authenticated
                    </div>}

            </div>
          </div>
        </section>
        <Footer></Footer>
      </div>
    )
  }
}