import React from 'react';
import Dropdown from 'components/Dropdown';
import { useTranslation } from 'react-i18next';

const ChangeLanguage = ({ className }) => {
  const languages = ['en', 'fr']; // FIXTHIS: instead of hardcoded list, should retrieve list from i18next somehow
  const { i18n } = useTranslation();

  const changeLanguage = (name, index) => {
    console.log('changeLanguage: index of selected language = ' + index);
    i18n.changeLanguage(languages[index]);
  };

  var selectedElement = languages.findIndex((element) => {
    return element === i18n.language;
  });
  if (selectedElement < 0)
    // default to 0 ie en
    selectedElement = 0;

  return (
    <div>
      <Dropdown
        selectedElement={selectedElement}
        elementList={languages}
        name='language'
        className={className}
        onSelect={changeLanguage}
      />
    </div>
  );
};

export default ChangeLanguage;
