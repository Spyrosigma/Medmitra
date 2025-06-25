import { useState, useRef, useCallback, useEffect } from 'react';
import { GladiaService, AudioProcessor, GladiaMessage, GladiaConfig } from '@/lib/gladia';

interface UseGladiaSTTOptions {
  apiKey: string;
  config?: GladiaConfig;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

interface UseGladiaSTTReturn {
  isRecording: boolean;
  isConnecting: boolean;
  transcript: string;
  finalTranscript: string;
  confidence: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
}

export function useGladiaSTT({
  apiKey,
  config,
  onTranscript,
  onError
}: UseGladiaSTTOptions): UseGladiaSTTReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const gladiaServiceRef = useRef<GladiaService | null>(null);
  const audioProcessorRef = useRef<AudioProcessor | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
    setConfidence(0);
  }, []);

  const handleGladiaMessage = useCallback((message: GladiaMessage) => {
    if (message.type === 'transcript') {
      const { data } = message;
      const newTranscript = data.utterance.text;
      const isFinal = data.is_final;
      const newConfidence = data.confidence || 0;
      
      setConfidence(newConfidence);
      
      if (isFinal) {
        setFinalTranscript(prev => prev + newTranscript);
        setTranscript(''); // Clear interim transcript
        onTranscript?.(newTranscript, true);
      } else {
        setTranscript(newTranscript);
        onTranscript?.(newTranscript, false);
      }
    } else if (message.type === 'error') {
      const errorMessage = `Transcription error: ${message.message}`;
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Gladia error:', message.message);
    }
  }, [onTranscript, onError]);

  const startRecording = useCallback(async () => {
    if (!apiKey) {
      const errorMessage = 'Gladia API key is required';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Initialize Gladia service
      gladiaServiceRef.current = new GladiaService(apiKey, config);
      
      // Start Gladia session
      sessionIdRef.current = await gladiaServiceRef.current.startSession();
      
      // Set up message handler
      gladiaServiceRef.current.onMessage(handleGladiaMessage);

      // Initialize audio processor
      audioProcessorRef.current = new AudioProcessor();
      
      // Start audio recording
      await audioProcessorRef.current.startRecording((audioData) => {
        if (gladiaServiceRef.current?.isSessionActive()) {
          gladiaServiceRef.current.sendAudio(audioData);
        }
      });

      setIsRecording(true);
      console.log('Started recording with session ID:', sessionIdRef.current);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Error starting recording:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [apiKey, config, handleGladiaMessage, onError]);

  const stopRecording = useCallback(() => {
    try {
      // Stop audio recording
      if (audioProcessorRef.current) {
        audioProcessorRef.current.stopRecording();
        audioProcessorRef.current = null;
      }

      // End Gladia session
      if (gladiaServiceRef.current) {
        gladiaServiceRef.current.endSession();
        gladiaServiceRef.current = null;
      }

      setIsRecording(false);
      setIsConnecting(false);
      sessionIdRef.current = null;
      
      console.log('Stopped recording');
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    isConnecting,
    transcript,
    finalTranscript,
    confidence,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
  };
} 