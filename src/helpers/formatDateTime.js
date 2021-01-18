import i18next from 'i18next';
// import getNavigatorLanguage from './navigatorLanguage'; // replaced by i18next.language

export default function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  const time = new Intl.DateTimeFormat(i18next.language, {
    //    const time = new Intl.DateTimeFormat(getNavigatorLanguage, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);
  return time;
}
