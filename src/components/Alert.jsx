import React from 'react';
import PropTypes from 'prop-types'

const Alert = ({ color = 'red', children }) => {
  const [showAlert, setShowAlert] = React.useState(true);
  return (
    <>
      {showAlert ? (
        <div
          className={
            `text-white px-6 py-4 border-0 rounded relative mb-4 bg-${
              color
            }-500`
          }
        >

          <span className="inline-block align-middle mr-8">
            {children}
          </span>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
            onClick={() => setShowAlert(false)}
            type="button"
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
}
export default Alert
