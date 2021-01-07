import React from 'react';
import PropTypes from 'prop-types';
import formatTime from 'helpers/formatTime';
import MatchaButton from './MatchaButton';

const Message = ({ user, chat, onRemoveMessage }) => {
  if (user.uid === chat.userId) {
    return (
      <div className='flex'>
        <div className='flex-grow p-1 m-2 max-w-2xl rounded-lg break-words speech-bubble bg-green-300 text-white ml-auto'>
          {chat.text}
          <span className='text-xs float-right'>
            myself -{formatTime(chat.createdAt)}
          </span>
        </div>
        <MatchaButton text='X' onClick={() => onRemoveMessage(chat.uid)} />
      </div>
    );
  }
  return (
    <div>
      <div className='p-1 m-2 max-w-2xl rounded-lg break-words bg-gray-200'>
        {chat.text}
        <span className='text-xs float-right'>
          {' '}
          {chat.username} - {formatTime(chat.createdAt)}
        </span>
      </div>
    </div>
  );
};
Message.propTypes = {
  onRemoveMessage: PropTypes.func,
  user: PropTypes.object,
  chat: PropTypes.object,
};

export default Message;
