import React from 'react';
// SVG is copied from https://heroicons.dev/ 
// NB : thanks to default param values in ES6, I can set values if they are not provided
const UserIcon = ({ height = 6, width = 6 }) => {
  // console.log(`height =  ${height} width = ${width}`)

  return (
    <svg className={`w-${height} h-${width}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  )
}

export default UserIcon;


