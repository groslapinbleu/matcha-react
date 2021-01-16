import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import UserSearchList from 'components/UserSearchList';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Header></Header>
      <section className='p-5 shadow'>
        <MatchaBox title={t('search_users', 'Search other users')}>
          <UserSearchList></UserSearchList>
        </MatchaBox>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default withFirebase(Search);
