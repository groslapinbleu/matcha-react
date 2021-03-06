# matcha-react

## Objectives of the project

Develop a dating app with React and Firebase. This was a way for me to learn
React and play with Firebase tools (Realtime database, Storage, Cloud Messaging...)

## techologies

This project uses React with tailwindCSS for styling, and Firebase for user management, Firebase Realtime Database as the database, Firebase Storage for image files, and FirebaseCloud Messaging for notifications.
It also uses i18next for internationalization (only English ad French for now), as per www.robinwieruch.de/react-internationalization
The language is a mix of Javascript and TypeScript (I have added TypeScript late into the project)

Note: regarding notifications, you can receive them when the app is in the backgroud by adding a service worker (file firebase-messaging-sw.js, to be put in the public directory).
Please refer to firebase.google.com/docs/cloud-messaging/js/receive for details.
I have added a firebase-messaging-sw.js.example file as an example.

## Firebase Realtime database rules

```Firebase realtime database
{
    "rules": {
        ".read": false,
        ".write": false,
        "users": {
            ".indexOn": [
                "gender"
            ],
            "$uid": {
                ".read": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
                ".write": "$uid === auth.uid || root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
            },
            ".read": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])",
            ".write": "root.child('users/'+auth.uid).child('roles').hasChildren(['ADMIN'])"
        },
        "messages": {
            ".indexOn": [
                "created"
            ],
            "$uid": {
                ".write": "data.exists() ? data.child('userId').val() === auth.uid : newData.child('userId').val() === auth.uid"
            },
            ".read": "auth != null",
            ".write": "auth != null",
        },
    }
}

```

## Firebase storage rules

```Firebase storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{anyUserFile=**}{
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
