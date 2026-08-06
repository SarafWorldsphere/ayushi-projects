const BASE_URL = 'http://16.112.236.67:7008/api/v1/student';

// --- NEW TRANSLATION CACHE ---
// This memory object remembers words we have already translated!
const translationCache = {};

// Helper function for standard POST requests
async function postData(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error);
    return null;
  }
}

// 1. Content Generation
export const generateContent = (topic, capacity = "Average") =>
  postData('/content/generate', { topic, learning_capacity: capacity });

// 2. Quiz Generation
export const generateQuiz = (subject, difficulty = "Medium", numQuestions = 5) =>
  postData('/quiz/generate', { topic: subject, difficulty, num_questions: numQuestions });

// 3. Quiz Evaluation
export const evaluateQuiz = (submissionData) =>
  postData('/quiz/evaluate', { submission_data: submissionData });

// 4. Translate (NOW WITH INSTANT MEMORY CACHE)
export const translateText = async (text, lang) => {
  const cacheKey = `${lang}_${text}`;
  
  // If we already translated this word to this language, return it instantly!
  if (translationCache[cacheKey]) {
    return { translated_text: translationCache[cacheKey] };
  }

  // Otherwise, ask the AI server
  const response = await postData('/translate', { text, target_language: lang });
  
  // Save the AI's answer into our memory cache for next time
  if (response) {
    const finalString = response.translated_text || response.text || response.data;
    if (finalString) {
      translationCache[cacheKey] = finalString;
    }
  }
  
  return response;
};

// 5. Voice to Text
export const voiceToText = async (audioBlob, language = "English") => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('language', language);

  try {
    const response = await fetch(`${BASE_URL}/voice-to-text`, {
      method: 'POST',
      body: formData, 
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Voice to Text Error:', error);
    return null;
  }
};

// 6. Text to Voice
export const textToVoice = async (text, language = "English") => {
  try {
    const response = await fetch(`${BASE_URL}/text-to-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) throw new Error('Text to voice failed');

    const data = await response.json();
    if (data && data.audio_base64) {
      return `data:audio/mp3;base64,${data.audio_base64}`;
    }
    return null;
  } catch (error) {
    console.error('Text-to-Voice Error:', error);
    return null;
  }
};

