import React from 'react';

export default function HomePage(props) {
  const { setFile, setAudioStream } = props;

  return (
    <main className='flex-1 flex flex-col gap-3 text-center sm:gap-4 md:gap-5 justify-center p-4 pb-32'>
      <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>
        Echo
        <span className='text-indigo-600 bold'>Text</span>
      </h1>
      <h3 className='font-medium md:text-large'>
        Record<span className='text-indigo-600'>&rarr;</span> Transribe{' '}
        <span className='text-indigo-600'>&rarr;</span> Translate
      </h3>
      <button className='flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between g-4 mx-auto w-72 max-w-full my-4'>
        <p className='text-indigo-600'>Record</p>
        <i className='fa-solid fa-microphone'></i>
      </button>
      <p className='text-base'>
        Or{' '}
        <label className='text-indigo-600 cursor-pointer hover:text-indigo-800 duration-200'>
          upload{' '}
          <input
            onChange={(e) => {
              const tempFile = e.target.files[0];
              setFile(tempFile);
            }}
            className='hidden'
            type='file'
            accept='.mp3'
          />
        </label>
        a .mp3 file
      </p>
      <p className='italic text-slate-600'>Free to use, no strings attached</p>
    </main>
  );
}
