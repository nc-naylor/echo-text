import React from 'react';

export default function FileDisplay(props) {
  const { file, audioStream, handleAudioReset } = props;
  return (
    <main className='flex-1 flex flex-col gap-3 text-center sm:gap-4 justify-center p-4 pb-32 w-72 sm:w-96 max-w-full mx-auto'>
      <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>
        Your <span className='text-indigo-600 bold'>File</span>
      </h1>
      <div className='flex flex-col text-left gap-2 my-4'>
        <h3 className='font-semibold'>Name</h3>
        <p>{file ? file?.name : 'Custom audio'}</p>
      </div>
      <div className='flex items-center justify-between gap-4'>
        <button
          onClick={handleAudioReset}
          className='text-slate-500 hover:text-indigo-600 duration-200'
        >
          Reset
        </button>
        <button className='specialBtn px-3 p-2 rounded-lg text-indigo-600 flex items-center gap-2 font-medium'>
          <p>Transcribe</p>
          <i className='fa-solid fa-pen-nib'></i>
        </button>
      </div>
    </main>
  );
}
