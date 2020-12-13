import React from 'react'
import PropTypes from 'prop-types'

const MatchaButton = ({ text, onClick = null, disabled = false, type = 'submit', icon = null }) => {
    let styling = " text-white  font-bold text-xs px-4 py-2 rounded-full shadow outline-none focus:outline-none mr-1 mb-1"
    disabled
        ? styling += " bg-indigo-200 active:bg-indigo-300"
        : styling += " bg-indigo-500 active:bg-indigo-600 hover:shadow-lg"
    return (
        <button disabled={disabled} className={styling} type={type} onClick={onClick}>{icon}{text}</button>
    )
}

MatchaButton.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.object
}

export default MatchaButton