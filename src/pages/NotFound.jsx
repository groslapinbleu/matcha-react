import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className='flex h-screen justify-center items-center'>
      <p className='text-center text-4xl font-bold'>
        {t('empty_page', 'Sorry, there is nothing here!')}
      </p>
    </div>
  );
};
export default NotFound;
