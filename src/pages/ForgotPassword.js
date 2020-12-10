import React, { Component } from "react";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';
import { withSnackbar } from 'react-simple-snackbar'
import { withFirebase } from '../services/Firebase'
import IndigoBox from "../components/IndigoBox";

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
        const { doPasswordReset } = this.props.firebase
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
                <IndigoBox title="Reset your password">
                    <form className=""
                        autoComplete="off"
                        onSubmit={this.handleSubmit}
                    >
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
                </IndigoBox>
                <Footer></Footer>
            </div>
        );
    }
}



export default withFirebase(withSnackbar(ForgotPassword))