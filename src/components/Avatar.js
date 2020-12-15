import React from 'react'
import UserIcon from 'Icons/UserIcon'
import PropTypes from 'prop-types'

const Avatar = ({ username, photoURL }) => {
    return (
        <React.Fragment>
            {photoURL
                ? <img className="rounded-full shadow h-24 w-24 mx-auto" src={photoURL} alt={username} />
                : <UserIcon height={16} width={16}  ></UserIcon>
            }
        </React.Fragment>
    )
}

Avatar.propTypes = {
    username: PropTypes.string,
    photoURL: PropTypes.string
}

export default Avatar