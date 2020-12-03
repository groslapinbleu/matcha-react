import { auth } from "../services/firebase";

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function updateUserProfile(displayName) {
  console.log("updateUserProfile avec " + displayName)
  const user = auth().currentUser
  return user.updateProfile({
    displayName: displayName,
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  })
}

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function signInWithGitHub() {
  const provider = new auth.GithubAuthProvider();
  return auth().signInWithPopup(provider);
}