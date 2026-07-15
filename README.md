<p align="center">
  <img src="https://img.icons8.com/color/120/000000/bot.png" alt="Logo do TabNews Release Publisher" width="120"/>
</p>

<h1 align="center">TabNews Release Publisher</h1>

<p align="center">
  <strong>Publique atualizações de versão automaticamente no TabNews com tradução e tom de voz personalizados via API do Gemini.</strong><br>
  <em>Promova, anuncie e documente seus lançamentos de forma automatizada na maior comunidade de desenvolvedores do Brasil.</em>
</p>

<p align="center">
  <a href="README.en.md"><img src="https://img.shields.io/badge/Language-English-blue.svg" alt="English Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher"><img src="https://img.shields.io/badge/GitHub-Actions-orange.svg?logo=github" alt="GitHub Actions"></a>
  <a href="https://www.npmjs.com/package/tabnews-release-publisher"><img src="https://img.shields.io/npm/v/tabnews-release-publisher.svg?color=red" alt="NPM Version"></a>
  <a href="https://github.com/GabrielBaiano/tabnews-release-publisher/blob/main/LICENSE"><img src="https://img.shields.io/github/license/GabrielBaiano/tabnews-release-publisher.svg" alt="Licença"></a>
</p>

---

## Tabela de Conteúdos
- [Introdução](#introdução)
- [Como Funciona](#como-funciona)
- [Como Usar (Início Rápido)](#como-usar-início-rápido)
  - [Integração com GitHub Actions](#integração-com-github-actions)
  - [Integração com CLI / NPM](#integração-com-cli--npm)
- [Configurações e Parâmetros](#configurações-e-parâmetros)
- [Tons de Voz Disponíveis](#tons-de-voz-disponíveis)
- [Configuração de Desenvolvimento](#configuração-de-desenvolvimento)
- [Licença](#licença)

---

## Introdução
O **TabNews Release Publisher** é uma ferramenta de código aberto projetada para automatizar o processo de publicação de anúncios de novas versões de software no [TabNews](https://www.tabnews.com.br).

Escrever notas de lançamento (changelogs) em inglês é o padrão para projetos Open Source globais, mas compartilhar essas novidades em fóruns de tecnologia lusófonos como o TabNews pode consumir tempo. Esta ferramenta utiliza a **API do Gemini** para traduzir e reescrever automaticamente seu changelog em um português brasileiro natural e engajante, usando diferentes tons de voz de acordo com seus objetivos (como promover testes beta ou detalhar atualizações técnicas).

---

## Como Funciona
```
[GitHub Release (Inglês)] ──> [API do Gemini (Traduz e Adapta o Tom)] ──> [API do TabNews (Publica em PT-BR)]
```

Ao publicar um novo release no GitHub, a ferramenta lê o título e a descrição. Em seguida, solicita ao Gemini que traduza o changelog e adapte o texto para o português, aplicando o tom de voz escolhido (como um pitch de marketing entusiasta para betas ou listas estruturadas para updates técnicos). Por fim, autentica-se no TabNews e publica o conteúdo.

---

## Como Usar (Início Rápido)

### Integração com GitHub Actions
Para anunciar novas versões automaticamente assim que forem publicadas, adicione o seguinte fluxo de trabalho em `.github/workflows/tabnews-announcement.yml`:

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
          gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
          tone: 'auto'
```

#### 🔑 Configurando as Secrets no GitHub
Vá em **Settings > Secrets and variables > Actions > New repository secret** e adicione:
1. `TABNEWS_EMAIL`: O e-mail da sua conta no TabNews.
2. `TABNEWS_PASSWORD`: A senha da sua conta no TabNews.
3. `GEMINI_API_KEY`: Sua chave de API do Gemini (obtenha gratuitamente em [Google AI Studio](https://aistudio.google.com)).

### Integração com CLI / NPM
Você pode rodar o publicador localmente ou em outras esteiras de CI/CD (como GitLab CI ou Bitbucket) usando `npx`:

```bash
npx tabnews-release-publisher \
  --email "seu-email@provedor.com" \
  --password "sua-senha" \
  --gemini-api-key "SUA_API_KEY_DO_GEMINI" \
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
| `gemini_api_key` | `--gemini-api-key` | Chave de API do Google Gemini | **Sim** | - |
| `project_name` | `--project` | Nome do projeto a ser exibido | Não | Nome do Repositório |
| `tone` | `--tone` | Tom do post: `propaganda`, `divulgacao`, `update`, `auto` | Não | `auto` |
| `version` | `--version-name` | Versão customizada (tag) | Não | Tag do release do GitHub |
| `changelog` | `--changelog` | Changelog/Notas em inglês a serem traduzidas | Não | Descrição do release |
| `source_url` | `--source-url` | Link original do repositório ou site | Não | URL do repositório |

---

## Tons de Voz Disponíveis

- **`propaganda` (Teste Beta / Pitch):** Ativo, voltado para conversão, convidando desenvolvedores a testarem, baixarem e deixarem feedbacks (ex: "[v0.1.0] BETA TEST OPEN!").
- **`divulgacao` (Lançamento Geral):** Foca na história por trás do projeto, por que ele foi construído, os problemas que resolve e como dar os primeiros passos.
- **`update` (Notas Técnicas):** Direto, estruturado, organizando melhorias e correções em tópicos claros para atualizações incrementais.
- **`auto` (Detecção Automática):** Busca termos como "beta", "alpha", "test" ou "feedback" para usar `propaganda`, usa `divulgacao` para marcos v1.0.0 e utiliza `update` para versões padrão.

---

## Configuração de Desenvolvimento

Caso queira contribuir com o projeto:

1. Clone o repositório:
   ```bash
   git clone https://github.com/GabrielBaiano/tabnews-release-publisher.git
   cd tabnews-release-publisher
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o `.env.example` para `.env` e preencha suas credenciais de teste:
   ```bash
   cp .env.example .env
   ```
4. Compile o projeto:
   ```bash
   npm run build
   ```
5. Teste localmente:
   ```bash
   node dist/index.js --project "Projeto Teste" --changelog "Added cool stuff"
   ```

---

## Licença
Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
