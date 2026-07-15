import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiProvider, AiProviderParams, GenerationResult, SYSTEM_INSTRUCTIONS_TEMPLATE, USER_PROMPT_TEMPLATE, parseResponse } from './types.js';

export class GeminiProvider implements AiProvider {
  async generatePost(params: AiProviderParams): Promise<GenerationResult> {
    const genAI = new GoogleGenerativeAI(params.apiKey);
    const modelName = params.modelName || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = SYSTEM_INSTRUCTIONS_TEMPLATE(params.projectName, params.tone);
    const userPrompt = USER_PROMPT_TEMPLATE(params.version, params.changelog);

    try {
      const result = await model.generateContent([systemPrompt, userPrompt]);
      const text = result.response.text().trim();
      return parseResponse(text);
    } catch (error: any) {
      throw new Error(`Erro na geração com Gemini (${modelName}): ${error.message}`);
    }
  }
}
