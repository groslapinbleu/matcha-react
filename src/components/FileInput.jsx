import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(event) {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      this.props.onClick(file);
    }
  }

  render() {
    return (
      <span>
        <input type='file' name='myFile' onChange={this.uploadFile} />
      </span>
    );
  }
}

FileInput.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FileInput;
