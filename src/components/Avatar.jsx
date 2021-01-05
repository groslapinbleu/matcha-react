import React from 'react';
import UserIcon from 'Icons/UserIcon';
import PropTypes from 'prop-types';

const Avatar = ({ username, photoURL, rounded = true, small = false }) => {
  console.log('Avatar');
  const size = small ? 16 : 24;
  let className = `shadow h-${size} w-${size} mx-auto`;
  if (rounded) {
    className += ' rounded-full';
  }
  return (
    <>
      {photoURL ? (
        <img className={className} src={photoURL} alt={username} />
      ) : (
        <UserIcon height={size} width={size} />
      )}
    </>
  );
};

Avatar.propTypes = {
  username: PropTypes.string,
  photoURL: PropTypes.string,
  rounded: PropTypes.bool,
  small: PropTypes.bool,
};
export default Avatar;
