# Gladia Real-Time Speech-to-Text Setup

This project integrates with [Gladia](https://gladia.io) for real-time speech-to-text transcription in the case creation interface.

## Setup Instructions

### 1. Get a Gladia API Key

1. Visit [https://gladia.io](https://gladia.io)
2. Sign up for an account
3. Navigate to your dashboard
4. Generate an API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_GLADIA_API_KEY=your_actual_gladia_api_key_here
```

**Important Notes:**
- The `NEXT_PUBLIC_` prefix is required for client-side usage
- Replace `your_actual_gladia_api_key_here` with your real API key
- Restart your development server after adding the environment variable

### 3. Restart Development Server

```bash
npm run dev
```

## Features

### Real-Time Transcription
- **Live Audio Processing**: Captures microphone audio and streams it to Gladia
- **Real-Time Display**: Shows transcription as you speak
- **Confidence Scoring**: Displays transcription confidence levels
- **Medical Terminology**: Optimized for medical terminology and clinical language

### Audio Quality Settings
- **Sample Rate**: 16kHz (optimized for speech)
- **Encoding**: PCM 16-bit
- **Audio Processing**: Includes echo cancellation, noise suppression, and auto gain control

### Error Handling
- **Connection Status**: Shows connecting/recording states
- **Error Display**: User-friendly error messages
- **Fallback**: Manual typing always available

## Usage

1. Navigate to "New Case" page
2. Click "Start Dictation" button
3. Allow microphone access when prompted
4. Start speaking - transcription appears in real-time
5. Final transcripts are automatically added to the case summary
6. Click "Stop Recording" when finished

## Troubleshooting

### Common Issues

**"Gladia API key not configured"**
- Ensure `.env.local` file exists with `NEXT_PUBLIC_GLADIA_API_KEY`
- Restart development server
- Check API key is valid on Gladia dashboard

**"Microphone access denied"**
- Allow microphone permissions in browser
- Ensure HTTPS is used (required for microphone access)
- Check browser microphone settings

**"Failed to connect to Gladia WebSocket"**
- Check internet connection
- Verify API key is correct
- Check Gladia service status

**Poor transcription quality**
- Speak clearly and at moderate pace
- Reduce background noise
- Use medical terminology for better accuracy
- Check microphone quality

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (requires HTTPS)
- **Edge**: Full support

### Performance Tips

- Use a good quality microphone
- Speak in a quiet environment
- Use medical terminology for better accuracy
- Keep sentences reasonably short for better real-time processing

## API Configuration

The integration supports these Gladia configuration options:

```typescript
{
  encoding: 'wav/pcm',        // Audio encoding format
  sample_rate: 16000,         // Sample rate in Hz
  bit_depth: 16,              // Bit depth
  channels: 1,                // Mono audio
  language: 'english',        // Language for transcription
  transcription_hint: 'medical terminology, patient symptoms, diagnosis, treatment'
}
```

## Security Considerations

- API key is exposed client-side (required for browser WebSocket connection)
- Use environment variables to manage API keys
- Consider rate limiting for production use
- Monitor API usage on Gladia dashboard

## Cost Management

- Gladia charges based on audio processing time
- Monitor usage in Gladia dashboard
- Consider implementing session time limits
- Use wisely for production deployments 