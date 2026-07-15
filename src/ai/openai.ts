import OpenAI from 'openai';
import { AiProvider, AiProviderParams, GenerationResult, SYSTEM_INSTRUCTIONS_TEMPLATE, USER_PROMPT_TEMPLATE, parseResponse } from './types.js';

export class OpenAiProvider implements AiProvider {
  async generatePost(params: AiProviderParams): Promise<GenerationResult> {
    const openai = new OpenAI({ apiKey: params.apiKey });
    const modelName = params.modelName || 'gpt-4o-mini';

    const systemPrompt = SYSTEM_INSTRUCTIONS_TEMPLATE(params.projectName, params.tone);
    const userPrompt = USER_PROMPT_TEMPLATE(params.version, params.changelog);

    try {
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      });

      const text = completion.choices[0]?.message?.content?.trim() || '';
      return parseResponse(text);
    } catch (error: any) {
      throw new Error(`Erro na geração com OpenAI (${modelName}): ${error.message}`);
    }
  }
}
