import { useState } from 'react';

export default function Information() {
  const [tab, setTab] = useState('transcription');

  return (
    <main className='flex-1 flex flex-col gap-3 text-center sm:gap-4 justify-center p-4 pb-32 max-w-prose w-full mx-auto'>
      <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>
        Your <span className='text-indigo-600 bold'>Transcription</span>
      </h1>
      <div className='grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
        <button
          onClick={() => setTab('transcription')}
          className={
            'px-4 py-2 duration-200 font-medium ' +
            (tab === 'transcription'
              ? ' bg-indigo-400 text-white'
              : ' text-indigo-400 hover:text-indigo-600')
          }
        >
          Transcription
        </button>
        <button
          onClick={() => setTab('translation')}
          className={
            'px-4 py-2 duration-200 font-medium ' +
            (tab === 'translation'
              ? ' bg-indigo-400 text-white'
              : ' text-indigo-400 hover:text-indigo-600')
          }
        >
          Translation
        </button>
      </div>
    </main>
  );
}
