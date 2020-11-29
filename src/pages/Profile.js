import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';

export default class Profile extends Component {
  render() {
    return (
      <div className="profile">
        <Header></Header>
        <section>
          <div className="jumbotron jumbotron-fluid py-5">
            <div className="container text-center py-5">
              <h1 className="display-4">Profile</h1>
                {auth().currentUser
                  ? <div>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th scope="row">Name</th>
                        {auth().currentUser.displayName}
                      </tr>
                      <tr>
                        <th scope="row">Email</th>
                        {auth().currentUser.email}
                      </tr>
                      <tr>
                        <th scope="row">Photo</th>
                        <img style={{maxWidth: '300px', maxHeight: '300px'}} src={auth().currentUser.photoURL} alt={auth().currentUser.displayName}/> 
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