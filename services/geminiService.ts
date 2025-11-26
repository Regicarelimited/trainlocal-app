import { GoogleGenAI, Modality } from "@google/genai";
import { TrainerProfile } from "../types";
import { PT_DATA } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateContent = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found");
    return "API Key Missing";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// Helper: PCM to WAV Converter for TTS Playback
const pcmToWav = (pcmData: Uint8Array, sampleRate = 24000) => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataLength = pcmData.length;

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  const blob = new Blob([view, pcmData], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        // Decode base64 to Uint8Array
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        // Convert to playable WAV url
        return pcmToWav(bytes);
    }
    return null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};

export const generateMatchmakingQuestions = async (userGoal: string) => {
    const prompt = `You are a friendly, energetic fitness concierge named "TL Coach" for "TrainLocal". Based on user's goal: "${userGoal}", generate ONE single, highly relevant follow-up question. Return JSON array: ["Your single question here?"]`;
    const responseText = await generateContent(prompt);
    try {
        if (!responseText) throw new Error("No response");
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        return ["What is your main priority?"];
    }
};

export const generateFinalMatch = async (userGoal: string, answers: Record<string, string>) => {
    const prompt = `You are "TL Coach". Goal: "${userGoal}". Answers: ${JSON.stringify(answers)}. List: ${JSON.stringify(PT_DATA.slice(0, 50).map(p => ({ id: p.id, name: p.name, specialisms: p.specialisms })))}. Recommend top 1-5 trainers. Tone: Punchy, human. Return JSON: { "summary": "text", "matchCount": 3, "matches": [{ "id": 123, "name": "Name", "grade": "Perfect Match", "reason": "Reason text" }] }`;
    const responseText = await generateContent(prompt);
    try {
        if (!responseText) throw new Error("No response");
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        return { summary: "Found some matches!", matches: [] };
    }
};
