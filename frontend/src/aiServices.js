// aiServices.js
// Updated to use the raw IP and HTTP to prevent SSL Protocol Errors on port 7008
const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || "http://16.112.236.67:7008";

// 1. Language Translator
export const translateText = async (text, targetLanguage) => {
  try {
    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, script: text, target_language: targetLanguage })
    });

    if (!response.ok) {
      console.warn("Translation request returned status:", response.status);
      return { translated_text: text };
    }

    return await response.json();
  } catch (error) {
    console.error("translateText error:", error);
    return { translated_text: text };
  }
};

// 2. Text to Voice
export const textToVoice = async (text, targetLanguage = "en") => {
  try {
    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/text-to-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, target_language: targetLanguage })
    });

    if (!response.ok) {
      throw new Error(`Text-to-Voice failed with status ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("textToVoice error:", error);
    return null;
  }
};

// 3. Voice to Text (Audio Upload)
export const voiceToText = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/voice-to-text`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Voice-to-Text failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("voiceToText error:", error);
    return { text: "" };
  }
};

// 4. Audio Translator
export const audioTranslator = async (audioBlob, targetLanguage) => {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("target_language", targetLanguage);

    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/audio-translator`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Audio Translator failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("audioTranslator error:", error);
    return { translated_text: "" };
  }
};

// 5. Student Performance Assessment
export const assessStudent = async (studentData) => {
  try {
    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      throw new Error(`Student Assessment failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("assessStudent error:", error);
    return { error: "Failed to generate assessment. Please check AI backend connection." };
  }
};

// 6. Teacher Performance Assessment
export const assessTeacher = async (teacherData) => {
  try {
    const response = await fetch(`${AI_BASE_URL}/api/v1/hm/teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    });

    if (!response.ok) {
      throw new Error(`Teacher Assessment failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("assessTeacher error:", error);
    return { error: "Failed to generate assessment. Please check AI backend connection." };
  }
};
