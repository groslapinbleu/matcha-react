import React from 'react'
import Check from 'Icons/Check'
import PropTypes from 'prop-types'

const CheckButton = ({ onClick }) =>
// if onClick prop is not provided, the button is used within a form and needs to be of type submit
  (
    onClick
      ? <button type="button" onClick={onClick}><Check /></button>
      : <button type="submit"><Check /></button>
  )

CheckButton.propTypes = {
  onClick: PropTypes.func,
}

export default CheckButton;
