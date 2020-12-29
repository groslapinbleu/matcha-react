// this function tries to guess the navigator language with different techniques
// and will pick 'en' if it fails
// cf. https://stackoverflow.com/questions/673905/best-way-to-determine-users-locale-within-browser

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    } else {
      return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    }
  }

  export default getNavigatorLanguage;