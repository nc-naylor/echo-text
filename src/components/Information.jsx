import { useState, useEffect, useRef } from 'react';
import Transcription from './Transcription';
import Translation from './Translation';

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState('transcription');
  const [translation, setTranslation] = useState(null);
  const [translating, setTranslating] = useState(null);
  const [toLanguage, setToLanguage] = useState('Select language');

  const myWorker = useRef();

  useEffect(() => {
    if (!myWorker.current) {
      myWorker.current = new Worker(
        new URL('../utils/translate.worker.js', import.meta.url),
        {
          type: 'module',
        }
      );
    }

    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          console.log('DOWNLOADING');
          break;
        case 'progress':
          console.log('LOADING');
          break;
        case 'update':
          setTranslation(e.data.output);
          console.log(e.data.output);
          break;
        case 'complete':
          setTranslating(false);
          console.log('COMPLETE');
          break;
      }
    };
    myWorker.current.addEventListener('message', onMessageReceived);

    return () =>
      myWorker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const textElement =
    tab === 'transcription' ? output.map((val) => val.text) : translation || '';

  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  function handleDownload() {
    const element = document.createElement('a');
    const file = new Blob([textElement], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `EchoText_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  function generateTranslation() {
    if (translating || toLanguage === 'Select language') {
      return;
    }

    setTranslating(true);

    myWorker.current.postMessage({
      text: output.map((val) => val.text),
      src_lang: 'eng_Latn',
      tgt_lang: toLanguage,
    });
  }

  return (
    <main className='flex-1 flex flex-col gap-3 text-center sm:gap-4 justify-center p-4 pb-32 max-w-prose w-full mx-auto'>
      <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>
        Your <span className='text-indigo-600 bold'>Transcription</span>
      </h1>
      <div className='grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
        <button
          onClick={() => setTab('transcription')}
          className={
            'px-4 py-2 duration-200 ' +
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
            'px-4 py-2 duration-200 ' +
            (tab === 'translation'
              ? ' bg-indigo-400 text-white'
              : ' text-indigo-400 hover:text-indigo-600')
          }
        >
          Translation
        </button>
      </div>
      <div className='my-8 flex flex-col'>
        {tab === 'transcription' ? (
          <Transcription {...props} textElement={textElement} />
        ) : (
          <Translation
            {...props}
            toLanguage={toLanguage}
            translating={translating}
            textElement={textElement}
            setTranlating={setTranslating}
            setTranslation={setTranslation}
            setToLanguage={setToLanguage}
            generateTranslation={generateTranslation}
          />
        )}
      </div>
      <div className='flex items-center gap-4 mx-auto'>
        <button
          onClick={handleCopy}
          title='Copy'
          className='bg-white text-indigo-400 rounded px-2 aspect-square grid place-items-center shadow-md hover:text-indigo-500 duration-200'
        >
          <i className='fa-solid fa-copy'></i>
        </button>
        <button
          onClick={handleDownload}
          title='Download'
          className='bg-white text-indigo-400 rounded px-2 aspect-square grid place-items-center shadow-md hover:text-indigo-500 duration-200'
        >
          <i className='fa-solid fa-download'></i>
        </button>
      </div>
    </main>
  );
}
