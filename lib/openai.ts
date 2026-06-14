import { Groq } from 'groq-sdk/client.js';
import openAI from 'openai';

export const openai =  new Groq({
    apiKey:process.env.OPENAI_API_KEY,
    
})
    
