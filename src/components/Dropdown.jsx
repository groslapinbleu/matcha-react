import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Dropdown extends Component {
    constructor(props) {
        // console.log("Dropdown constructor")
        super(props)
        let index = 0
        if (props.selectedElement >= 0 && props.selectedElement < props.elementList.length) {
            index = props.selectedElement
        }
        this.state = {
            selectedElement: index
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log("Dropdown handleChange")
        const value = parseInt(event.target.value, 10)
        this.setState({ selectedElement: value })
        this.props.onSelect(event.target.name, value)
    }

    render() {
        // console.log("Dropdown render")

        return (
            <select className={this.props.className}
                name={this.props.name}
                defaultValue={this.props.selectedElement}
                onChange={this.handleChange}>
                {
                    this.props.elementList.map((element, index) => {
                        // console.log("index: "+index + " element: " + element)
                        return (
                            <option key={`Dropdown-${index}`}
                                value={index}
                            >
                                {element}
                            </option>

                        )
                    })
                }
            </select>

        )
    }
}

Dropdown.propTypes = {
    selectedElement: PropTypes.number.isRequired,
    elementList: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    onSelect: PropTypes.func
}
export default Dropdown;