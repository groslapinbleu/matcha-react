import React from 'react';
import UserIcon from 'Icons/UserIcon';
import PropTypes from 'prop-types';

const Avatar = ({ username, photoURL, rounded = true, small = false }) => {
  console.log('Avatar');
  const size = small ? 8 : 24;
  let className = `shadow  h-${size} w-${size}  overflow-hidden`;
  if (rounded) {
    className += ' rounded-full';
  }
  return (
    <>
      {photoURL ? (
        <div className={className}>
          <img
            className='h-full w-full object-cover'
            src={photoURL}
            alt={username}
          />
        </div>
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
