import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'moment/locale/fr'; // if we add a language to the app, we will need to import the locale here
// import getNavigatorLanguage from 'helpers/navigatorLanguage';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

// this is an implementation of a DatePicker that uses the locale
// to display the correct date format
function DatePicker({ onDayChange, value }) {
  // const navigatorLanguage = getNavigatorLanguage();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  // console.log('i18n.language = ' + lang);

  return (
    <div>
      <DayPickerInput
        onDayChange={(day) => onDayChange(day)}
        value={value}
        formatDate={formatDate}
        parseDate={parseDate}
        format='L'
        placeholder={`${formatDate(new Date(), 'L ', lang)}`}
        dayPickerProps={{
          locale: lang,
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

export default DatePicker;
