import moment from 'moment';

// birthday is a Date
const age = (birthday) => {
    const now = Date.now()
    return (moment.duration(now - birthday).years())
  }

export default age;