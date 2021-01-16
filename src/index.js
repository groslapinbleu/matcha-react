import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'styles/tailwind.css';
import Firebase, { FirebaseContext } from 'services/Firebase';
import './i18n';
import App from 'components/App';

ReactDOM.render(
  <Suspense fallback={<h1>Loading...</h1>}>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </Suspense>,
  document.getElementById('root')
);
