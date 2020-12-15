import React from 'react'

const MatchaBox = ({title, children, color='indigo'}) => {
    const decoration = `p-6 max-w-lg mx-auto bg-${color}-50 rounded-xl flex items-center space-x-4 border-l-8 border-${color}-500`
    return (
        <div className={decoration}>
            <div className="flex-shrink-1">
                <p className="text-2xl shadow text-center">{title}</p>
                {children}
            </div>
        </div>
    )
}

export default MatchaBox