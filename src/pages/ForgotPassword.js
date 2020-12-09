import React, { Component } from "react";
import { Link } from "react-router-dom";
// import Header from "../components/Header";
// import { sendPasswordResetEmail } from "../helpers/auth";
import Footer from '../components/Footer';
import { withSnackbar } from 'react-simple-snackbar'
import { FirebaseContext } from '../services/Firebase'

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // if an email parameter has been provided with the Link, use it
        const { email } = this.props.location.state
        if (email !== undefined) {
            console.log('this email has been provided to the ForgotPassword component:' + email)
            this.setState({ email })
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault()
        this.setState({ error: "" })
        const { doPasswordReset } = this.context
        try {
            await doPasswordReset(this.state.email, this.state.password);
            // display message using a snackbar
            // cf. https://www.npmjs.com/package/react-simple-snackbar
            const { openSnackbar } = this.props
            openSnackbar('We have sent you a mail with a link to reset your password!')
            // then go back to login page
            this.props.history.push("/login")
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
                            Reset your password to
                            <Link className="px-1 hover:underline" to="/">
                                Matcha-react
                            </Link>
                        </h1>
                        <p>Enter your email to reset your password.</p>
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
                            {this.state.error ? (
                                <p>{this.state.error}</p>
                            ) : null}
                            <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="submit">Send reset email</button>
                        </div>
                        <hr />
                        <p>Already have an account? <Link className="hover:underline" to="/login">Login</Link> </p>
                        <p>Don't have an account? <Link className="hover:underline" to="/signup">Sign up</Link></p>
                    </form>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

// tells ForgotPassword that it can use a context
ForgotPassword.contextType = FirebaseContext

export default withSnackbar(ForgotPassword)