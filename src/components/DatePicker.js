import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/fr';
import getNavigatorLanguage from 'helpers/navigatorLanguage';

import PropTypes from 'prop-types';

// this is an implementation of a DatePicker that uses the locale
// to display the correct date format
export default function DatePicker({ onDayChange, value }) {
  const navigatorLanguage = getNavigatorLanguage();
  // console.log('navigatorLanguage = ' + navigatorLanguage);
  return (
    <div>
      <DayPickerInput
        onDayChange={(day) => onDayChange(day)}
        value={value}
        formatDate={formatDate}
        parseDate={parseDate}
        format='L'
        placeholder={`${formatDate(new Date(), 'L ', navigatorLanguage)}`}
        dayPickerProps={{
          locale: navigatorLanguage,
          localeUtils: MomentLocaleUtils,
        }}
      />
    </div>
  );
}
DatePicker.propTypes = {
  onDayChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date),
};
