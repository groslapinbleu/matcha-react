import React from 'react';
import { withFirebase } from 'services/Firebase';
import MatchaBox from 'components/MatchaBox';
import Footer from 'components/Footer';
import Header from 'components/Header';
import UserItem from 'components/UserItem';
import UserList from 'components/UserList';
import { useTranslation } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';
import navigatorLanguage from 'helpers/navigatorLanguage';

function Admin({ firebase }) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Header />
      <section className='p-5 shadow'>
        <MatchaBox title='Admin Page'>
          <p>
            {t(
              'admin_page_disclaimer',
              'This page is only accessible to admin profiles.'
            )}
          </p>
          <div>
            <div>Navigator language = {navigatorLanguage()}</div>
            <div>i18next language = {i18n.language}</div>
          </div>
        </MatchaBox>
      </section>
      <section className='p-5 shadow'>
        <Switch>
          <Route exact path='/admin/:id' component={UserItem} />
          <Route exact path='/admin' component={UserList} />
        </Switch>
      </section>
      <Footer />
    </div>
  );
}

export default withFirebase(Admin);
