// @flow

import React from 'react'
import UserIcon from 'Icons/UserIcon'

const Avatar = ({ username, photoURL }) => (
  <>
    {photoURL
      ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={photoURL} alt={username} />
      : <UserIcon height={16} width={16} />}
  </>
)

export default Avatar
