import React, { Component } from 'react';
import Image from 'components/Image';
import PropTypes from 'prop-types';
import MatchaButton from 'components/MatchaButton';
import FileInput from 'components/FileInput';
import { withFirebase } from 'services/Firebase';
import { readJsonConfigFile } from 'typescript';

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editList: false,
      addingFile: false,
      items: [],
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddImage = this.handleAddImage.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleSelectForProfile = this.handleSelectForProfile.bind(this);
  }

  componentDidMount() {
    console.log('ImageList componentDidMount');
    const { images } = this.props.firebase;
    const { uid } = this.props.firebase.authUser;
    const databaseItems = [];
    const listRef = images(uid);
    listRef
      .listAll()
      .then((res) => {
        // res.prefixes.forEach(function (folderRef) {
        //   console.log('folderRef: ' + folderRef);
        // });
        res.items.forEach((item) => {
          console.log('item: ' + item);
          databaseItems.push(item);
        });
        this.setState({ items: databaseItems });
      })
      .catch((error) => console.log('error: ' + error.message));
  }

  handleEdit(event) {
    console.log('ImageList handleEdit');
    this.setState({ editList: !this.state.editList, addingFile: false });
  }

  handleDelete(event, index) {
    console.log('handleDelete with index ' + index);
    const items = [...this.state.items];
    const item = items[index];
    items.forEach((item, index) => console.log('index ' + index + ' ' + item));
    console.log('Deleting item ' + item + ' in remote storage');
    item
      .delete()
      .then(() => {
        console.log('Remote deletion successul');
        items.forEach((item, index) =>
          console.log('index ' + index + ' ' + item)
        );

        items.splice(index, 1);
        items.forEach((item, index) =>
          console.log('index ' + index + ' ' + item)
        );
        this.setState({ items });
      })
      .catch((error) => console.log(error.message));
  }

  handleSelectForProfile(event, index) {
    console.log('handleSelectForProfile with index ' + index);
    // TODO: must write url of selected photo into authenticated User photoURL atribute
    const { user, auth } = this.props.firebase;

    // 1. get an url from the item
    const item = this.state.items[index];

    item
      .getDownloadURL()
      .then((url) => {
        // 2. then update the user in firebase realtime db
        user(auth.currentUser.uid).update({ photoURL: url });
      })
      .catch((error) => console.log(error.message));
  }

  handleAddImage(event) {
    this.setState({ addingFile: true });
  }

  handleNewImage(file) {
    const items = [...this.state.items];
    const { image } = this.props.firebase;
    const { uid } = this.props.firebase.authUser;

    console.log('Adding item ' + file.name + ' into remote storage');
    const newItemRef = image(uid, file.name);
    newItemRef
      .put(file)
      .then((snapshot) => {
        // note : if a file with the same name already exist in the remote storage,
        // it will be replaced by the new one. Therefor I only add the new one
        // to state.items if if does not already exist
        const index = items.findIndex((item) => {
          return item.name === file.name;
        });
        if (index > -1) {
          console.log(
            file.name +
              ' already exists in this.state.items: no need to push it'
          );
        } else {
          items.push(newItemRef);
          this.setState({ items });
        }
        this.setState({ addingFile: false });
      })
      .catch((error) => console.log(error.message));
  }

  render() {
    console.log('ImageList render');
    return (
      <div>
        <div className='inline-flex'>
          {this.state.items.map((item, index) => {
            return (
              <div key={`image-${item.name}`} className='mr-5'>
                <Image className='' username='' item={item} />
                {this.state.editList ? (
                  <>
                    <MatchaButton
                      text='X'
                      onClick={(e) => this.handleDelete(e, index)}
                    />
                    <MatchaButton
                      text='Select for profile'
                      onClick={(e) => this.handleSelectForProfile(e, index)}
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
            );
          })}
          {this.state.editList &&
          !this.state.addingFile &&
          this.state.items.length < 5 ? (
            <MatchaButton text='+' onClick={this.handleAddImage} />
          ) : null}
          {this.state.addingFile ? (
            <FileInput onClick={this.handleNewImage} />
          ) : null}
        </div>
        <br />
        {this.state.editList ? (
          <MatchaButton text='Done' onClick={this.handleEdit} />
        ) : (
          <MatchaButton text='Edit Images' onClick={this.handleEdit} />
        )}
      </div>
    );
  }
}

ImageList.propTypes = {
  onImageListChange: PropTypes.func,
};
export default withFirebase(ImageList);
