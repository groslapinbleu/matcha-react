const firebase = jest.genMockFromModule('firebase');
import FirebaseContext, {
  withFirebase,
} from 'services/Firebase/FirebaseContext';

// TODO : create a Firebase class instead of all of this...
// this class needs to provide mocks for all the attibutes and functions
// that are used in the app...
firebase.initializeApp = jest.fn();

const data = { name: 'data' };
const snapshot = {
  val: () => data,
  exportVal: () => data,
  exists: jest.fn(() => true),
};

firebase.database = jest.fn().mockReturnValue({
  ref: jest.fn().mockReturnThis(),
  on: jest.fn((eventType, callback) => callback(snapshot)),
  update: jest.fn(() => Promise.resolve(snapshot)),
  remove: jest.fn(() => Promise.resolve()),
  once: jest.fn(() => Promise.resolve(snapshot)),
});

firebase.auth = jest.fn().mockReturnValue({
  currentUser: true,
  signOut() {
    return Promise.resolve();
  },
  signInWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      if (password === 'sign' || password === 'key') {
        resolve({ name: 'user' });
      }
      reject(Error('sign in error '));
    });
  },
  createUserWithEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      if (password === 'create' || password === 'key') {
        resolve({ name: 'createUser' });
      }
      reject(Error('create user error '));
    });
  },
});

export { FirebaseContext, withFirebase };
export default firebase;
