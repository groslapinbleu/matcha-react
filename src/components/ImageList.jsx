import React, { Component } from 'react';
import Avatar from 'components/Avatar';
import PropTypes from 'prop-types';
import MatchaButton from 'components/MatchaButton';
import FileInput from 'components/FileInput';

class ImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      addingFile: false,
      images: [...this.props.images], // make a local copy of the prop
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddImage = this.handleAddImage.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
  }

  handleEdit(event) {
    if (this.state.edit) {
      // send updated list back to calling component when finishing edit
      this.props.onImageListChange(this.state.images);
    }
    this.setState({ edit: !this.state.edit });
  }

  handleDelete(event, index) {
    console.log('handleDelete with index ' + index);
    const images = [...this.state.images];
    images.splice(index, 1);
    // TODO: delete image in remote storage
    this.setState({ images });
  }

  handleAddImage(event) {
    this.setState({ addingFile: true });
  }

  handleNewImage(file) {
    console.log('new image file : ' + file.name);
    const images = [...this.state.images];
    // TODO: store file into remote storage... meanwhile I can preview the local file
    images.push(URL.createObjectURL(file));

    this.setState({ images, addingFile: false });
  }

  render() {
    return (
      <div>
        <div className='inline-flex'>
          {this.state.images.map((image, index) => {
            return (
              <div key={`image-${image}`} className='mr-5'>
                <Avatar username={image} photoURL={image} rounded={false} />
                {this.state.edit ? (
                  <MatchaButton
                    text='X'
                    onClick={(e) => this.handleDelete(e, index)}
                  />
                ) : (
                  ''
                )}
              </div>
            );
          })}
          {this.state.edit &&
          !this.state.addingFile &&
          this.state.images.length < 5 ? (
            <MatchaButton text='+' onClick={this.handleAddImage} />
          ) : null}
          {this.state.addingFile ? (
            <FileInput onClick={this.handleNewImage} />
          ) : null}
        </div>
        <br />
        {this.state.edit ? (
          <MatchaButton text='Done' onClick={this.handleEdit} />
        ) : (
          <MatchaButton text='Edit Images' onClick={this.handleEdit} />
        )}
      </div>
    );
  }
}

ImageList.propTypes = {
  images: PropTypes.array.isRequired,
  onImageListChange: PropTypes.func,
};
export default ImageList;
