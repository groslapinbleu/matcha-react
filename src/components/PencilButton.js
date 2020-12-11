import React from 'react'
import Pencil from 'Icons/Pencil'
import PropTypes from 'prop-types'

const PencilButton = ({onClick}) => {
    return (
        <button type="button" onClick={onClick}><Pencil /></button>
    )
}

PencilButton.propTypes = {
    onClick: PropTypes.func
}

export default PencilButton;