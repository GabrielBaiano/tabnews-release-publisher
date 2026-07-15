import axios from 'axios';
import { AiProvider, AiProviderParams, GenerationResult, SYSTEM_INSTRUCTIONS_TEMPLATE, USER_PROMPT_TEMPLATE, parseResponse } from './types.js';

export class AnthropicProvider implements AiProvider {
  async generatePost(params: AiProviderParams): Promise<GenerationResult> {
    const modelName = params.modelName || 'claude-3-5-sonnet-20240620';
    const systemPrompt = SYSTEM_INSTRUCTIONS_TEMPLATE(params.projectName, params.tone);
    const userPrompt = USER_PROMPT_TEMPLATE(params.version, params.changelog);

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: modelName,
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        },
        {
          headers: {
            'x-api-key': params.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
        }
      );

      const text = response.data?.content?.[0]?.text?.trim() || '';
      return parseResponse(text);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      throw new Error(`Erro na geração com Anthropic (${modelName}): ${errorMsg}`);
    }
  }
}
