import axios from 'axios';

interface TabNewsSession {
  id: string;
  token?: string;
}

interface TabNewsPost {
  title: string;
  body: string;
  source_url?: string;
  status: 'published';
}

export class TabNewsClient {
  private baseUrl = 'https://www.tabnews.com.br/api/v1';
  private sessionId: string | null = null;

  constructor(private email?: string, private password?: string) {}

  /**
   * Authenticate and retrieve the session ID
   */
  async login(): Promise<string> {
    if (!this.email || !this.password) {
      throw new Error('E-mail e senha do TabNews são obrigatórios para autenticação.');
    }

    try {
      const response = await axios.post<TabNewsSession>(`${this.baseUrl}/sessions`, {
        email: this.email,
        password: this.password,
      });

      // The session ID is typically the 'id' field returned in the response body.
      const sessionId = response.data.id || response.data.token;
      if (!sessionId) {
        throw new Error('Não foi possível obter o ID de sessão na resposta da API.');
      }

      this.sessionId = sessionId;
      return sessionId;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(`Erro na autenticação com TabNews: ${errorMsg}`);
    }
  }

  /**
   * Publish content to TabNews
   */
  async publish(post: Omit<TabNewsPost, 'status'>): Promise<any> {
    if (!this.sessionId) {
      await this.login();
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/contents`,
        {
          ...post,
          status: 'published',
        },
        {
          headers: {
            // TabNews uses session_id in the cookies for authenticated requests
            Cookie: `session_id=${this.sessionId}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(`Erro ao publicar no TabNews: ${errorMsg}`);
    }
  }
}
