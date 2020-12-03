import React, { Component } from "react";
import { Link } from "react-router-dom";
// import Header from "../components/Header";
import { signin } from "../helpers/auth";
import Footer from '../components/Footer';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }



  render() {
    return (
      <div className="profile pt-20">
        <div className="p-6 max-w-sm mx-auto bg-indigo-50 rounded-xl shadow-md flex items-center space-x-4 border-l-8 border-indigo-500">
          {/* <Header></Header> */}
          <form className=""
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <h1 className="text-center text-2xl">
              Login to
            <Link className="px-1 hover:underline" to="/">
                Matcha-react
            </Link>
            </h1>
            <p>Fill in the form below to login to your account.</p>
            <hr />
            <div>
              <input
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </div>
            <div>
              <input
                placeholder="Password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                type="password"
              />
            </div>
            <div>
              {this.state.error ? (
                <p>{this.state.error}</p>
              ) : null}
              <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="submit">Login</button>
            </div>
            <hr />
            <p>
              Don't have an account? <Link className="hover:underline" to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

