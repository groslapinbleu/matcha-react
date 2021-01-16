import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../services/Firebase';
import * as MISC from '../constants/miscConsts';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header></Header>
      <section>
        <div className='pt-20'>
          <div className='container mx-auto text-center py-5 bg-indigo-50'>
            <h1 className='text-4xl'>
              {t('welcome_home.part1', 'Welcome to ')} {MISC.APP_NAME}
            </h1>
            <p className='text-2xl'>
              {t('welcome_home.part2', 'Meet me here!')}
            </p>
            <FirebaseContext.Consumer>
              {(firebase) => {
                firebase.auth.currentUser ? (
                  <p>
                    Currently connected as {firebase.auth.currentUser.email}
                  </p>
                ) : (
                  <div className='mt-4'>
                    <Link
                      className='btn btn-primary px-5 mr-3 hover:underline'
                      to='/signup'
                    >
                      {t('create_account', 'Create New Account')}
                    </Link>
                    <Link className='btn px-5 hover:underline' to='/login'>
                      {t('login_to_account', 'Login to Your Account')}
                    </Link>
                  </div>
                );
              }}
            </FirebaseContext.Consumer>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </React.Fragment>
  );
};

export default Home;
