import React, { useState } from 'react';
import MatchaBox from '../components/MatchaBox';
import { withFirebase } from '../services/Firebase';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'react-simple-snackbar';

import Alert from 'components/Alert';

const Notification = ({ firebase }) => {
  const { t } = useTranslation();
  const { currentUser } = firebase.auth;
  const [isTokenFound, setTokenFound] = useState(false);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [openSnackbar, closeSnackbar] = useSnackbar();

  firebase.getToken(setTokenFound);

  firebase
    .onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
      openSnackbar(notification.title + ' ' + notification.body);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <div>
      <Header></Header>
      <section className='p-5 shadow'>
        <MatchaBox title='Notification Page'>
          <p>Work In Progress</p>
          {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
          {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
          {show ? (
            <>{notification.title + ' ' + notification.body}</>
          ) : (
            'no notif'
          )}
        </MatchaBox>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default withFirebase(Notification);
