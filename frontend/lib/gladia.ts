export interface GladiaConfig {
  encoding?: string;
  sample_rate?: number;
  bit_depth?: number;
  channels?: number;
}

export interface GladiaTranscript {
  type: 'transcript';
  session_id: string;
  created_at: string;
  data: {
    id: string;
    utterance: {
      text: string;
      start: number;
      end: number;
      language: string;
      channel?: number;
    };
    is_final: boolean;
    confidence?: number;
  };
}

export interface GladiaError {
  type: 'error';
  message: string;
}

export type GladiaMessage = GladiaTranscript | GladiaError;

export class GladiaService {
  private websocket: WebSocket | null = null;
  private isConnected = false;
  private apiKey: string;
  private config: GladiaConfig;

  constructor(apiKey: string, config: GladiaConfig = {}) {
    this.apiKey = apiKey;
    this.config = {
      encoding: 'wav/pcm',
      sample_rate: 16000,
      bit_depth: 16,
      channels: 1,
      ...config
    };
  }

  async startSession(): Promise<string> {
    try {
      // First, create a live transcription session
      const response = await fetch('https://api.gladia.io/v2/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gladia-Key': this.apiKey,
        },
        body: JSON.stringify(this.config),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Gladia session: ${response.status} - ${errorText}`);
      }

      const { id, url } = await response.json();
      
      // Connect to the WebSocket
      return new Promise((resolve, reject) => {
        this.websocket = new WebSocket(url);
        
        // Set binary type for audio data
        this.websocket.binaryType = 'arraybuffer';
        
        this.websocket.onopen = () => {
          this.isConnected = true;
          console.log('Connected to Gladia WebSocket');
          resolve(id);
        };

        this.websocket.onerror = (error) => {
          console.error('Gladia WebSocket error:', error);
          reject(new Error('Failed to connect to Gladia WebSocket'));
        };

        this.websocket.onclose = (event) => {
          this.isConnected = false;
          console.log('Gladia WebSocket connection closed', { code: event.code, reason: event.reason });
        };
      });
    } catch (error) {
      console.error('Error starting Gladia session:', error);
      throw error;
    }
  }

  onMessage(callback: (message: GladiaMessage) => void) {
    if (!this.websocket) {
      throw new Error('WebSocket not initialized. Call startSession() first.');
    }

    this.websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types from Gladia
        if (message.type === 'transcript') {
          callback(message as GladiaTranscript);
        } else if (message.type === 'error') {
          callback({
            type: 'error',
            message: message.message || 'Unknown error occurred'
          });
        } else {
          // Log other message types for debugging
          console.log('Gladia message:', message);
        }
      } catch (error) {
        console.error('Error parsing Gladia message:', error);
        callback({
          type: 'error',
          message: 'Failed to parse transcription message'
        });
      }
    };
  }

  sendAudio(audioData: ArrayBuffer) {
    if (!this.websocket || !this.isConnected) {
      throw new Error('WebSocket not connected. Call startSession() first.');
    }

    if (this.websocket.readyState === WebSocket.OPEN) {
      // Send audio data as binary according to Gladia docs
      this.websocket.send(audioData);
    } else {
      console.warn('WebSocket not ready to send data');
    }
  }

  endSession() {
    if (this.websocket) {
      if (this.isConnected) {
        // Send stop recording signal as per Gladia docs
        this.websocket.send(JSON.stringify({ type: 'stop_recording' }));
      }
      this.websocket.close(1000); // Use code 1000 for intentional closure
      this.websocket = null;
      this.isConnected = false;
    }
  }

  isSessionActive(): boolean {
    return this.isConnected && this.websocket?.readyState === WebSocket.OPEN;
  }
}

// Audio processing utilities
export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  async startRecording(onAudioData: (audioData: ArrayBuffer) => void): Promise<MediaStream> {
    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      // Create audio source
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create processor (deprecated but still widely supported)
      // For modern browsers, you might want to use AudioWorklet instead
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const audioData = inputBuffer.getChannelData(0);
        
        // Convert Float32Array to Int16Array (PCM 16-bit)
        const pcmData = new Int16Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          pcmData[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
        }

        onAudioData(pcmData.buffer);
      };

      // Connect the audio processing chain
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      return this.mediaStream;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  }

  stopRecording() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
} 