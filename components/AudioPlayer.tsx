
import React, { useRef, useState, useEffect } from 'react';
import { Volume2, Loader2, Music } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
}

// Global cache for audio strings to avoid re-fetching
const audioCache: Record<string, string> = {};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, autoPlay = false }) => {
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playPcm = async (base64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const dataInt16 = new Int16Array(bytes.buffer);
      const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error("Error playing audio", e);
    }
  };

  const handlePlay = async () => {
    if (loading) return;
    
    // Check cache first
    if (audioCache[text]) {
      playPcm(audioCache[text]);
      return;
    }

    setLoading(true);
    const base64 = await generateSpeech(text);
    if (base64) {
      audioCache[text] = base64; // Save to cache
      await playPcm(base64);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (autoPlay) handlePlay();
  }, [text, autoPlay]);

  return (
    <button
      onClick={handlePlay}
      disabled={loading}
      className="bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white p-3 rounded-2xl transition-all shadow-lg active:scale-90 flex items-center justify-center border-2 border-white/50"
    >
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
    </button>
  );
};

export default AudioPlayer;
