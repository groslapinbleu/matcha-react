import React from 'react'
import PropTypes from 'prop-types'

const MatchaButton = ({text, onClick=null, disabled=false, type='submit'}) => {
    // if onClick prop is not provided, the button is used within a form and needs to be of type submit
    return (
        disabled
        ? <button disabled={disabled} className="p-2 rounded-md text-white bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-white" type={type} onClick={onClick}>{text}</button>
        : <button disabled={disabled} className="p-2 rounded-md text-white bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" type={type} onClick={onClick}>{text}</button>
    )
}

MatchaButton.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    disabled: PropTypes.bool
}

export default MatchaButton