import React from 'react';
import * as MISC from '../constants/miscConsts'
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="pt-5">
      <div className="text-center">
        <p >&copy;
        <span className="px-1">
            <Link className="text-xl hover:underline" to="/">{MISC.APP_NAME}</Link>
          </span>
       2020.
       </p>
      </div>
    </footer>
  )
}

export default Footer;
