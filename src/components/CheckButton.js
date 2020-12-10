import React from 'react'
import Check from '../Icons/Check'

const CheckButton = ({onClick}) => {
    // if onClick prop is not provided, the button is used in a form and needs to be of type submit
    return (
        onClick
        ? <button type="button" onClick={onClick}><Check /></button>
        : <button type="submit" ><Check /></button>
    )
}

export default CheckButton;