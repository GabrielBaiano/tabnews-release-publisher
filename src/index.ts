#!/usr/bin/env node
import * as core from '@actions/core';
import * as github from '@actions/github';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { getAiProvider } from './ai/index.js';
import { TabNewsClient } from './tabnews.js';

// Load local .env file for local testing
dotenv.config();

interface Config {
  tabnewsEmail: string;
  tabnewsPassword: string;
  aiProvider: string;
  aiApiKey: string;
  modelName?: string;
  projectName: string;
  version: string;
  changelog: string;
  tone: 'propaganda' | 'divulgacao' | 'update' | 'auto';
  sourceUrl?: string;
}

/**
 * Runs the application in GitHub Actions environment
 */
async function runAction(): Promise<Config> {
  core.info('Executando no ambiente do GitHub Actions...');

  const tabnewsEmail = core.getInput('tabnews_email') || process.env.TABNEWS_EMAIL || '';
  const tabnewsPassword = core.getInput('tabnews_password') || process.env.TABNEWS_PASSWORD || '';
  
  // Try getting provider-specific keys, fallback to generic ai_api_key or GEMINI_API_KEY / OPENAI_API_KEY
  const aiProvider = core.getInput('ai_provider') || process.env.AI_PROVIDER || 'gemini';
  
  let aiApiKey = core.getInput('ai_api_key') || process.env.AI_API_KEY || '';
  if (!aiApiKey) {
    if (aiProvider.toLowerCase() === 'openai') {
      aiApiKey = core.getInput('openai_api_key') || process.env.OPENAI_API_KEY || '';
    } else if (aiProvider.toLowerCase() === 'anthropic') {
      aiApiKey = core.getInput('anthropic_api_key') || process.env.ANTHROPIC_API_KEY || '';
    } else {
      aiApiKey = core.getInput('gemini_api_key') || process.env.GEMINI_API_KEY || '';
    }
  }

  const modelName = core.getInput('model_name') || process.env.MODEL_NAME || undefined;
  const toneInput = (core.getInput('tone') || 'auto') as any;

  // Extract metadata from the GitHub Actions context
  const context = github.context;
  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const defaultProjectName = repoName;

  const projectName = core.getInput('project_name') || defaultProjectName;
  const sourceUrl = core.getInput('source_url') || `https://github.com/${repoOwner}/${repoName}`;

  let version = core.getInput('version');
  let changelog = core.getInput('changelog');

  // If running in a release event, extract release details
  if (context.eventName === 'release') {
    const release = context.payload.release;
    if (release) {
      if (!version) version = release.tag_name;
      if (!changelog) changelog = release.body;
    }
  }

  // Fallbacks if not provided and not in a release event
  if (!version) {
    version = context.ref ? context.ref.replace('refs/tags/', '') : 'v1.0.0';
  }
  if (!changelog) {
    changelog = 'Release sem descrição detalhada.';
  }

  return {
    tabnewsEmail,
    tabnewsPassword,
    aiProvider,
    aiApiKey,
    modelName,
    projectName,
    version,
    changelog,
    tone: toneInput,
    sourceUrl,
  };
}

/**
 * Runs the application in CLI/local environment
 */
