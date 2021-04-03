import React from 'react';

const FirebaseContext = React.createContext<Object | null>(null);

// eslint-disable-next-line react/display-name
export const withFirebase = (Component: any) => (props: any) => (
  <FirebaseContext.Consumer>
    {(firebase) => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
