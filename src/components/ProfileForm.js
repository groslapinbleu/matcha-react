import React, { Component } from 'react';
import PropTypes from 'prop-types'
import UserIcon from '../Icons/UserIcon';
import Alert from '../components/Alert';
import { isEmptyString } from '../helpers/validation'
import MatchaButton from 'components/MatchaButton'

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            modified: false,
            userData: { ...this.props.user }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeButton = this.handleChangeButton.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    }

    handleChange(event) {
        const userData = {
            ...this.state.userData,
            [event.target.name]: event.target.value
        }
        this.setState({
            userData,
            modified: true
        })
    }

    handleChangeButton(event) {
        const userData = {
            ...this.state.userData,
            [event.target.name]: parseInt(event.target.value, 10)
        }
        this.setState({
            userData,
            modified: true
        })
    }

    handleChangeCheckbox(event) {
        console.log("handleChangeCheckbox")
        const userData = {
            ...this.state.userData,
            [event.target.name]: !this.state.userData[event.target.name]
        }
        this.setState({
            userData,
            modified: true
        })
    }


    readUserDataFromState() {
        const userData = {
            ...this.state.userData
        }
        return userData
    }


    handleSubmit(event) {
        event.preventDefault()
        const userData = this.readUserDataFromState()
        this.props.onSubmit(userData)
        this.setState({ modified: false })
    }
    render() {
        const { userData } = this.state
        console.group("ProfileForm render : userData = " + userData)
        const isInvalid = !this.state.modified || isEmptyString(userData.username) // TODO: mettre une vraie validation ici

        return (
            <div>
                { userData
                    ? <form onSubmit={this.handleSubmit}>
                        <table className="table-auto">
                            <tbody>
                                <tr className="border-b-2 border-solid">
                                    <th>Email</th><td>{this.state.userData.email}</td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Photo</th><td>
                                        {userData.photoURL
                                            ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={userData.photoURL} alt={this.state.username} />
                                            : <UserIcon height={16} width={16}  ></UserIcon>
                                        }
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">

                                    <th>Username</th>
                                    <td>
                                        <input name="username" placeholder="User Name" value={userData.username} type="text" onChange={this.handleChange} required></input>
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Description</th>
                                    <td>
                                        <textarea name="description" placeholder="Description" rows="5" value={userData.description} onChange={this.handleChange}></textarea>

                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Gender</th>
                                    <td>
                                        <label>
                                            <input className="mr-5" type="radio" name="gender" value={2} checked={userData.gender === 2} onChange={this.handleChangeButton} />
                                        Male</label><br />
                                        <label>
                                            <input className="mr-5" type="radio" name="gender" value={1} checked={userData.gender === 1} onChange={this.handleChangeButton} />
                                        Female</label><br />
                                        <label>
                                            <input className="mr-5" type="radio" name="gender" value={0} checked={userData.gender === 0} onChange={this.handleChangeButton} />
                                        Other</label>
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Preferred gender</th>
                                    <td>
                                        <label>
                                            <input className="mr-5" type="radio" name="preferredGender" value={2} checked={userData.preferredGender === 2} onChange={this.handleChangeButton} />
                                        Male</label><br />
                                        <label>
                                            <input className="mr-5" type="radio" name="preferredGender" value={1} checked={userData.preferredGender === 1} onChange={this.handleChangeButton} />
                                        Female</label><br />
                                        <label>
                                            <input className="mr-5" type="radio" name="preferredGender" value={0} checked={userData.preferredGender === 0} onChange={this.handleChangeButton} />
                                        Other</label>
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Visibility</th>
                                    <td>
                                        <label>
                                            <input className="mr-5" type="checkbox" name="visible" checked={userData.visible} onChange={this.handleChangeCheckbox}></input>
                                        I want my profile to be visible to others
                                        </label>
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