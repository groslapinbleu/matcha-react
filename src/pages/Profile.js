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
                        <th>Name</th><td>{auth().currentUser.displayName}</td></tr>
                      <tr>
                        <th>Email</th><td>{auth().currentUser.email}</td></tr>
                      <tr>
                        <th>Photo</th><td>
                          {/* le className ci-dessous vien t de tailwind */}
                          <img className="rounded-full shadow h-28 w-28 mx-auto" src={auth().currentUser.photoURL} alt={auth().currentUser.displayName} />
                        </td>
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