import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MatchaButton from 'components/MatchaButton';
import RadioButtons from 'components/RadioButtons';
import Dropdown from 'components/Dropdown';
import { defaultUserData, regions, genders, tags } from 'models/User';
import { isEmptyString, isValidEmail } from '../helpers/validation';
import Alert from './Alert';
import Avatar from './Avatar';
import DatePicker from './DatePicker';
import MultiChoiceSelector from 'components/MultiChoiceSelector';
import formatDateTime from 'helpers/formatDateTime';
import { withTranslation } from 'react-i18next';

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modified: false,
      userData: {
        ...defaultUserData,
        ...this.props.user,
        birthday: this.props.user.birthday,
      },
    };
  }

  updateStateFromProps() {
    const userData = {
      ...this.state.userData,
      ...this.props.user,
      birthday: this.props.user.birthday,
    };
    this.setState({ userData });
  }

  componentDidMount() {
    console.log('ProfileForm componentDidMount');
    this.updateStateFromProps();
  }

  handleChange = (event) => {
    const userData = {
      ...this.state.userData,
      [event.target.name]: event.target.value,
    };
    this.setState({
      userData,
      modified: true,
    });
  };

  handleChangeRadioButton = (name, value) => {
    const userData = {
      ...this.state.userData,
      [name]: parseInt(value, 10),
    };
    this.setState({
      userData,
      modified: true,
    });
  };

  handleChangeCheckbox = (event) => {
    console.log('handleChangeCheckbox');
    const userData = {
      ...this.state.userData,
      [event.target.name]: !this.state.userData[event.target.name],
    };
    this.setState({
      userData,
      modified: true,
    });
  };

  handleChangeMultiChoiceSelector = (name, value) => {
    console.log('handleChangeMultiChoiceSelector');

    const userData = {
      ...this.state.userData,
      [name]: value,
    };
    this.setState({
      userData,
      modified: true,
    });
  };

  handleDayChange = (day) => {
    if (day) {
      const userData = {
        ...this.state.userData,
        birthday: day.getTime(),
      };
      this.setState({
        userData,
        modified: true,
      });
    }
  };

  readUserDataFromState() {
    const userData = {
      ...this.state.userData,
    };
    return userData;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = this.readUserDataFromState();
    this.props.onSubmit(userData);
    this.setState({ modified: false });
  };

  render() {
    const { t } = this.props;

    const { userData } = this.state;
    console.group(`ProfileForm render : userData = ${userData}`);
    const isInvalid =
      !this.state.modified ||
      isEmptyString(userData.username) ||
      !isValidEmail(userData.email) ||
      userData.birthday === null ||
      userData.birthday === undefined;

    const username = t('profile_form.username', 'Username');
    const firstname = t('profile_form.firstname', 'Firstname');
    const lastname = t('profile_form.lastname', 'Lastname');
    const gender = t('profile_form.gender', 'Gender');
    const preferredGender = t(
      'profile_form.preferred_gender',
      'Preferred gender'
    );
    const rating = t('profile_form.rating', 'Rating');
    const region = t('profile_form.region', 'Region');
    const birthday = t('profile_form.birthday', 'Birthday');
    const visibility = t('profile_form.visibility', 'Visibility');

    return (
      <div>
        {userData ? (
          <form onSubmit={this.handleSubmit}>
            <table className='table-auto'>
              <tbody>
                <tr className='border-b-2 border-solid'>
                  <th>Email</th>
                  <td>{this.state.userData.email}</td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{rating}</th>
                  <td>{this.state.userData.rating}</td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>Photo</th>
                  <td>
                    <Avatar
                      username={this.state.username}
                      photoURL={userData.photoURL}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{username}</th>
                  <td>
                    <input
                      name='username'
                      placeholder={username}
                      value={userData.username}
                      type='text'
                      onChange={this.handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{firstname}</th>
                  <td>
                    <input
                      name='firstname'
                      placeholder={firstname}
                      value={userData.firstname}
                      type='text'
                      onChange={this.handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{lastname}</th>
                  <td>
                    <input
                      name='lastname'
                      placeholder={lastname}
                      value={userData.lastname}
                      type='text'
                      onChange={this.handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>Description</th>
                  <td>
                    <textarea
                      name='description'
                      placeholder='Description'
                      rows='5'
                      value={userData.description}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{birthday}</th>
                  <td>
                    <DatePicker
                      onDayChange={this.handleDayChange}
                      value={new Date(this.state.userData.birthday)}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{gender}</th>
                  <td>
                    <RadioButtons
                      selectedElement={this.state.userData.gender}
                      elementList={genders}
                      name='gender'
                      className='mr-5'
                      onSelect={this.handleChangeRadioButton}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{preferredGender}</th>
                  <td>
                    <RadioButtons
                      selectedElement={this.state.userData.preferredGender}
                      elementList={genders}
                      name='preferredGender'
                      className='mr-5'
                      onSelect={this.handleChangeRadioButton}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{region}</th>
                  <td>
                    <Dropdown
                      selectedElement={this.state.userData.region}
                      elementList={regions}
                      name='region'
                      className='mr-5'
                      onSelect={this.handleChangeRadioButton}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>Tags</th>
                  <td>
                    <MultiChoiceSelector
                      selectedElements={this.state.userData.tags}
                      elementList={tags}
                      name='tags'
                      className='ml-3 mr-1'
                      onSelect={this.handleChangeMultiChoiceSelector}
                    />
                  </td>
                </tr>
                <tr className='border-b-2 border-solid'>
                  <th>{visibility}</th>
                  <td>
                    <label>
                      <input
                        className='mr-5'
                        type='checkbox'
                        name='visible'
                        checked={userData.visible}
                        onChange={this.handleChangeCheckbox}
                      />
                      {t(
                        'profile_form.visibility_message',
                        'I want my profile to be visible to others'
                      )}
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
            <MatchaButton
              text={t('profile_form.validate-button', 'Validate')}
              type='submit'
              disabled={isInvalid}
            />
            <div className='text-center text-xs'>
              {t('profile_form.last_updated', 'Last updated ')}{' '}
              {formatDateTime(userData.updated)}
            </div>
          </form>
        ) : (
          <Alert color='red'>
            {t('profile_form.invalid_user', 'Invalid user!')}
          </Alert>
        )}
      </div>
    );
  }
}

ProfileForm.propTypes = {
  user: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default withTranslation()(ProfileForm);
