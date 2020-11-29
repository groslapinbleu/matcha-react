import React from 'react';
function App() {
  return (
    <div>
      <div className='py-8'></div>
      <div className='flex justify-center'>
        <div className='md:flex'>
          <div className='md:flex-shrink-0'>
            <img
              className='rounded-lg md:w-56'
              src='https://i.imgur.com/KVarsC2.png'
              alt='Tailwind CSS Logo'
            />
          </div>
          <div className='flex flex-col justify-center'>
            <div className='mt-4 md:mt-0 md:ml-6'>
              <div className='text-sm font-bold tracking-wide text-indigo-600 uppercase'>
                Setup Guide
              </div>
              <div className='block mt-1 text-lg font-semibold leading-tight text-gray-900'>
                Tailwind CSS with PostCSS in
              </div>
              <div className='block mt-1 text-lg font-semibold leading-tight text-gray-900'>
                Create-React-App Setup in 5 Minutes
              </div>
              <p className='mt-2 text-gray-600'>
                Featuring monolithic blocks of shell commands
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
