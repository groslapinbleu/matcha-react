import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
    formatDate,
    parseDate,
  } from 'react-day-picker/moment';
  import 'moment/locale/fr';

import PropTypes from 'prop-types'

export default function DatePicker({onDayChange, value}) {
  return (
    <div>
      <DayPickerInput onDayChange={day => onDayChange(day)} 
      value={value} 
      formatDate={formatDate}
      parseDate={parseDate}
      format="LL"
      placeholder={`${formatDate(new Date(), 'LL', 'fr')}`}
      dayPickerProps={{
        locale: 'fr',
        localeUtils: MomentLocaleUtils,
      }}/>
    </div>
  );
}
DatePicker.propTypes = {
    onDayChange: PropTypes.func.isRequired,
    value: PropTypes.date
}