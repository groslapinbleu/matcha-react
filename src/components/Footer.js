import React from 'react';
import * as MISC from '../constants/miscConsts'

function Footer() {
  return (
    <footer className="pt-5">
      <div className="text-center">
        <p>&copy; {MISC.APP_NAME} 2020.</p>
      </div>
    </footer>
  )
}

export default Footer;
