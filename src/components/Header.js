import React from 'react';
import { withFirebase } from 'services/Firebase'
import Navbar from 'components/Navbar'

function Header({firebase}) {
  return (
    <header>
      <Navbar />
    </header>
  );
}

export default withFirebase(Header)

