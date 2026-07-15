<p align="center">
  <img src="https://img.icons8.com/color/120/000000/bot.png" alt="Logo do TabNews Release Publisher" width="120"/>
</p>

<h1 align="center">TabNews Release Publisher</h1>

<p align="center">
  <strong>Publique atualizações de versão do GitHub no TabNews automaticamente com tradução e tom de voz personalizados usando as APIs do Gemini, OpenAI ou Claude.</strong><br>
  <em>Promova, anuncie e documente seus lançamentos de forma automatizada na maior comunidade de desenvolvedores do Brasil.</em>
</p>

<p align="center">
  <a href="README.en.md"><img src="https://img.shields.io/badge/Language-English-blue.svg" alt="English Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher"><img src="https://img.shields.io/badge/GitHub-Actions-orange.svg?logo=github" alt="GitHub Actions"></a>
  <a href="https://www.npmjs.com/package/tabnews-release-publisher"><img src="https://img.shields.io/npm/v/tabnews-release-publisher.svg?color=red" alt="NPM Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GabrielBaiano/tabnews-release-publisher.svg" alt="Licença"></a>
  <a href="https://buymeacoffee.com/gabrielngal"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Apoiar-yellow.svg" alt="Buy Me A Coffee"></a>
</p>

---

## Tabela de Conteúdos
- [Introdução](#introdução)
- [Como Funciona](#como-funciona)
- [Como Usar (Início Rápido)](#como-usar-início-rápido)
  - [Integração com GitHub Actions](#integração-com-github-actions)
  - [Integração com CLI / NPM](#integração-com-cli--npm)
- [Configurações e Parâmetros](#configurações-e-parâmetros)
- [Provedores de IA Suportados](#provedores-de-ia-suportados)
- [Tons de Voz Disponíveis](#tons-de-voz-disponíveis)
- [Desenvolvimento & Extensibilidade](#desenvolvimento--extensibilidade)
- [Apoie o Projeto](#apoie-o-projeto)
- [Licença](#licença)

---

## Introdução
O **TabNews Release Publisher** é uma ferramenta de código aberto projetada para automatizar o processo de publicação de anúncios de novas versões de software no [TabNews](https://www.tabnews.com.br).

Escrever notas de lançamento (changelogs) em inglês é o padrão para projetos Open Source globais, mas compartilhar essas novidades em fóruns de tecnologia lusófonos como o TabNews pode consumir tempo. Esta ferramenta utiliza a **API de IA** de sua escolha para traduzir e reescrever automaticamente seu changelog em um português brasileiro natural e engajante.

---

## Como Funciona
```
[GitHub Release (Inglês)] ──> [IA (Gemini/OpenAI/Claude)] ──> [API do TabNews (Publica em PT-BR)]
```

Ao publicar um novo release no GitHub, a ferramenta lê o título e a descrição. Em seguida, solicita à IA selecionada que traduza o changelog e adapte o texto para o português, aplicando o tom de voz escolhido. Por fim, autentica-se no TabNews e publica o conteúdo.

---

## Como Usar (Início Rápido)

### Integração com GitHub Actions
Adicione o seguinte fluxo de trabalho em `.github/workflows/tabnews-announcement.yml`:

```yaml
name: Publicar no TabNews

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Publicar no TabNews
        uses: GabrielBaiano/tabnews-release-publisher@v1
        with:
          tabnews_email: ${{ secrets.TABNEWS_EMAIL }}
          tabnews_password: ${{ secrets.TABNEWS_PASSWORD }}
          ai_provider: 'gemini' # Escolha: gemini, openai ou anthropic
          gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
          tone: 'auto'
```

#### 🔑 Configurando as Secrets no GitHub
Vá em **Settings > Secrets and variables > Actions > New repository secret** e adicione:
1. `TABNEWS_EMAIL`: O e-mail da sua conta no TabNews.
2. `TABNEWS_PASSWORD`: A senha da sua conta no TabNews.
3. `GEMINI_API_KEY`: Sua chave de API do Gemini (Google AI Studio).
4. `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY` (se utilizar outros provedores).

### Integração com CLI / NPM
Você pode rodar o publicador localmente ou em outras esteiras de CI/CD (como GitLab CI ou Bitbucket) usando `npx`:

```bash
npx tabnews-release-publisher \
  --email "seu-email@provedor.com" \
  --password "sua-senha" \
  --ai-provider "openai" \
  --ai-key "SUA_API_KEY_DO_OPENAI" \
  --project "Nome do Meu Projeto" \
  --version-name "v1.0.0" \
  --changelog "Fixed memory leaks and added automated discord notification webhook." \
  --tone "divulgacao"
```

---

## Configurações e Parâmetros

| Entrada (Actions) | Opção (CLI) | Descrição | Obrigatório | Padrão |
| :--- | :--- | :--- | :--- | :--- |
| `tabnews_email` | `--email` | E-mail da conta do TabNews | **Sim** | - |
| `tabnews_password` | `--password` | Senha da conta do TabNews | **Sim** | - |
| `ai_provider` | `--ai-provider` | Escolha da IA: `gemini`, `openai`, `anthropic` | Não | `gemini` |
| `ai_api_key` | `--ai-key` | Chave de API da IA escolhida | **Sim** | - |
| `model_name` | `--model-name` | Modelo customizado da IA (ex: gpt-4o, claude-3-5-sonnet) | Não | Padrão da IA |
| `project_name` | `--project` | Nome do projeto a ser exibido | Não | Nome do Repositório |
| `tone` | `--tone` | Tom do post: `propaganda`, `divulgacao`, `update`, `auto` | Não | `auto` |
| `version` | `--version-name` | Versão customizada (tag) | Não | Tag do release do GitHub |
| `changelog` | `--changelog` | Changelog/Notas em inglês a serem traduzidas | Não | Descrição do release |
| `source_url` | `--source-url` | Link original do repositório ou site | Não | URL do repositório |

---

## Provedores de IA Suportados

- **Google Gemini** (`gemini`): Utiliza por padrão o modelo `gemini-2.5-flash`.
- **OpenAI / ChatGPT** (`openai`): Utiliza por padrão o modelo `gpt-4o-mini`.
- **Anthropic / Claude** (`anthropic`): Utiliza por padrão o modelo `claude-3-5-sonnet-20240620`.

---

## Tons de Voz Disponíveis

- **`propaganda` (Teste Beta / Pitch):** Ativo, voltado para conversão, convidando desenvolvedores a testarem e deixarem feedbacks (ex: "[v0.1.0] BETA TEST OPEN!").
- **`divulgacao` (Lançamento Geral):** Foca na história por trás do projeto, por que ele foi construído, os problemas que resolve e como começar.
- **`update` (Notas Técnicas):** Direto, estruturado, organizando melhorias e correções em tópicos claros.
- **`auto` (Detecção Automática):** Busca termos como "beta", "test" para usar `propaganda`, usa `divulgacao` para marcos v1.0.0 e utiliza `update` para versões padrão.

---

## Desenvolvimento & Extensibilidade

Se você quiser contribuir ou adicionar um novo provedor de IA (como DeepSeek, Llama/Groq, Ollama local):

1. **Guia de Extensão:** No arquivo [src/ai/index.ts](file:///home/gabrielgama/.gemini/antigravity/scratch/tabnews-release-publisher/src/ai/index.ts) você encontrará um guia detalhado em forma de comentário explicando como implementar a interface `AiProvider` e registrar seu novo provedor de IA no ecossistema do robô.
2. **Setup Local:**
   ```bash
   git clone https://github.com/GabrielBaiano/tabnews-release-publisher.git
   cd tabnews-release-publisher
   npm install
   cp .env.example .env
   npm run build
   node dist/index.js --project "Projeto Teste" --changelog "Added cool stuff"
   ```

---

## Apoie o Projeto

Gostou do robô? Considere apoiar o criador para ajudar a manter o projeto ativo e receber melhorias!

<a href="https://buymeacoffee.com/gabrielngal"><img src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg" alt="Buy Me A Coffee" width="160" style="display:none;"/><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Apoiar no Buy Me A Coffee" width="200" height="50"></a>

---

## Licença
Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
