import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import * as MISC from '../constants/miscConsts';
import { useTranslation } from 'react-i18next';
import { withFirebase } from 'services/Firebase';
import MatchaBox from 'components/MatchaBox';
import Suggestions from 'components/Suggestions';

const Home = ({ firebase }) => {
  const { t } = useTranslation();
  const { currentUser } = firebase.auth;

  return (
    <React.Fragment>
      <Header></Header>
      <section className='p-5 shadow'>
        <div className='pt-20'>
          <div className='container mx-auto text-center py-5 bg-indigo-50'>
            <h1 className='text-4xl'>
              {t('home.welcome_home.part1', 'Welcome to ')} {MISC.APP_NAME}
            </h1>
            <p className='text-2xl'>
              {t('home.welcome_home.part2', 'Meet me here!')}
            </p>
          </div>
        </div>
      </section>
      <section className='p-5 shadow'>
        {currentUser ? (
          <MatchaBox title='Suggestions A MODIFIER SELON SPECS MACHA'>
            <Suggestions />
          </MatchaBox>
        ) : (
          <div className='container mx-auto text-center py-5 bg-indigo-50'>
            <Link className='btn px-5 hover:underline' to='/login'>
              {t('home.login_to_account', 'Login to Your Account')}
            </Link>
            <Link
              className='btn btn-primary px-5 mr-3 hover:underline'
              to='/signup'
            >
              {t('home.create_account', 'Create New Account')}
            </Link>
          </div>
        )}
      </section>
      <Footer></Footer>
    </React.Fragment>
  );
};

export default withFirebase(Home);
