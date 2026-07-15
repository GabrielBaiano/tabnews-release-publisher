<p align="center">
  <img src="https://img.icons8.com/color/120/000000/bot.png" alt="TabNews Release Publisher Logo" width="120"/>
</p>

<h1 align="center">TabNews Release Publisher</h1>

<p align="center">
  <strong>Publish release updates automatically to TabNews with automatic translation and tone customization using Gemini, OpenAI or Claude APIs.</strong><br>
  <em>Promote, announce, and document your releases automatically in Brazil's premier developer community.</em>
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/Idioma-Portugu%C3%AAs-green.svg" alt="Português"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher"><img src="https://img.shields.io/badge/GitHub-Actions-orange.svg?logo=github" alt="GitHub Actions"></a>
  <a href="https://www.npmjs.com/package/tabnews-release-publisher"><img src="https://img.shields.io/npm/v/tabnews-release-publisher.svg?color=red" alt="NPM Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GabrielBaiano/tabnews-release-publisher.svg" alt="License"></a>
  <a href="https://buymeacoffee.com/gabrielngal"><img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg" alt="Buy Me A Coffee"></a>
</p>

---

## Table of Contents
- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [How to Use (Quick Start)](#how-to-use-quick-start)
  - [GitHub Actions Integration](#github-actions-integration)
  - [CLI / NPM Integration](#cli--npm-integration)
- [Configuration and Parameters](#configuration-and-parameters)
- [Supported AI Providers](#supported-ai-providers)
- [Available Tones](#available-tones)
- [Development & Extensibility](#development--extensibility)
- [Support the Project](#support-the-project)
- [License](#license)

---

## Introduction
**TabNews Release Publisher** is an open-source tool designed to automate the process of publishing software release announcements to [TabNews](https://www.tabnews.com.br). 

Writing release logs in English is standard for open source projects, but sharing them on Portuguese-speaking developer forums like TabNews can be time-consuming. This tool uses **your choice of AI API** to automatically translate and rewrite your release logs into engaging, platform-appropriate Portuguese.

---

## How It Works
```
[GitHub Release (English)] ──> [AI (Gemini/OpenAI/Claude)] ──> [TabNews API (Publishes in PT-BR)]
```

When you publish a new release, the tool reads the description and version. It then requests the selected AI to translate the changelog and rewrite the post in Portuguese, applying a customized tone of voice. Finally, it logs into TabNews and publishes the post.

---

## How to Use (Quick Start)

### GitHub Actions Integration
To automatically announce new versions as soon as they are published, add the following workflow to `.github/workflows/tabnews-announcement.yml`:

```yaml
name: Publish to TabNews

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Publish to TabNews
        uses: GabrielBaiano/tabnews-release-publisher@v1
        with:
          tabnews_email: ${{ secrets.TABNEWS_EMAIL }}
          tabnews_password: ${{ secrets.TABNEWS_PASSWORD }}
          ai_provider: 'gemini' # Choose: gemini, openai or anthropic
          gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
          tone: 'auto'
```

#### 🔑 Secret Configurations
Go to **Settings > Secrets and variables > Actions > New repository secret** and add:
1. `TABNEWS_EMAIL`: The email of your TabNews account.
2. `TABNEWS_PASSWORD`: The password of your TabNews account.
3. `GEMINI_API_KEY`: Your Gemini API key.
4. `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (if using other providers).

### CLI / NPM Integration
You can run the publisher locally or inside other CI/CD pipelines (like GitLab CI or Bitbucket Pipelines) using `npx`:

```bash
npx tabnews-release-publisher \
  --email "your-email@provider.com" \
  --password "your-password" \
  --ai-provider "openai" \
  --ai-key "YOUR_OPENAI_API_KEY" \
  --project "My Project Name" \
  --version-name "v1.0.0" \
  --changelog "Fixed memory leaks and added automated discord notification webhook." \
  --tone "divulgacao"
```

---

## Configuration and Parameters

| Input (Actions) | CLI Flag | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| `tabnews_email` | `--email` | E-mail for your TabNews account | **Yes** | - |
| `tabnews_password` | `--password` | Password for your TabNews account | **Yes** | - |
| `ai_provider` | `--ai-provider` | AI choice: `gemini`, `openai`, `anthropic` | No | `gemini` |
| `ai_api_key` | `--ai-key` | AI API Key for your choice | **Yes** | - |
| `model_name` | `--model-name` | Custom model name (e.g. gpt-4o, claude-3-5-sonnet) | No | AI Default model |
| `project_name` | `--project` | Name of your project to display | No | Repository Name |
| `tone` | `--tone` | Tone of post: `propaganda`, `divulgacao`, `update`, `auto` | No | `auto` |
| `version` | `--version-name` | Custom version string | No | Release tag |
| `changelog` | `--changelog` | Markdown changelog text in English | No | Release description |
| `source_url` | `--source-url` | Source code link or homepage | No | Repository URL |

---

## Supported AI Providers

- **Google Gemini** (`gemini`): Uses `gemini-2.5-flash` by default.
- **OpenAI / ChatGPT** (`openai`): Uses `gpt-4o-mini` by default.
- **Anthropic / Claude** (`anthropic`): Uses `claude-3-5-sonnet-20240620` by default.

---

## Available Tones

- **`propaganda` (Beta Test / Pitch):** Active, conversion-oriented, inviting users to test, download, and give feedback (e.g. "[v0.1.0] BETA TEST OPEN!").
- **`divulgacao` (Launch / General):** Focuses on the story behind the project, why you built it, the problems it solves, and how developers can get started.
- **`update` (Technical Release):** Direct, structured changelog categorized into features, fixes, and performance improvements.
- **`auto` (Automatic Detection):** Detects terms like "beta", "alpha", "test", or "feedback" to switch to `propaganda`, uses `divulgacao` for v1.0.0 milestones, and falls back to `update` for standard versions.

---

## Development & Extensibility

If you want to contribute or add a new AI provider (like DeepSeek, Llama/Groq, local Ollama):

1. **Extension Guide:** Look at [src/ai/index.ts](file:///home/gabrielgama/.gemini/antigravity/scratch/tabnews-release-publisher/src/ai/index.ts) for a detailed comment guide on implementing the `AiProvider` interface and registering your new model.
2. **Local Setup:**
   ```bash
   git clone https://github.com/GabrielBaiano/tabnews-release-publisher.git
   cd tabnews-release-publisher
   npm install
   cp .env.example .env
   npm run build
   node dist/index.js --project "Test Project" --changelog "Added cool stuff"
   ```

---

## Support the Project

If you find this project useful, please consider supporting the creator to help maintain and improve it!

<a href="https://buymeacoffee.com/gabrielngal"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="200" height="50"></a>

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
