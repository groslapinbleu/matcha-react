import React from 'react'

const RedBox = (props) => {
    return (
        <div className="p-6 max-w-sm mx-auto bg-red-50 rounded-xl flex items-center space-x-4 border-l-8 border-red-500">
            <div className="flex-shrink-0">
                <p className="text-xl shadow text-center">{props.title}</p>
                {props.children}
            </div>
        </div>
    )
}

export default RedBox