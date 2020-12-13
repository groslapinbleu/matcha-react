import React, { Component } from 'react';
import PropTypes from 'prop-types'
import UserIcon from '../Icons/UserIcon';
import Alert from '../components/Alert';
import { isEmptyString } from '../helpers/validation'
import MatchaButton from 'components/MatchaButton'
import { defaultUserData } from 'models/UserData'

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            userData: { ...defaultUserData }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        const userData = {
            ...this.state.userData,
            [event.target.name]: event.target.value
        }
        this.setState({
            userData
        })
    }

    setUserDataToState() {
        // set state from props
        const userData = this.props.user
        console.log("userData = " + userData)
        this.setState({
            userData: { ...userData }
        })
    }

    readUserDataFromState() {
        const userData = {
            ...this.state.userData
        }
        return userData
    }

    componentDidMount() {
        this.setUserDataToState()
    }

    handleSubmit(event) {
        event.preventDefault()
        const userData = this.readUserDataFromState()
        this.props.onSubmit(userData)
    }
    render() {
        const { user } = this.props
        const isInvalid = isEmptyString(this.state.username) // TODO: mettre une vraie validation ici

        return (
            <div>
                {user
                    ? <form onSubmit={this.handleSubmit}>
                        <table className="table-auto">
                            {/*                   <thead>
                    <tr><th colSpan="2" className="text-center text-2xl">Profile</th></tr>
                  </thead> */}
                            <tbody>
                                <tr>
                                    <th>Email</th><td>{this.state.userData.email}</td></tr>
                                <tr>
                                    <th>Photo</th><td>
                                        {this.state.userData.photoURL
                                            ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={this.state.userData.photoURL} alt={this.state.username} />
                                            : <UserIcon height={16} width={16}  ></UserIcon>
                                        }
                                    </td>
                                </tr>
                                <tr>

                                    <th>Username</th>
                                    <td>
                                        <input name="username" placeholder="User Name" value={this.state.userData.username} type="text" onChange={this.handleChange} required></input>
                                    </td>
                                </tr>
                                <tr>
                                    <th>My description</th>
                                    <td>
                                        <textarea name="description" placeholder="Description" rows="5" value={this.state.userData.description} onChange={this.handleChange}></textarea>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <MatchaButton text="Validate" type="submit" disabled={isInvalid}></MatchaButton>

                    </form>
                    : <Alert color="red">
                        Invalid user!
                    </Alert>
                }
            </div>
        )
    }
}

ProfileForm.propTypes = {
    user: PropTypes.object,
    onSubmit: PropTypes.func
}
export default ProfileForm