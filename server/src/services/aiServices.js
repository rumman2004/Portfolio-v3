import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { CohereClient } from "cohere-ai";
import { env } from "../config/env.js";

const generatePrompt = (originalSubject, originalMessage, draftReply) => `
You are an expert, highly professional AI assistant acting on behalf of a web developer named Rumman Ahmed.
A client has sent a message through his portfolio contact form. 
Your task is to take Rumman's rough draft reply and rewrite it into a polished, highly professional, and friendly email response.

Original Subject: ${originalSubject}
Original Message: ${originalMessage}

Rough Draft Reply: ${draftReply}

Instructions:
1. Make the email sound highly professional but welcoming.
2. Fix any grammatical errors or typos.
3. Keep the core intent of the rough draft intact.
4. Do NOT include any placeholders like [Your Name]. Sign off as "Rumman Ahmed".
5. Evaluate the original draft. If you had to rewrite it to fix grammar or tone, the status is "Improved". If the draft was already highly professional and flawless, the status is "Perfect". If the draft was fine and didn't strictly need changes but you polished it anyway, the status is "No need to improve".
6. You MUST return your response exactly in this format, with nothing else:
Status: [Improved | Perfect | No need to improve]
---
[Your final email text here]
`;

const tryGemini = async (prompt) => {
  if (!env.ai.geminiKey) throw new Error("Gemini API key missing");
  const ai = new GoogleGenAI({ apiKey: env.ai.geminiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

const tryGroq = async (prompt) => {
  if (!env.ai.groqKey) throw new Error("Groq API key missing");
  const groq = new Groq({ apiKey: env.ai.groqKey });
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });
  return completion.choices[0]?.message?.content;
};

const tryCohere = async (prompt) => {
  if (!env.ai.cohereKey) throw new Error("Cohere API key missing");
  const cohere = new CohereClient({ token: env.ai.cohereKey });
  const response = await cohere.chat({
    message: prompt,
    model: 'command-r',
  });
  return response.text;
};

const parseAIResponse = (rawResponse, originalDraft) => {
  try {
    const parts = rawResponse.split('---');
    if (parts.length >= 2) {
      let status = parts[0].replace('Status:', '').trim();
      // Normalize status
      if (!['Improved', 'Perfect', 'No need to improve'].includes(status)) {
        status = 'Improved';
      }
      return { text: parts.slice(1).join('---').trim(), aiStatus: status };
    }
  } catch (e) {
    console.error("Failed to parse AI response:", e);
  }
  // Fallback if AI didn't follow formatting
  return { text: rawResponse.trim(), aiStatus: 'Improved' };
};

export const improveDraftReply = async (originalSubject, originalMessage, draftReply) => {
  const prompt = generatePrompt(originalSubject, originalMessage, draftReply);
  
  // Try Gemini First
  try {
    const result = await tryGemini(prompt);
    if (result) {
      const parsed = parseAIResponse(result, draftReply);
      return { provider: 'Gemini', text: parsed.text, aiStatus: parsed.aiStatus };
    }
  } catch (err) {
    console.warn("Gemini failed, falling back to Groq...", err.message);
  }

  // Fallback to Groq
  try {
    const result = await tryGroq(prompt);
    if (result) {
      const parsed = parseAIResponse(result, draftReply);
      return { provider: 'Groq', text: parsed.text, aiStatus: parsed.aiStatus };
    }
  } catch (err) {
    console.warn("Groq failed, falling back to Cohere...", err.message);
  }

  // Fallback to Cohere
  try {
    const result = await tryCohere(prompt);
    if (result) {
      const parsed = parseAIResponse(result, draftReply);
      return { provider: 'Cohere', text: parsed.text, aiStatus: parsed.aiStatus };
    }
  } catch (err) {
    console.warn("Cohere failed.", err.message);
  }

  // If all APIs fail, return the original draft as a fallback
  return { provider: 'None (Fallback)', text: draftReply, aiStatus: 'None' };
};
