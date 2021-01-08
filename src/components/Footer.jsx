import React from 'react';
import { Link } from 'react-router-dom';
import * as MISC from '../constants/miscConsts';

function Footer() {
  return (
    <footer className='pt-5'>
      <div className='text-center'>
        <p className='text-sm'>
          &copy;
          <span className='px-1 '>
            <Link className='hover:underline' to='/'>
              {MISC.APP_NAME}
            </Link>
          </span>
          2021. Disclaimer: this application is a React learning project, not a
          commmercial application. <br />
          It comes with no level of support, and the data can be deleted
          anytime.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
