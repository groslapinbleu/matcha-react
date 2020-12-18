import React from 'react'
import Refresh from 'Icons/Refresh'
import PropTypes from 'prop-types'

const RefreshButton = ({onClick}) => {
    return (
        <button type="button" onClick={onClick}><Refresh /></button>
    )
}

RefreshButton.propTypes = {
    onClick: PropTypes.func
}
export default RefreshButton;