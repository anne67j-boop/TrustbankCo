import { GoogleGenAI, Chat } from "@google/genai";
import { Transaction } from "../types";

// Initialize the client
// CRITICAL: process.env.API_KEY is handled by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are TrustBot, a helpful and secure AI financial assistant for TrustBank.
You have access to the user's recent transaction history to answer questions about their spending.
Be concise, professional, and friendly. 
If asking about specific amounts, refer to the provided context.
Do not give specific investment advice (e.g., "buy this stock"), but you can give general budgeting tips.
Format your responses with Markdown for readability (e.g., bold for amounts).
`;

export const createFinancialChat = (transactions: Transaction[]): Chat => {
  // We prime the chat history with the context of the user's data
  // In a real app, this might be RAG, but here we inject it into the system instruction or first prompt context.
  
  const transactionContext = JSON.stringify(transactions.map(t => ({
    date: t.date,
    merchant: t.merchant,
    amount: t.amount,
    type: t.type,
    category: t.category
  })));

  const fullSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nUser Transaction Data Context:\n${transactionContext}`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: fullSystemInstruction,
      temperature: 0.7,
    },
  });
};

export const sendMessageToAdvisor = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the bank's secure AI server. Please try again later.";
  }
};
