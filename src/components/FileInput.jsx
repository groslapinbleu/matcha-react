import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

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
    const { t } = this.props;

    let file = event.target.files[0];
    console.log(file);

    if (file) {
      if (file.size > 2097152) {
        this.setState({
          errorMessage: t(
            'fileinput.error_message',
            'Sorry, files should not be bigger than 2Mb'
          ),
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
    const { t } = this.props;
    const { errorMessage } = this.state;
    return (
      <div>
        <div>
          <div>
            <label>
              {t(
                'fileinput.select_image',
                'Select image file (jpeg, png or gif) with a max size of 2 Mb'
              )}
            </label>
          </div>
          <input
            type='file'
            name='myFile'
            onChange={this.uploadFile}
            accept='image/png, image/jpeg, image/jpg, image/gif' // HEIC format is currently unsupported by browsers (even Safari): no need to include it here for now
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

export default withTranslation()(FileInput);
