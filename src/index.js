import React from 'react'
import ReactDOM from 'react-dom'
import './styles/tailwind.css'
import Firebase, { FirebaseContext } from './services/Firebase';

import App from './App'

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>, 
document.getElementById('root'));
