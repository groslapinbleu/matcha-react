import React from 'react';
import formatTime from '../helpers/formatTime'

const Message = ({ user, chat, onRemoveMessage }) => {
  if (user.uid === chat.userId) {
    return (
      <div className="flex">
        <div className="flex-grow p-1 m-2 max-w-2xl rounded-lg break-words speech-bubble bg-green-300 text-white ml-auto">
          {chat.text}
          <span className="text-xs float-right">
            myself -
            {formatTime(chat.createdAt)}
          </span>
        </div>
        <button type="button" className="m-2 p-2 rounded-md bg-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white" onClick={() => onRemoveMessage(chat.uid)}>delete</button>
      </div>
    )
  }
  return (
    <div>
      <div className="p-1 m-2 max-w-2xl rounded-lg break-words speech-bubble bg-gray-200">
        {chat.text}
        <span className="text-xs float-right">
          {' '}
          {chat.username}
          {' '}
          -
          {' '}
          {formatTime(chat.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default Message;