async function runCli(): Promise<Config> {
  const program = new Command();

  program
    .name('tabnews-release-publisher')
    .description('Publicador automático de releases no TabNews com auxílio de Inteligência Artificial (Gemini, OpenAI, Anthropic)')
    .option('--email <email>', 'E-mail da conta do TabNews', process.env.TABNEWS_EMAIL)
    .option('--password <password>', 'Senha do TabNews', process.env.TABNEWS_PASSWORD)
    .option('--ai-provider <provider>', 'Provedor de IA (gemini, openai, anthropic)', process.env.AI_PROVIDER || 'gemini')
    .option('--ai-key <key>', 'Chave de API do provedor de IA escolhido', process.env.AI_API_KEY)
    .option('--model-name <model>', 'Modelo customizado da IA (ex: gpt-4o, claude-3-5-sonnet)', process.env.MODEL_NAME)
    .option('--project <name>', 'Nome do projeto/produto', 'Meu Projeto')
    .option('--version-name <ver>', 'Versão do lançamento (ex: v1.0.0)', 'v1.0.0')
    .option('--changelog <text>', 'Notas de lançamento / Changelog em inglês')
    .option('--tone <tone>', 'Tom da postagem (propaganda, divulgacao, update, auto)', 'auto')
    .option('--source-url <url>', 'URL do repositório ou site original');

  program.parse(process.argv);
  const options = program.opts();

  if (!options.email || !options.password) {
    console.error('Erro: Credenciais do TabNews (--email e --password) são obrigatórias.');
    process.exit(1);
  }

  const provider = options.aiProvider.toLowerCase();
  
  // Key fallback checks
  let apiKey = options.aiKey;
  if (!apiKey) {
    if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY;
    else if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY;
    else apiKey = process.env.GEMINI_API_KEY;
  }

  if (!apiKey) {
    console.error(`Erro: A chave de API do provedor "${provider}" é obrigatória.`);
    process.exit(1);
  }

  if (!options.changelog) {
    console.error('Erro: O changelog (--changelog) é obrigatório no modo CLI.');
    process.exit(1);
  }

  return {
    tabnewsEmail: options.email,
    tabnewsPassword: options.password,
    aiProvider: options.aiProvider,
    aiApiKey: apiKey,
    modelName: options.modelName,
    projectName: options.project,
    version: options.versionName,
    changelog: options.changelog,
    tone: options.tone,
    sourceUrl: options.sourceUrl,
  };
}

async function main() {
  try {
    const isGitHubAction = process.env.GITHUB_ACTIONS === 'true';
    const config = isGitHubAction ? await runAction() : await runCli();

    // Validating basic credentials
    if (!config.tabnewsEmail || !config.tabnewsPassword) {
      throw new Error('E-mail e senha do TabNews são obrigatórios.');
    }
    if (!config.aiApiKey) {
      throw new Error(`A chave de API para o provedor "${config.aiProvider}" é obrigatória.`);
    }

    const logInfo = isGitHubAction ? core.info : console.log;
    const logSuccess = isGitHubAction ? core.info : console.log;

    logInfo(`Gerando post do TabNews via Provedor: ${config.aiProvider} (${config.modelName || 'padrão'})...`);
    logInfo(`Projeto: ${config.projectName} ${config.version}`);
    logInfo(`Tom selecionado: ${config.tone}`);

    // 1. Instantiate correct AI Provider and generate the post
    const provider = getAiProvider(config.aiProvider);
    const generatedPost = await provider.generatePost({
      apiKey: config.aiApiKey,
      changelog: config.changelog,
      projectName: config.projectName,
      version: config.version,
      tone: config.tone,
      modelName: config.modelName,
    });

    logInfo(`Post gerado com sucesso!`);
    logInfo(`Título: "${generatedPost.title}"`);

    // Append automated bot footer at the end of the post body
    const botFooter = `\n\n---\n\n*Este post foi gerado de forma automatizada por um [robô contribuidor](https://github.com/GabrielBaiano/tabnews-release-publisher) que traduz e compartilha lançamentos importantes no TabNews.*`;
    const finalBody = generatedPost.body + botFooter;

    // 2. Publish to TabNews
    logInfo('Publicando no TabNews...');
    const tabnews = new TabNewsClient(config.tabnewsEmail, config.tabnewsPassword);
    const publishResult = await tabnews.publish({
      title: generatedPost.title,
      body: finalBody,
      source_url: config.sourceUrl,
    });

    logSuccess(`Sucesso! Post publicado no TabNews.`);
    if (publishResult && publishResult.slug) {
      const postUrl = `https://www.tabnews.com.br/${publishResult.owner_username}/${publishResult.slug}`;
      logSuccess(`URL do post: ${postUrl}`);
      if (isGitHubAction) {
        core.setOutput('post_url', postUrl);
      }
    }
  } catch (error: any) {
    if (process.env.GITHUB_ACTIONS === 'true') {
      core.setFailed(error.message);
    } else {
      console.error('Erro de Execução:', error.message);
      process.exit(1);
    }
  }
}

main();
