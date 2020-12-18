export default function formatTime(timestamp) {
  const d = new Date(timestamp);
  const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
  return time;
}
