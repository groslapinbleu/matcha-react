import React from 'react'

const IndigoBox = (props) => {
    return (
        <div className="p-6 max-w-sm mx-auto bg-indigo-50 rounded-xl flex items-center space-x-4 border-l-8 border-indigo-500">
            <div className="flex-shrink-0">
                <p className="text-2xl shadow text-center">{props.title}</p>
                {props.children}
            </div>
        </div>
    )
}

export default IndigoBox