import axios from 'axios';

const API_BASE_URL = 'http://16.112.236.67:7008/api/v1/student';

export const aiService = {
  // Translate Text
  translateText: async (text, targetLanguage) => {
    const response = await axios.post(`${API_BASE_URL}/translate`, {
      text,
      language: targetLanguage,
    });
    return response.data;
  },

  // Voice to Text (Mic)
  voiceToText: async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await axios.post(`${API_BASE_URL}/voice-to-text`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Text to Voice (Speaker)
  textToVoice: async (text, language) => {
    const response = await axios.post(`${API_BASE_URL}/text-to-voice`, {
      text,
      language,
    }, { responseType: 'blob' }); // Important to receive audio file
    return response.data;
  }
};
