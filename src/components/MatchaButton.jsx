import React from 'react'
import PropTypes from 'prop-types'

// the content of the button can be passed as text, icon or childre (or any combination)
const MatchaButton = ({
  text, onClick = null, disabled = false, type = 'submit', icon = null, color = 'indigo', children
}) => {
  let styling = ' text-white  font-bold text-xs px-4 py-2 rounded-full shadow outline-none focus:outline-none mr-1 mb-1'
  disabled
    ? styling += ` bg-${color}-200 active:bg-${color}-300`
    : styling += ` bg-${color}-500 active:bg-${color}-600 hover:shadow-lg`
  return (
    <button disabled={disabled} className={styling} type={type} onClick={onClick}>
      {icon}
      {text}
      {children}
    </button>
  )
}

MatchaButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.object,
  color: PropTypes.string,
  type: PropTypes.string,
  children : PropTypes.node
}

export default MatchaButton
