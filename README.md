<p align="center">
  <img src="https://img.icons8.com/color/120/000000/bot.png" alt="TabNews Release Publisher Logo" width="120"/>
</p>

<h1 align="center">TabNews Release Publisher</h1>

<p align="center">
  <strong>Publish release updates automatically to TabNews with automatic translation and tone customization using Gemini API.</strong><br>
  <em>Promote, announce, and document your releases automatically in Brazil's premier developer community.</em>
</p>

<p align="center">
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher"><img src="https://img.shields.io/badge/GitHub-Actions-orange.svg?logo=github" alt="GitHub Actions"></a>
  <a href="https://www.npmjs.com/package/tabnews-release-publisher"><img src="https://img.shields.io/npm/v/tabnews-release-publisher.svg?color=red" alt="NPM Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GabrielBaiano/tabnews-release-publisher.svg" alt="License"></a>
</p>

---

## Table of Contents
- [Introduction](#introduction)
- [How It Works](#how-it-works)
- [How to Use (Quick Start)](#how-to-use-quick-start)
  - [GitHub Actions Integration](#github-actions-integration)
  - [CLI / NPM Integration](#cli--npm-integration)
- [Configuration and Parameters](#configuration-and-parameters)
- [Available Tones](#available-tones)
- [Developer Setup](#developer-setup)
- [License](#license)

---

## Introduction
**TabNews Release Publisher** is an open-source tool designed to automate the process of publishing software release announcements to [TabNews](https://www.tabnews.com.br). 

Writing release logs in English is standard for open source projects, but sharing them on Portuguese-speaking developer forums like TabNews can be time-consuming. This tool uses **Gemini API** to automatically translate and rewrite your release logs into engaging, platform-appropriate Portuguese, using different tones of voice based on your goals (e.g. promoting beta tests or detailing technical updates).

---

## How It Works
```
[GitHub Release (English)] ──> [Gemini API (Translates & Adapts Tone)] ──> [TabNews API (Publishes in PT-BR)]
```

When you publish a new release, the tool reads the description and version. It then requests Gemini to translate the changelog and rewrite the post in Portuguese, applying a customized tone of voice (e.g. enthusiastic marketing for a beta launch, or structured lists for a technical update). Finally, it logs into TabNews and publishes the post.

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
          gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
          tone: 'auto'
```

#### 🔑 Secret Configurations
Go to **Settings > Secrets and variables > Actions > New repository secret** and add:
1. `TABNEWS_EMAIL`: The email of your TabNews account.
2. `TABNEWS_PASSWORD`: The password of your TabNews account.
3. `GEMINI_API_KEY`: Your Gemini API key (get it for free at [Google AI Studio](https://aistudio.google.com)).

### CLI / NPM Integration
You can run the publisher locally or inside other CI/CD pipelines (like GitLab CI or Bitbucket Pipelines) using `npx`:

```bash
npx tabnews-release-publisher \
  --email "your-email@provider.com" \
  --password "your-password" \
  --gemini-api-key "YOUR_GEMINI_API_KEY" \
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
| `gemini_api_key` | `--gemini-api-key` | Google Gemini API Key | **Yes** | - |
| `project_name` | `--project` | Name of your project to display | No | Repository Name |
| `tone` | `--tone` | Tone of post: `propaganda`, `divulgacao`, `update`, `auto` | No | `auto` |
| `version` | `--version-name` | Custom version string | No | Release tag |
| `changelog` | `--changelog` | Markdown changelog text in English | No | Release description |
| `source_url` | `--source-url` | Source code link or homepage | No | Repository URL |

---

## Available Tones

- **`propaganda` (Beta Test / Pitch):** Active, conversion-oriented, inviting users to test, download, and give feedback (e.g. "[v0.1.0] BETA TEST OPEN!").
- **`divulgacao` (Launch / General):** Focuses on the story behind the project, why you built it, the problems it solves, and how developers can get started.
- **`update` (Technical Release):** Direct, structured changelog categorized into features, fixes, and performance improvements.
- **`auto` (Automatic Detection):** Detects terms like "beta", "alpha", "test", or "feedback" to switch to `propaganda`, uses `divulgacao` for v1.0.0 milestones, and falls back to `update` for standard versions.

---

## Developer Setup

If you want to contribute to this project:

1. Clone the repository:
   ```bash
   git clone https://github.com/GabrielBaiano/tabnews-release-publisher.git
   cd tabnews-release-publisher
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your test credentials:
   ```bash
   cp .env.example .env
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Test locally:
   ```bash
   node dist/index.js --project "Test Project" --changelog "Added cool stuff"
   ```

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
