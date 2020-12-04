import React from 'react'
import Check from '../Icons/Check'

const CheckButton = ({onClick}) => {
    return (
        <button type="button" onClick={onClick}><Check /></button>
    )
}

export default CheckButton;