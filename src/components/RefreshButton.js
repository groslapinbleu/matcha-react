import React from 'react'
import Refresh from '../Icons/Refresh'

const RefreshButton = ({onClick}) => {
    return (
        <button type="button" onClick={onClick}><Refresh /></button>
    )
}

export default RefreshButton;