import getNavigatorLanguage from './navigatorLanguage';

export default function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  const time = new Intl.DateTimeFormat(getNavigatorLanguage, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);

  // const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  return time;
}
