import React, { useRef, useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
} from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AIAssistantScreen() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startListening = async () => {
    try {
      setError('');

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

      const audioTrack = stream.getAudioTracks()[0];

      console.log(
        'MIC TRACK:',
        audioTrack.getSettings()
      );

      console.log('MIC STATE:', {
        enabled: audioTrack.enabled,
        muted: audioTrack.muted,
        readyState: audioTrack.readyState,
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        console.log('CHUNK:', event.data.size);

        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log('STOP FIRED');

        const audioBlob = new Blob(
          chunksRef.current,
          {
            type: 'audio/webm',
          }
        );

        console.log('FINAL AUDIO:', {
          size: audioBlob.size,
          chunks: chunksRef.current.length,
        });

        stream
          .getTracks()
          .forEach((track) => track.stop());

        setProcessing(true);

        console.log(
          'CALLING PROCESS VOICE:',
          audioBlob.size
        );

        await processVoice(audioBlob);
      };

      recorder.start(1000);

      setListening(true);
      setTranscript('');
      setReply('');
    } catch (err) {
      console.error(
        'Microphone error:',
        err
      );

      setError(
        'Microphone permission is required.'
      );
    }
  };

  const stopListening = () => {
    if (!recorderRef.current) return;

    if (
      recorderRef.current.state === 'recording'
    ) {
      recorderRef.current.stop();
    }

    setListening(false);
  };

  const processVoice = async (
    audioBlob: Blob
  ) => {
    try {
      // =========================
      // AUDIO -> BASE64
      // =========================

      const buffer =
        await audioBlob.arrayBuffer();

      const bytes = new Uint8Array(buffer);

      let binary = '';

      for (
        let i = 0;
        i < bytes.length;
        i++
      ) {
        binary += String.fromCharCode(
          bytes[i]
        );
      }

      const audioBase64 = btoa(binary);

      console.log(
        'SENDING AUDIO:',
        audioBlob.size
      );

      // =========================
      // SEND TO BACKEND
      // =========================

      const response = await fetch(
        `${API_BASE_URL}/api/ai/voice`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            audioBase64,
            mimeType: 'audio/webm',
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'VOICE API RESPONSE:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Voice request failed'
        );
      }

      // =========================
      // SHOW TRANSCRIPT
      // =========================

      setTranscript(
        data.transcript || ''
      );

      // =========================
      // SHOW AI REPLY
      // =========================

      setReply(
        data.reply || ''
      );

      // =========================
      // PLAY AI VOICE
      // =========================

      if (data.audio) {
        try {
          const audio = new Audio(
            `data:audio/wav;base64,${data.audio}`
          );

          audio.volume = 1;

          await audio.play();
        } catch (audioError) {
          console.warn(
            'Audio playback blocked:',
            audioError
          );

          setError(
            'Response generated. Click the speaker icon to play.'
          );
        }
      }
    } catch (err) {
      console.error(
        'VOICE ASSISTANT ERROR:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Voice assistant failed.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const replayVoice = async () => {
    if (!reply) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/voice`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            textOnly: true,
            message: reply,
          }),
        }
      );

      const data =
        await response.json();

      if (data.audio) {
        const audio = new Audio(
          `data:audio/wav;base64,${data.audio}`
        );

        await audio.play();
      }
    } catch (err) {
      console.error(
        'Replay failed:',
        err
      );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-150px)] bg-[#eef8f4] rounded-2xl px-6 py-8">

      <div className="w-full flex flex-col items-center">

        {/* Header */}
        <div className="w-full max-w-5xl mb-6">
          <div className="flex items-center gap-3">

            <span className="text-3xl">
              🎙️
            </span>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Voice Assistant
              </h1>

              <p className="text-slate-600">
                Ask about your farm
              </p>

              <p className="text-sm text-emerald-600 mt-1">
                ⚡ Speak naturally and pause
              </p>
            </div>

          </div>
        </div>

        {/* AI Orb */}
        <div className="flex flex-col items-center justify-center min-h-[500px]">

          <button
            onClick={
              processing
                ? undefined
                : listening
                ? stopListening
                : startListening
            }
            className={`
              relative
              w-48 h-48
              rounded-full
              flex items-center justify-center
              shadow-xl
              transition-all duration-500
              ${
                listening
                  ? 'scale-110 shadow-[0_0_80px_rgba(16,185,129,0.45)]'
                  : 'hover:scale-105'
              }
            `}
          >

            {listening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping" />

                <span className="absolute -inset-4 rounded-full border border-emerald-300/40 animate-pulse" />
              </>
            )}

            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-violet-600" />

            <div className="relative z-10 text-white">

              {processing ? (
                <Loader2
                  size={62}
                  className="animate-spin"
                />
              ) : listening ? (
                <MicOff size={62} />
              ) : (
                <Mic size={62} />
              )}

            </div>

          </button>

          <h2 className="mt-8 text-2xl font-semibold text-slate-900">
            {processing
              ? 'PALYA is thinking...'
              : listening
              ? 'Listening...'
              : 'Tap microphone to speak'}
          </h2>

          {/* Transcript */}
          {transcript && (
            <p className="mt-5 text-slate-500 text-center max-w-xl">
              <span className="font-semibold text-slate-700">
                You:
              </span>{' '}
              {transcript}
            </p>
          )}

          {/* AI Reply */}
          {reply && (
            <div className="mt-5 max-w-2xl flex items-start gap-3 text-center">

              <button
                onClick={replayVoice}
                className="mt-1 text-emerald-600 hover:text-emerald-700"
                title="Play response"
              >
                <Volume2 size={24} />
              </button>

              <p className="text-lg text-slate-800">
                {reply}
              </p>

            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Help */}
          <div className="mt-10 bg-white px-8 py-4 rounded-xl shadow-sm text-slate-500 text-sm">
            🎙️ Click the mic and ask PALYA about your farm
          </div>

        </div>
      </div>
    </div>
  );
}