import React from 'react';
import UserIcon from 'Icons/UserIcon';
import PropTypes from 'prop-types';

const Avatar = ({ username, photoURL, rounded = true }) => {
  let className = 'shadow h-24 w-24 mx-auto';
  if (rounded) {
    className += ' rounded-full';
  }
  return (
    <>
      {photoURL ? (
        <img className={className} src={photoURL} alt={username} />
      ) : (
        <UserIcon height={16} width={16} />
      )}
    </>
  );
};

Avatar.propTypes = {
  username: PropTypes.string,
  photoURL: PropTypes.string,
  rounded: PropTypes.bool,
};
export default Avatar;
