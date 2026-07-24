'use client';

import { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';

export default function GlobalAudioNarrator() {
  const [loading, setLoading] = useState(false);

  const playPageAudio = async () => {
    setLoading(true);
    try {
      const pageText = document.body.innerText;

      const response = await fetch('http://16.112.236.67:7004/api/v1/admin/text-to-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pageText })
      });

      if (!response.ok) throw new Error('Audio generation failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (error) {
      console.error("Audio Error:", error);
      alert("Failed to generate audio for this page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={playPageAudio}
      disabled={loading}
      className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-2xl text-white hover:scale-110 transition-transform z-50 flex items-center justify-center"
      title="Read this page aloud"
    >
      {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
    </button>
  );
}
