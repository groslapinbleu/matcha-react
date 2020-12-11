import React from 'react'
import PropTypes from 'prop-types'

const MatchaButton = ({text, onClick}) => {
    // if onClick prop is not provided, the button is used within a form and needs to be of type submit
    return (
        onClick
        ? <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="button" onClick={onClick}>{text}</button>
        : <button className="p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type="submit" >{text}</button>
    )
}

MatchaButton.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string
}

export default MatchaButton