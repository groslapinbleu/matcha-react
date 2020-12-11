import React from 'react'

const RedBox = ({title, children}) => {
    return (
        <div className="p-6 max-w-md mx-auto bg-red-50 rounded-xl flex items-center space-x-4 border-l-8 border-red-500">
            <div className="flex-shrink-1">
                <p className="text-2xl shadow text-center wr">{title}</p>
                {children}
            </div>
        </div>
    )
}

export default RedBox