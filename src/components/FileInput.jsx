import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*** this component allows to select a file on the local system, then send it back
 * to the calling component via prop onClick
 */
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
    };
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(event) {
    let file = event.target.files[0];
    console.log(file);

    if (file) {
      if (file.size > 1048576) {
        this.setState({
          errorMessage: 'Sorry, files should not be bigger than 1Mb',
        });
      } else {
        this.setState({
          errorMessage: null,
        });
        this.props.onClick(file);
      }
    }
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <div>
        <div>
          <input
            type='file'
            name='myFile'
            onChange={this.uploadFile}
            accept='image/png, image/jpeg, image/jpg'
          />
        </div>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  }
}

FileInput.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FileInput;
