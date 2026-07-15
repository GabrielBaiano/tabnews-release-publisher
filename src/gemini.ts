import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerationResult {
  title: string;
  body: string;
}

export async function generateTabNewsPost(params: {
  apiKey: string;
  changelog: string;
  projectName: string;
  version: string;
  tone: 'propaganda' | 'divulgacao' | 'update' | 'auto';
}): Promise<GenerationResult> {
  const { apiKey, changelog, projectName, version, tone } = params;

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-flash which is fast and supports Portuguese translation and tone adjustments perfectly
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemInstructions = `
Você é o robô de relações públicas oficial e inteligência de marketing do projeto open source "${projectName}".
Sua tarefa é ler um changelog/notas de lançamento em inglês e escrever um post de anúncio em português brasileiro para a plataforma TabNews (tabnews.com.br).

O TabNews é um fórum de tecnologia para desenvolvedores que valoriza conteúdo de valor, troca de feedbacks e discussões construtivas. O tom das postagens deve ser adequado ao tipo de lançamento, atraente, livre de traduções literais robóticas e adaptado para a cultura de tecnologia do Brasil.

Você deve produzir duas informações:
1. O Título do post (chamativo, condizente com o tom escolhido).
2. O Corpo do post em Markdown, bem estruturado, contendo as mudanças explicadas de forma fluida, e um fechamento incentivando a comunidade a interagir/dar feedback.

O tom a ser usado é: "${tone}".

Regras de tons:
- "propaganda": Ideal para versões beta, chamadas de teste ou solicitações de feedback. Tom entusiasmado, persuasivo, focado em fazer o leitor testar o projeto (ex: "[vX.Y.Z] BETA TEST OPEN! Venha testar e dar seu feedback!").
- "divulgacao": Ideal para grandes novidades ou lançamento inicial. Focado em contar a história do projeto, o propósito, o que ele resolve e como começar.
- "update": Tom mais técnico porém amigável, direto ao ponto, organizando as novidades em tópicos claros (Novidades, Correções, Melhorias) e agradecendo os contribuidores nominalmente se houver menção no changelog.
- "auto": Analise as notas de lançamento e o título do release. Se falar de "beta", "alpha", "test", "feedback", use o tom "propaganda". Se for um release principal inicial (como v1.0.0, v2.0.0 ou sem muito histórico prévio), use "divulgacao". Caso contrário, use "update".

Formate a resposta exatamente neste formato, separando o Título do Corpo com a linha especial de separação "===TITLE_BODY_SEPARATOR===":

[Título do Post Aqui]
===TITLE_BODY_SEPARATOR===
[Corpo do Post em Markdown Aqui]
`;

  const prompt = `
Aqui estão as informações do release atual:
- Projeto: ${projectName}
- Versão: ${version}
- Notas de Lançamento (Changelog) originais em inglês:
"""
${changelog}
"""

Por favor, faça a tradução e adaptação de tom agora.
`;

  try {
    const result = await model.generateContent([systemInstructions, prompt]);
    const responseText = result.response.text().trim();

    const parts = responseText.split('===TITLE_BODY_SEPARATOR===');
    if (parts.length < 2) {
      // Fallback if the separator was not outputted correctly
      const lines = responseText.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      return { title, body };
    }

    const title = parts[0].trim().replace(/^#+\s*/, ''); // strip any markdown headers from the title
    const body = parts[1].trim();

    return { title, body };
  } catch (error: any) {
    throw new Error(`Erro ao gerar conteúdo via Gemini API: ${error.message}`);
  }
}
