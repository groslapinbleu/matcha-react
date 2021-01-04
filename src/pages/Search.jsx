import React, { Component } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import UserSearchList from 'components/UserSearchList';

const Search = () => {
  return (
    <div>
      <Header></Header>
      <section className='p-5 shadow'>
        <MatchaBox title='Search other users'>
          <UserSearchList></UserSearchList>
        </MatchaBox>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default withFirebase(Search);
