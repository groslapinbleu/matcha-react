import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';

export default class HomePage extends Component {
  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <section>
          <div className="pt-20">
            <div className="container mx-auto text-center py-5 bg-indigo-50">
              <h1 className="text-4xl">Welcome to Matcha-React</h1>
              <p className="text-2xl">A great place to share your thoughts with friends</p>
              {auth().currentUser ?
                <p>Currently connected as {auth().currentUser.email}</p> :
                <div className="mt-4">
                  <Link className="btn btn-primary px-5 mr-3 hover:underline" to="/signup">Create New Account</Link>
                  <Link className="btn px-5 hover:underline" to="/login">Login to Your Account</Link>
                </div>
              }
            </div>
          </div>
        </section>
        <Footer></Footer>
      </React.Fragment>
    )
  }
}