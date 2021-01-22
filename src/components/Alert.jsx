import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ color = 'red', children }) => {
  const [showAlert, setShowAlert] = React.useState(true);
  return (
    <>
      {showAlert ? (
        <div
          className={`text-white p-1 border-0 rounded relative mb-1 bg-${color}-500`}
        >
          <span className='inline-block align-middle mr-8'>{children}</span>
          <button
            className='absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-1 mr-4 outline-none focus:outline-none'
            onClick={() => setShowAlert(false)}
            type='button'
          >
            <span>×</span>
          </button>
        </div>
      ) : null}
    </>
  );
};
Alert.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node,
};
export default Alert;
