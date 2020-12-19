import React, { Component } from "react"
import { Link } from "react-router-dom"
import Footer from '../components/Footer'
import { withSnackbar } from 'react-simple-snackbar'
import { withFirebase } from '../services/Firebase'
import MatchaBox from "../components/MatchaBox"
import {isValidEmail} from 'helpers/validation'
import MatchaButton from "components/MatchaButton"

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
        })
        // check email format
        if (event.target.name === 'email' && !isValidEmail(event.target.value)) {
            this.setState({error: "Invalid email"})
        } else {
            this.setState({error: ""})
        }
    }

    async handleSubmit(event) {
        event.preventDefault()
        this.setState({ error: "" })
        const { doPasswordReset, doUseDeviceLanguage} = this.props.firebase
        try {
            doUseDeviceLanguage()
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
        const { email } = this.state;
 
        const isInvalid = !isValidEmail(email)

        return (
            <div className="profile pt-20">
                <MatchaBox title="Reset your password">
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
                            <MatchaButton text="Send reset email" type="submit" disabled={isInvalid}></MatchaButton>
                        </div>
                        <hr />
                        <p>Already have an account? <Link className="hover:underline" to="/login">Login</Link> </p>
                        <p>Do not have an account? <Link className="hover:underline" to="/signup">Sign up</Link></p>
                    </form>
                </MatchaBox>
                <Footer></Footer>
            </div>
        );
    }
}



export default withFirebase(withSnackbar(ForgotPassword))