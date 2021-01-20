import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { defaultUserData } from 'models/User';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

// this class encapsulates all authentication and database objects and functions
class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
    this.storageRef = this.storage.ref();
    this.imagesRef = this.storageRef.child('images');

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignInWithGithub = () => this.auth.signInWithPopup(this.githubProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  doUserProfileUpdate = (displayName) => {
    console.log('doUserProfileUpdate avec ' + displayName);
    return this.auth.currentUser.updateProfile({
      displayName: displayName,
      // photoURL: "https://example.com/jane-q-user/profile.jpg"
    });
  };

  doDelete = () => this.auth.currentUser.delete();

  doUpdateEmail = (email) => this.auth.currentUser.updateEmail(email);

  doUseDeviceLanguage = () => this.auth.useDeviceLanguage();

  // *** Merge Auth and DB User API *** //

  // onAuthStateChanged is encapsulated and returns an auth object
  // which is enriched with Realtime DB information
  onAuthStateChangedWithRoles = (next) => {
    console.log('Firebase onAuthStateChangedWithRoles');
    return this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log('the user is now signed-in');
        try {
          this.user(authUser.uid).on('value', (snapshot) => {
            // console.log("snapshot=" + snapshot)
            let dbUser = snapshot.val();
            console.log('dbUser=' + dbUser);
            let mustWriteInDB = false;
            if (!dbUser) {
              // since we didn't find data in db, we will need
              // to write initial data
              mustWriteInDB = true;
              const now = Date.now();
              dbUser = {
                ...defaultUserData,
                created: now,
                updated: now,
              };
            }

            // default username to displayName
            if (dbUser.username === '') {
              dbUser.username = authUser.displayName;
            }

            // default photoUrl
            if (!dbUser.photoURL) {
              dbUser.photoURL = authUser.photoURL;
            }

            // merge auth and db user
            authUser = {
              ...dbUser,
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
            };

            // store this merged user into current Firebase instance for future use
            this.authUser = { ...authUser };
            // debug
            console.log('content of authUser :');
            Object.entries(this.authUser).forEach((val) => {
              const [key, value] = val;
              console.log(key, value);
            });

            if (mustWriteInDB) {
              console.log('writing user to db');
              try {
                this.user(authUser.uid).set(authUser);
              } catch (error) {
                // an exception is thrown when the user has been deliberatly deleted : log it and ignore it
                console.log('oups, error when writing in db:' + error.message);
              }
            }
            console.log('now calling next with merged user');
            next(authUser);
          });
        } catch (error) {
          console.log(
            'Firebase onAuthStateChangedWithRole, error caught ' + error.message
          );
        }
      } else {
        // cleanup authUser
        console.log('the user is now signed-out');
        // FIXME: find a way to free up this listener
        // this.user(authUser.uid).off()
        this.authUser = null;
        console.log('now calling next with merged user');
        next(authUser);
      }
    });
  };

  // *** User API ***

  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  // *** Message API ***

  message = (uid) => this.db.ref(`messages/${uid}`);

  messages = () => this.db.ref('messages');

  // *** chat API ***
  // every couple of users have their own conversation based on chatId, where
  // chatId = uid1+uid2 with uid1 < uid2
  chat = (chatId, uid) => this.db.ref(`chats/${chatId}/${uid}`);

  chats = (chatId) => this.db.ref(`chats/${chatId}`);

  // *** file API for images ***
  images = (uid) => this.imagesRef.child(uid);
  image = (uid, filename) => this.imagesRef.child(`${uid}/${filename}`);

  // delete a single file
  deleteFile = async (filePath) => {
    const ref = this.storage.ref(filePath);
    return await ref.delete();
  };

  // delete all files within directory uid
  deleteFiles = async (uid) => {
    const ref = this.images(uid);
    const list = await ref.listAll();
    let filesDeleted = 0;

    for await (const fileRef of list.items) {
      await this.deleteFile(fileRef.fullPath);
      filesDeleted++;
    }
    for await (const folderRef of list.prefixes) {
      filesDeleted += await deleteFolderRecursive(folderRef.fullPath);
    }
    console.log('deleteFiles: number of files deleted = ' + filesDeleted);
    return filesDeleted;
  };
}

export default Firebase;
