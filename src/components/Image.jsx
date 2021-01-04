import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      url: null,
    };
  }
  componentDidMount() {
    this.props.item
      .getDownloadURL()
      .then((url) => this.setState({ url, loading: false }))
      .catch((error) => console.log(error.message));
  }

  render() {
    return (
      <>
        {this.state.loading ? (
          'loading...'
        ) : (
          <div>
            <img
              className='shadow w-60 mx-auto'
              src={this.state.url}
              alt={this.props.username}
            />
          </div>
        )}
      </>
    );
  }
}

Image.propTypes = {
  username: PropTypes.string,
  item: PropTypes.object,
};
export default Image;
