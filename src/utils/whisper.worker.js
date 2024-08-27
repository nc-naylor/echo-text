import { pipeline, env } from '@xenova/transformers';
import { MessageTypes } from './presets';
env.allowLocalModels = false;

// Contains logic for loading and reusing ASR pipeline.
class MyTranscriptionPipeline {
  static task = 'automatic-speech-recognition';
  static model = 'openai/whisper-tiny.en';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, null, {
        progress_callback,
      });
    }

    return this.instance;
  }
}

// Listens for requests to start transcription
self.addEventListener('message', async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

// Handles core transcription logic
async function transcribe(audio) {
  sendLoadingMessage('Loading');
  let pipeline;
  try {
    // Get or create pipeline instance
    pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
  } catch (err) {
    console.log(err.message);
  }
  sendLoadingMessage('success');

  const stride_length_s = 5;

  // Create new instance of GenerationTracker to manage transcription process
  const generationTracker = new GenerationTracker(pipeline, stride_length_s);
  await pipeline(audio, {
    top_k: 0,
    do_sample: false,
    chunk_length: 30,
    stride_length_s,
    return_timestamps: true,
    callback_function:
      generationTracker.callbackFunction.bind(generationTracker),
    chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
  });
  generationTracker.sendFinalResult();
}

async function load_model_callback(data) {
  const { status } = data;
  if (status === 'progress') {
    const { file, progress, loaded, total } = data;
    sendDownloadingMessage(file, progress, loaded, total);
  }
}

function sendLoadingMessage(status) {
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  });
}

async function sendDownloadingMessage(file, progress, loaded, total) {
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file,
    progress,
    loaded,
    total,
  });
}

// Manages the transcription process
class GenerationTracker {
  constructor(pipeline, stride_length_s) {
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    this.time_precision =
      pipeline?.processor.feature_extractor.config.chunk_length /
      pipeline.model.config.max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({
      type: MessageTypes.INFERENCE_DONE,
    });
  }

  // Processes and sends partial results to main thread
  callbackFunction(beams) {
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) {
      return;
    }

    const bestBeam = beams[0];

    let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
      skip_special_tokens: true,
    });

    const result = {
      text,
      start: this.getLastChunkTimeStamp(),
      end: undefined,
    };
    createPartialResultMessage(result);
  }

  // Processes chunks of audio data and sends results to main thread
  chunkCallback(data) {
    this.chunks.push(data);
    const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
      this.chunks,
      {
        time_precision: this.time_precision,
        return_timestamps: true,
        force_full_sequence: false,
      }
    );

    this.processed_chunks = [];

    chunks.forEach((chunk, index) => {
      this.processed_chunks.push(this.processChunk(chunk, index));
    });

    createResultMessage(
      this.processed_chunks,
      false,
      this.getLastChunkTimeStamp()
    );
  }

  getLastChunkTimeStamp() {
    if (this.processed_chunks.length === 0) {
      return 0;
    }
  }

  // Handles formatting and timestamping of each processed chunk
  processChunk(chunk, index) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: `${text.trim()}`,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}

function createResultMessage(results, isDone, completedUntilTimestamp) {
  self.postMessage({
    type: MessageTypes.RESULT,
    results,
    isDone,
    completedUntilTimestamp,
  });
}

function createPartialResultMessage(result) {
  self.postMessage({
    type: MessageTypes.RESULT_PARTIAL,
    result,
  });
}
