
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StrategicPlan } from "../types";

export const generateVisionaryPlan = async (userInput: string): Promise<StrategicPlan> => {
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex strategic reasoning and planning tasks
  const prompt = `
    Based on the following input: "${userInput}", create a comprehensive 2026 strategy.
    Focus on:
    1. The 'Revenue Factory' (Attraction, Engagement, Optimization cycle).
    2. AI-driven services for businesses.
    3. Peak health and performance for the entrepreneur.
    
    Output must be in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visionStatement: { type: Type.STRING },
          quarterlyRoadmap: {
            type: Type.OBJECT,
            properties: {
              Q1: { type: Type.ARRAY, items: { type: Type.STRING } },
              Q2: { type: Type.ARRAY, items: { type: Type.STRING } },
              Q3: { type: Type.ARRAY, items: { type: Type.STRING } },
              Q4: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["Q1", "Q2", "Q3", "Q4"]
          },
          revenueFactoryRefinement: { type: Type.STRING },
          healthOptimizations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["visionStatement", "quarterlyRoadmap", "revenueFactoryRefinement", "healthOptimizations"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to extract text from Gemini response.");
  }

  return JSON.parse(text);
};

/**
 * Creates a chat session for general intelligence and support.
 */
export const startChatSession = () => {
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are the Vision 2026 AI Strategist. 
      You are an expert in the "Revenue Factory" business model and peak human performance (biohacking, vitals, routines).
      Help users plan their business growth through AI and optimize their health.
      Be concise, professional, and strategic.`
    }
  });
};

/**
 * Generates audio from text using the dedicated TTS model.
 */
export const textToSpeech = async (text: string): Promise<string | undefined> => {
  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly and naturally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};