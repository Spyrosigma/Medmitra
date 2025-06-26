"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  AlertCircle, 
  FileText
} from "lucide-react";
import { useGladiaSTT } from "@/hooks/use-gladia-stt";

interface CaseSummaryFormProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function CaseSummaryForm({
  content,
  onChange,
  placeholder = "Enter patient case summary, symptoms, medical history, and examination findings. You can type here or use the dictation feature..."
}: CaseSummaryFormProps) {
  const gladiaApiKey = process.env.NEXT_PUBLIC_GLADIA_API_KEY;
  
  // Use ref to always get current content value
  const contentRef = useRef(content);
  
  // Update ref whenever content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Callback to handle transcript appending
  const handleTranscriptAppend = useCallback((newTranscript: string, isFinal: boolean) => {
    if (isFinal) {
      // Get current content from ref to avoid stale closure
      const currentContent = contentRef.current;
      const separator = currentContent && !currentContent.endsWith('\n') && !currentContent.endsWith(' ') ? ' ' : '';
      const updatedContent = currentContent + separator + newTranscript;
      onChange(updatedContent);
    }
  }, [onChange]);

  const {
    isRecording,
    isConnecting,
    transcript,
    finalTranscript,
    confidence,
    error: sttError,
    startRecording,
    stopRecording,
    clearTranscript,
    endSession,
  } = useGladiaSTT({
    apiKey: gladiaApiKey || '',
    config: {
      encoding: 'wav/pcm',
      sample_rate: 16000,
      bit_depth: 16,
      channels: 1
    },
    onTranscript: handleTranscriptAppend,
    onError: (error) => {
      console.error('STT Error:', error);
    }
  });

  const handleDictationToggle = async () => {
    if (!gladiaApiKey) {
      alert("Gladia API key not configured.");
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleClearAll = () => {
    onChange('');
    endSession(); // End session and clear transcript state
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Case Summary <span className="text-destructive">*</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDictationToggle}
            disabled={isConnecting}
            className={`transition-colors ${
              isRecording 
                ? "text-red-600 border-red-600 bg-red-50 hover:bg-red-100" 
                : "hover:bg-accent/50"
            }`}
          >
            {isConnecting ? (
              <>
                <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
                Connecting...
              </>
            ) : isRecording ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Dictation
              </>
            )}
          </Button>
          {confidence > 0 && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">
              Confidence: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[350px] p-4 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary "
            style={{ 
              fontFamily: 'inherit', 
              fontSize: '14px', 
              lineHeight: '1.6'
            }}
          />
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording...
            </div>
          )}
        </div>

        {/* Real-time transcript display */}
        {(transcript || isRecording) && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Live Transcription</span>
            </div>
            {transcript && (
              <p className="text-sm text-blue-700 dark:text-blue-200 italic">
                "{transcript}"
              </p>
            )}
            {isRecording && !transcript && (
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Listening... Start speaking to see transcription
              </p>
            )}
          </div>
        )}

        {/* Error display */}
        {sttError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">Transcription Error</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-200 mt-1">{sttError}</p>
          </div>
        )}

        {/* Status and actions */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{content.length} characters</span>
          </div>
          
          <div className="flex items-center gap-2">
            {(content || finalTranscript) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Include chief complaint, symptoms, medical history, examination findings, and any other relevant clinical information.
        </p>
      </div>
    </Card>
  );
} 