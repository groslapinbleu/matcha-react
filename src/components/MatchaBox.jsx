import React from 'react';
import PropTypes from 'prop-types';

const MatchaBox = ({ title = '', children, color = 'indigo' }) => {
  const decoration = `p-6 max-w-5xl mx-auto bg-${color}-50 rounded-xl flex items-center space-x-4 border-l-8 border-${color}-500`;
  return (
    <div className={decoration}>
      <div className='flex-shrink overflow-x-auto mx-auto'>
        <p className='text-2xl shadow text-center'>{title}</p>
        {children}
      </div>
    </div>
  );
};

MatchaBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
};

export default MatchaBox;
