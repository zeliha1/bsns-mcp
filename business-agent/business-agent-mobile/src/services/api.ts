import 'react-native-url-polyfill/auto';

export interface AnalysisRequest {
  url: string;
  maxSteps?: number;
}

export interface AnalysisResponse {
  text: string;
  steps?: Array<{
    toolCalls?: Array<{
      toolName: string;
      args: any;
    }>;
  }>;
}

export interface AnalysisResult {
  id: string;
  url: string;
  summary: string;
  timestamp: number;
  status: 'success' | 'error' | 'pending';
  error?: string;
  tools?: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    // Mastra backend URL - mobil cihazlar için IP adresi kullanın
    // Development için bilgisayarınızın IP adresini kullanın
    // Production'da gerçek domain kullanın
    this.baseUrl = __DEV__
      ? 'http://10.56.178.77:4111'  // Development - IP adresinizi buraya yazın
      : 'https://your-production-url.com'; // Production
  }

  async analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 saniye timeout

      const response = await fetch(`${this.baseUrl}/api/agents/businessAgent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Bu makaleyi analiz et ve özetle: ${request.url}`
            }
          ],
          maxSteps: request.maxSteps || 5
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Makale analiz edilirken bir hata oluştu'
      );
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout

      const response = await fetch(`${this.baseUrl}/api/agents`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // URL validation
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Extract domain from URL
  extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'Bilinmeyen';
    }
  }

  // Format analysis result for storage
  formatAnalysisResult(
    url: string,
    response: AnalysisResponse,
    error?: string
  ): AnalysisResult {
    return {
      id: Date.now().toString(),
      url,
      summary: error ? '' : response.text,
      timestamp: Date.now(),
      status: error ? 'error' : 'success',
      error,
      tools: response.steps?.flatMap(step =>
        step.toolCalls?.map(tool => tool.toolName) || []
      ).filter((tool, index, arr) => arr.indexOf(tool) === index),
    };
  }
}

export const apiService = new ApiService();
