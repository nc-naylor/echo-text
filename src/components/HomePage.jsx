import { useState, useEffect, useRef } from 'react';

export default function HomePage(props) {
  const { setFile, setAudioStream } = props;

  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);

  const mediaRecorder = useRef(null);

  const mimeType = 'audio/webm';

  async function startRecording() {
    let tempStream;

    console.log('start recording');

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }
    setRecordingStatus('recording');

    // Create new media recorder instance using the stream
    const media = new MediaRecorder(tempStream, { type: mimeType });

    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') {
        return;
      }
      if (event.data.size === 0) {
        return;
      }
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  }

  async function stopRecording() {
    setRecordingStatus('inactive');
    console.log('Stop recording');

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0);
    };
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') {
      return;
    }
    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <main className='flex-1 flex flex-col gap-3 text-center sm:gap-4 justify-center p-4 pb-32'>
      <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl'>
        Echo
        <span className='text-indigo-600 bold'>Text</span>
      </h1>
      <h3 className='font-medium md:text-large'>
        Record<span className='text-indigo-600'>&rarr;</span> Transribe{' '}
        <span className='text-indigo-600'>&rarr;</span> Translate
      </h3>
      <button
        onClick={
          recordingStatus === 'recording' ? stopRecording : startRecording
        }
        className='flex specialBtn px-4 py-2 rounded-xl items-center text-base justify-between g-4 mx-auto w-72 max-w-full my-4'
      >
        <p className='text-indigo-600'>
          {' '}
          {recordingStatus === 'inactive' ? 'Record' : `Stop recording`}
        </p>
        <div className='flex items-center gap-2'>
          {duration && <p className='text-sm'>{duration}s</p>}
        </div>
        <i
          className={
            'fa-solid fa-microphone duration-200' +
            (recordingStatus === 'recording' ? 'text-rose-300' : '')
          }
        ></i>
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
      <p className='italic text-slate-500'>Free to use, no strings attached</p>
    </main>
  );
}
