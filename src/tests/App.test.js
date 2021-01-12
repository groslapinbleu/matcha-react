import React from 'react';
import { render } from '@testing-library/react';
import App from 'components/App';
import Firebase, { FirebaseContext } from 'tests/MockFirebase';

test('login link', () => {
  const { getByText } = render(
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  );
  const linkElement = getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
