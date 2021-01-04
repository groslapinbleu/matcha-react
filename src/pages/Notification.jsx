import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ImageList from '../components/ImageList';
import MultiChoiceSelector from 'components/MultiChoiceSelector';
import { tags } from 'models/User';

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
        <section>
          <MatchaBox title='Images'>
            <ImageList />
          </MatchaBox>
        </section>
        <Footer></Footer>
      </div>
    );
  }
}

export default withFirebase(Notification);
