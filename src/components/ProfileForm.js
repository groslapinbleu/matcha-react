import React, { Component } from 'react';
import PropTypes from 'prop-types'
import UserIcon from '../Icons/UserIcon';
import Alert from '../components/Alert';
import { isEmptyString } from '../helpers/validation'
import MatchaButton from 'components/MatchaButton'
import RadioButton from 'components/RadioButton';
import { regions, genders } from 'models/UserData'

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
        this.handleChangeRadioButton = this.handleChangeRadioButton.bind(this);
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

    handleChangeRadioButton(name, value) {
        const userData = {
            ...this.state.userData,
            [name]: parseInt(value, 10)
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
                                        <RadioButton
                                            selectedElement={this.state.userData.gender}
                                            arrayValues={genders}
                                            name="gender"
                                            className="mr-5"
                                            onSelect={this.handleChangeRadioButton}
                                        ></RadioButton>
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Preferred gender</th>
                                    <td>
                                        <RadioButton
                                            selectedElement={this.state.userData.preferredGender}
                                            arrayValues={genders}
                                            name="preferredGender"
                                            className="mr-5"
                                            onSelect={this.handleChangeRadioButton}
                                        ></RadioButton>
                                    </td>
                                </tr>
                                <tr className="border-b-2 border-solid">
                                    <th>Region</th>
                                    <td>
                                        <RadioButton
                                            selectedElement={this.state.userData.region}
                                            arrayValues={regions}
                                            name="region"
                                            className="mr-5"
                                            onSelect={this.handleChangeRadioButton}
                                        ></RadioButton>
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