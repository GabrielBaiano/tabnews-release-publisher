import { AiProvider } from './types.js';
import { GeminiProvider } from './gemini.js';
import { OpenAiProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';

export * from './types.js';
export { GeminiProvider, OpenAiProvider, AnthropicProvider };

// Registry of available AI providers
export const providers: Record<string, new () => AiProvider> = {
  gemini: GeminiProvider,
  openai: OpenAiProvider,
  anthropic: AnthropicProvider,
};

/**
 * Instantiate the selected AI provider
 */
export function getAiProvider(providerName: string): AiProvider {
  const name = providerName.toLowerCase().trim();
  const ProviderClass = providers[name];
  if (!ProviderClass) {
    throw new Error(
      `Provedor de IA "${providerName}" não é suportado. Escolha entre: ${Object.keys(providers).join(', ')}`
    );
  }
  return new ProviderClass();
}

/**
 * 💡 GUIA PARA ADICIONAR UM NOVO PROVEDOR DE IA (DEVELOPER EXTENSION GUIDE):
 *
 * Se você deseja adicionar suporte a um novo modelo/provedor de IA (ex: DeepSeek, Llama/Groq, Ollama local):
 *
 * 1. Crie o arquivo do provedor na pasta src/ai/ (ex: \`src/ai/deepseek.ts\`).
 * 2. Crie uma classe que implemente a interface \`AiProvider\` de \`./types.ts\`:
 * 
 *    \`\`\`typescript
 *    import axios from 'axios';
 *    import { AiProvider, AiProviderParams, GenerationResult, SYSTEM_INSTRUCTIONS_TEMPLATE, USER_PROMPT_TEMPLATE, parseResponse } from './types.js';
 *
 *    export class DeepSeekProvider implements AiProvider {
 *      async generatePost(params: AiProviderParams): Promise<GenerationResult> {
 *        const systemPrompt = SYSTEM_INSTRUCTIONS_TEMPLATE(params.projectName, params.tone);
 *        const userPrompt = USER_PROMPT_TEMPLATE(params.version, params.changelog);
 *        const modelName = params.modelName || 'deepseek-chat';
 *
 *        try {
 *          const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
 *            model: modelName,
 *            messages: [
 *              { role: 'system', content: systemPrompt },
 *              { role: 'user', content: userPrompt }
 *            ]
 *          }, {
 *            headers: { 'Authorization': \`Bearer \${params.apiKey}\` }
 *          });
 *
 *          const text = response.data?.choices?.[0]?.message?.content?.trim() || '';
 *          return parseResponse(text);
 *        } catch (error: any) {
 *          throw new Error(\`Erro na geração com DeepSeek: \${error.message}\`);
 *        }
 *      }
 *    }
 *    \`\`\`
 *
 * 3. Importe a sua nova classe aqui neste arquivo (\`src/ai/index.ts\`).
 * 4. Adicione ela no registro \`providers\` (ex: \`deepseek: DeepSeekProvider\`).
 * 5. Agora, o usuário final pode simplesmente definir o input \`ai_provider: 'deepseek'\`!
 */
export const DEVELOPER_GUIDE = true;
