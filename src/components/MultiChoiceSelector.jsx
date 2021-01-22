import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MultiChoiceSelector extends Component {
  state = {
    selectedElements: this.props.selectedElements,
    errorMessage: null,
  };

  handleChange = (event) => {
    console.log('DropdownMultiChoices handleChange');
    console.log('selected value : ' + event.target.value);
    const index = this.state.selectedElements.indexOf(event.target.value);
    const se = [...this.state.selectedElements];

    if (index > -1) {
      // remove that value from selectedElements
      se.splice(index, 1);
    } else {
      // add that value to selectedElements
      se.push(event.target.value);
    }
    if (this.props.multiple === false && se.length > 1) {
      const errorMessage = `Error : only one choice is allowed, you tried to select ${se.length}`;
      this.setState({ errorMessage });
    } else {
      this.setState({ selectedElements: se, errorMessage: null });
      this.props.onSelect(event.target.name, se);
    }
  };

  render() {
    return (
      <div>
        {this.props.elementList.map((element, index) => {
          // console.log("index: "+index + " element: " + element)
          return (
            <div key={`Checkbox-${index}`} className='inline-flex'>
              <label>
                <input
                  className={this.props.className}
                  type='checkbox'
                  name={this.props.name}
                  value={element}
                  checked={this.state.selectedElements.includes(element)}
                  onChange={this.handleChange}
                />
                {element}
              </label>
              <br />
            </div>
          );
        })}
        {this.state.errorMessage && <div>{this.state.errorMessage}</div>}
      </div>
    );
  }
}

MultiChoiceSelector.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  elementList: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool, // if false, only one choice is allowed
  className: PropTypes.string,
  onSelect: PropTypes.func,
};

MultiChoiceSelector.defaultProps = {
  multiple: true,
};

export default MultiChoiceSelector;
