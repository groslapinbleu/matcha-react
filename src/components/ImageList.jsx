import React, { Component } from 'react';
import Image from 'components/Image';
import PropTypes from 'prop-types';
import MatchaButton from 'components/MatchaButton';
import FileInput from 'components/FileInput';
import { withFirebase } from 'services/Firebase';
import { withTranslation } from 'react-i18next';

class ImageList extends Component {
  state = {
    editList: false,
    addingFile: false,
    items: [],
  };

  async componentDidMount() {
    console.log('ImageList componentDidMount');
    const { getImages } = this.props.firebase;
    const { uid } = this.props.firebase.authUser;
    var databaseItems = [];
    try {
      databaseItems = await getImages(uid);
      this.setState({ items: databaseItems });
    } catch (error) {
      console.log('ImageList componentDidMount: ' + error.message);
    }
  }

  handleEdit = (event) => {
    // console.log('ImageList handleEdit');
    this.setState({ editList: !this.state.editList, addingFile: false });
  };

  handleDelete = (event, index) => {
    console.log('handleDelete with index ' + index);
    const { deleteImage } = this.props.firebase;

    const items = [...this.state.items];
    const item = items[index];
    // items.forEach((item, index) => console.log('index ' + index + ' ' + item));
    console.log('Deleting item ' + item + ' in remote storage');
    deleteImage(item)
      .then(() => {
        // console.log('Remote deletion successul');
        // items.forEach((item, index) =>
        //   console.log('index ' + index + ' ' + item)
        // );

        items.splice(index, 1);
        // items.forEach((item, index) =>
        //   console.log('index ' + index + ' ' + item)
        // );
        this.setState({ items });
      })
      .catch((error) => console.log(error.message));
  };

  handleSelectForProfile = (event, index) => {
    console.log('handleSelectForProfile with index ' + index);
    // TODO: must write url of selected photo into authenticated User photoURL atribute
    const { updateUser, auth, getRefFromFilePath } = this.props.firebase;

    // 1. get an url from the item
    const ref = getRefFromFilePath(this.state.items[index]);

    ref
      .getDownloadURL()
      .then((url) => {
        // 2. then update the user in firebase realtime db
        updateUser(auth.currentUser.uid, {
          photoURL: url,
        });
      })
      .catch((error) => console.log(error.message));
  };

  handleAddImage = (event) => {
    this.setState({ addingFile: true });
  };

  handleNewImage = async (file) => {
    const items = [...this.state.items];
    const { createImage } = this.props.firebase;
    const { uid } = this.props.firebase.authUser;

    console.log('Adding item ' + file.name + ' into remote storage');
    await createImage(uid, file)
      .then((newItemFullPath) => {
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
          items.push(newItemFullPath);
          this.setState({ items });
        }
        this.setState({ addingFile: false });
      })
      .catch((error) => console.log(error.message));
  };

  render() {
    const { t } = this.props;
    const { getRefFromFilePath } = this.props.firebase;
    console.log('ImageList render');
    return (
      <div>
        <div className='space-x-4'>
          {this.state.items.map((item, index) => {
            const ref = getRefFromFilePath(item);
            return (
              <div key={`image-${ref.fullPath}`} className='mr-5 inline-block'>
                <Image className='' username='' imageRef={ref} />
                {this.state.editList ? (
                  <>
                    <MatchaButton
                      text='X'
                      onClick={(e) => this.handleDelete(e, index)}
                    />
                    <MatchaButton
                      text={t(
                        'image_list.select_for_profile',
                        'Select for profile'
                      )}
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
            <div className='inline-block'>
              <MatchaButton text='+' onClick={this.handleAddImage} />
            </div>
          ) : null}
          {this.state.addingFile ? (
            <div className='inline-block'>
              <FileInput onClick={this.handleNewImage} />
            </div>
          ) : null}
        </div>
        <br />
        {this.state.editList ? (
          <MatchaButton
            text={t('image_list.done', 'Done')}
            onClick={this.handleEdit}
          />
        ) : (
          <MatchaButton
            text={t('image_list.edit_images', 'Edit images')}
            onClick={this.handleEdit}
          />
        )}
      </div>
    );
  }
}

ImageList.propTypes = {
  onImageListChange: PropTypes.func,
};
export default withTranslation()(withFirebase(ImageList));
