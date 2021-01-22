import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Dropdown from './Dropdown';
import PropTypes from 'prop-types';

class SearchAndOrder extends Component {
  state = {
    searchstring: this.props.searchString,
    sortOrder: this.props.sortOrder === 'asc' ? 0 : 1, // pass 'asc' for ascending, anything else for descending
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.props.changeString(event.target.value);
  };

  handleSelectOrder = (name, value) => {
    this.setState({
      [name]: value,
    });
    const returnValue = value === 0 ? 'asc' : 'desc';
    this.props.changeOrder(returnValue);
  };

  onSubmit = (event) => {
    event.preventDefault();
    // don't do anything apart from preventDefault
  };

  render() {
    const { t } = this.props;
    const listOrder = [
      t('search_and_sort.ascending', 'ascending'),
      t('search_and_sort.descending', 'descending'),
    ];

    return (
      <div className='relative flex flex-wrap '>
        <form onSubmit={this.onSubmit}>
          <input
            type='text'
            name='searchstring'
            placeholder={t(
              'search_and_sort.enter_string',
              'Enter search string'
            )}
            value={this.state.searchstring}
            onChange={this.handleChange}
          ></input>
        </form>
        <Dropdown
          selectedElement={this.state.sortOrder}
          elementList={listOrder}
          name='sortOrder'
          className='mx-2'
          onSelect={this.handleSelectOrder}
        />
      </div>
    );
  }
}

SearchAndOrder.propTypes = {
  sortOrder: PropTypes.string,
  searchString: PropTypes.string,
  changeOrder: PropTypes.func.isRequired,
  changeString: PropTypes.func.isRequired,
};

SearchAndOrder.defaultProps = {
  sortOrder: 'asc',
  searchString: '',
};

export default withTranslation()(SearchAndOrder);
