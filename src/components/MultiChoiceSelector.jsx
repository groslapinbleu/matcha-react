import React, { Component } from 'react';
import PropTypes from 'prop-types'

class MultiChoiceSelector extends Component {
    constructor(props) {
        // console.log("DropdownMultiChoices constructor")
        super(props)

        this.state = {
            selectedElements: this.props.selectedElements
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("DropdownMultiChoices handleChange")
        console.log("selected value : " + event.target.value)
        const index = this.state.selectedElements.indexOf(event.target.value)
        const se = [...this.state.selectedElements]

        if (index > -1) {
            // remove that value from selectedElements
            se.splice(index, 1)
        } else {
            // add that value to selectedElements
            se.push(event.target.value)
        }
        this.setState({ selectedElements: se })

        this.props.onSelect(event.target.name, se)
    }

    render() {
        return (
            <div>
                {
                    this.props.elementList.map((element, index) => {
                        // console.log("index: "+index + " element: " + element)
                        return (
                            <div key={`Checkbox-${index}`} className='inline-flex'>
                                <label>
                                    <input
                                        className={this.props.className}
                                        type="checkbox" 
                                        name={this.props.name}
                                        value={element}
                                        checked={this.state.selectedElements.includes(element)}
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

MultiChoiceSelector.propTypes = {
    selectedElements: PropTypes.array.isRequired,
    elementList: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onSelect: PropTypes.func
}
export default MultiChoiceSelector;