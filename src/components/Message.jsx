import React from 'react';
import PropTypes from 'prop-types';
import formatDateTime from 'helpers/formatDateTime';
import MatchaButton from './MatchaButton';
import Avatar from 'components/Avatar';

const Message = ({ user, otherUser, chat, onRemoveMessage }) => {
  if (user.uid === chat.userId) {
    return (
      <div className='flex'>
        <div className='flex-grow'>
          <div className='p-2 max-w-lg rounded-lg break-words bg-green-400 text-white ml-auto'>
            {chat.text}
            <span className='float-right'>
              <MatchaButton
                text='x'
                color='green'
                onClick={() => onRemoveMessage(chat.uid)}
              />
            </span>
          </div>

          <div className='text-xs float-right'>
            {formatDateTime(chat.created)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <div className='p-2 max-w-lg rounded-lg break-words bg-gray-200'>
          <div className='flex'>
            {otherUser ? (
              <div className='flex-shrink-0'>
                <Avatar
                  username={otherUser.username}
                  photoURL={otherUser.photoURL}
                  small={true}
                />
              </div>
            ) : (
              ''
            )}
            <span className='pl-3 pr-6'>{chat.text}</span>
          </div>
        </div>
        <div className='text-xs float-left'>
          {otherUser.username} - {formatDateTime(chat.created)}
        </div>
      </div>
    </div>
  );
};
Message.propTypes = {
  onRemoveMessage: PropTypes.func,
  user: PropTypes.object,
  otherUser: PropTypes.object,
  chat: PropTypes.object,
};

export default Message;
