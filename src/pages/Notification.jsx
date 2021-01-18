import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ImageList from '../components/ImageList';
import MultiChoiceSelector from 'components/MultiChoiceSelector';
import MatchaTable from 'components/MatchaTable';
import { tags } from 'models/User';
import { withTranslation } from 'react-i18next';
import navigatorLanguage from 'helpers/navigatorLanguage';
import ChangeLanguage from 'components/ChangeLanguage';

class Notification extends Component {
  constructor(props) {
    console.log('Notification constructor');
    super(props);
    this.state = {
      selectedElements: [],
    };
  }

  handleChangeDropdown = (name, value) => {
    console.log('name=' + name + ' value=' + value);
  };

  onImageListChange = (imageList) => {
    console.log('onImageListChange imageList=' + imageList);
    // TODO: update the user with this list
  };

  render() {
    const { authUser } = this.props.firebase;
    const { i18n } = this.props;

    return (
      <div>
        <Header></Header>
        <section className='p-5 shadow'>
          <MatchaBox title='Notification Page'>
            <p>Work In Progress</p>
            <MultiChoiceSelector
              selectedElements={this.state.selectedElements}
              elementList={tags}
              name='tags'
              className='ml-3 mr-1'
              onSelect={this.handleChangeDropdown}
              multiple={false}
            />
          </MatchaBox>
        </section>
        <section className='p-5 shadow'>
          <MatchaBox title='Table'>
            <MatchaTable />
          </MatchaBox>
        </section>
        <section className='p-5 shadow'>
          <MatchaBox title='Languages'>
            <div>Navigator language = {navigatorLanguage()}</div>
            <div>i18next language = {i18n.language}</div>
            <div>i18next locale = {i18n.locale}</div>
          </MatchaBox>
        </section>

        <Footer></Footer>
      </div>
    );
  }
}

export default withTranslation()(withFirebase(Notification));
