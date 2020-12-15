import React, { Component } from 'react';
import PropTypes from 'prop-types'

class RadioButton extends Component {
    constructor(props) {
        super(props)
        let index = 0
        if (props.selectedElement >= 0 && props.selectedElement < props.arrayValues.length) {
            index = props.selectedElement
        }
        this.state = {
            selectedElement: index
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("RadioButton handleChange")
        const value = parseInt(event.target.value, 10)
        this.setState({ selectedElement: value })
        this.props.onSelect(event.target.name, value)
    }

    render() {
        return (
            <div>
                {
                    this.props.arrayValues.map((element, index) => {
                        // console.log("index: "+index + " element: " + element)
                        return (
                            <div key={`RadioButton-${index}`}>
                                <label>
                                    <input
                                        className={this.props.className}
                                        type="radio" name={this.props.name}
                                        value={index}
                                        checked={this.state.selectedElement === index}
                                        onChange={this.handleChange} />
                                    {element}
                                </label>
                                <br />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

RadioButton.propTypes = {
    selectedElement: PropTypes.number.isRequired,
    arrayValues: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSelect: PropTypes.func
}
export default RadioButton;