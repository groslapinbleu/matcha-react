import React from 'react'
import Pencil from '../Icons/Pencil'

const PencilButton = ({onClick}) => {
    return (
        <button type="button" onClick={onClick}><Pencil /></button>
    )
}

export default PencilButton;