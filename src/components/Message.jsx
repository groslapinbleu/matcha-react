import React from 'react';
import PropTypes from 'prop-types';
import formatTime from 'helpers/formatTime';
import MatchaButton from './MatchaButton';

const Message = ({ user, chat, onRemoveMessage }) => {
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
            myself -{formatTime(chat.createdAt)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <div className='p-2 max-w-lg rounded-lg break-words bg-gray-200'>
          {chat.text}
        </div>
        <div className='text-xs float-left'>
          {' '}
          {chat.username} - {formatTime(chat.createdAt)}
        </div>
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
