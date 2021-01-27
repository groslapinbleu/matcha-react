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

    /* Firebase APIs */

    this.auth = app.auth();

    this.db = app.database();

    this.storage = app.storage();
    this.storageRef = this.storage.ref();
    this.imagesRef = this.storageRef.child('images');

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

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
    // console.log('doUserProfileUpdate avec ' + displayName);
    return this.auth.currentUser.updateProfile({
      displayName: displayName,
      // photoURL: "https://example.com/jane-q-user/profile.jpg"
    });
  };

  doDelete = async () => this.auth.currentUser.delete();

  doUpdateEmail = async (email) => this.auth.currentUser.updateEmail(email);

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
              dbUser = {
                ...defaultUserData,
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
                this.createUser(authUser.uid, authUser);
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
  // private api, do not use outside this file
  user = (uid) => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');
  friends = (uid) => this.db.ref(`users/${uid}/friends`);

  // public api
  createUser = (uid, data) => {
    const now = Date.now();
    const dbUser = {
      ...data,
      created: now,
      updated: now,
    };
    console.log('create user ' + dbUser);
    return this.user(uid).set(dbUser);
  };

  subscribeToUser = (uid, processUser) => {
    return this.user(uid).on('value', (snapshot) => {
      processUser(snapshot.val());
    });
  };

  unsubscribeFromUser = (uid, ref) => {
    if (ref) {
      this.user(uid).off('value', ref);
    }
  };

  updateUser = async (uid, data) => {
    const updatedData = { ...data, updated: Date.now() };
    this.user(uid)
      .update(updatedData)
      .catch((error) => {
        console.log(error.message);
        throw new Error('updateUser: Error when updating user ' + uid);
      });
  };
  deleteUser = (uid) => {};

  updateFriends = async (uid, data) => {
    this.friends(uid)
      .update(data)
      .catch((error) => {
        console.log(error.message);
        throw new Error(
          'updateFriends: Error when updating the friends of user ' + uid
        );
      });
  };

  subscribeToUsers = (limit, processUsersList) => {
    this.users()
      .orderByChild('gender')
      .limitToLast(limit)
      .on('value', (snapshot) => {
        console.log('subscribeToUsers : received snapshot');
        const usersObject = snapshot.val();
        if (usersObject) {
          const usersList = Object.keys(usersObject).map((key) => ({
            ...usersObject[key],
            uid: key,
          }));
          processUsersList(usersList);
        }
      });
  };

  subscribeToUsersWithPreferredGender = (
    limit,
    preferredGender,
    processUsersList
  ) => {
    this.users()
      .orderByChild('gender')
      .limitToLast(limit)
      .equalTo(preferredGender)
      .on('value', (snapshot) => {
        console.log('subscribeToUsers : received snapshot');
        const usersObject = snapshot.val();
        if (usersObject) {
          const usersList = Object.keys(usersObject).map((key) => ({
            ...usersObject[key],
            uid: key,
          }));
          processUsersList(usersList);
        }
      });
  };

  unsubscribeFromUsers = () => {
    this.users().off();
  };

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

  // create image
  // FIXME: instead of returning newItemRef from db, I should return newItemRef.fullPath
  createImage = async (uid, file) => {
    const newItemRef = this.image(uid, file.name);
    try {
      await newItemRef.put(file);
      return newItemRef.fullPath;
    } catch (error) {
      console.log('createImage: ' + error.message);
      throw new Error('Error when creating image in storage');
    }
  };
  // get all images corresponding to a uid
  // FIXME: instead of returning an item from db, I should return item.fullPath
  getImages = async (uid) => {
    const databaseItems = [];
    const listRef = this.images(uid);
    try {
      await listRef.listAll().then((res) => {
        // res.prefixes.forEach(function (folderRef) {
        //   console.log('folderRef: ' + folderRef);
        // });
        res.items.forEach((item) => {
          // console.log('item: ' + item);
          // console.log('item.fullPath: ' + item.fullPath);
          databaseItems.push(item.fullPath);
        });
      });
      return databaseItems;
    } catch (error) {
      console.log('getImages: ' + error.message);
      throw new Error('Error listing images');
    }
  };

  getRefFromFilePath = (fullPath) => {
    return this.storage.ref(fullPath);
  };

  // delete a single file
  deleteImage = async (fullPath) => {
    const ref = this.getRefFromFilePath(fullPath);
    return await ref.delete();
  };

  // delete all files within directory uid
  deleteImages = async (uid) => {
    const ref = this.images(uid);
    const list = await ref.listAll();
    let filesDeleted = 0;

    for await (const fileRef of list.items) {
      await this.deleteImage(fileRef.fullPath);
      filesDeleted++;
    }
    for await (const folderRef of list.prefixes) {
      filesDeleted += await deleteFolderRecursive(folderRef.fullPath);
    }
    console.log('deleteImages: number of files deleted = ' + filesDeleted);
    return filesDeleted;
  };
}

export default Firebase;
