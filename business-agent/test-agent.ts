import 'dotenv/config';
import { businessAgent } from './src/mastra/agents/businessAgent';
import { MCPClient } from '@mastra/mcp';

async function testBusinessAgent() {
  try {
    console.log('🚀 Business Agent Test Başlatılıyor...\n');

    // MCP Client configuration for our business article summarizer
    const mcpClient = new MCPClient({
      servers: {
        businessSummarizer: {
          url: new URL('https://server.smithery.ai/@zeliha1/bsns-mcp/mcp?api_key=6134e80e-8e3e-4eb3-8482-ed8542124c32'),
        },
      },
    });

    console.log('🔗 MCP Client bağlantısı kuruluyor...\n');

    // Get toolsets dynamically
    const toolsets = await mcpClient.getToolsets();
    console.log('✅ MCP Tools başarıyla yüklendi!\n');

    // Test URL - gerçek bir iş makalesi
    const testUrl = 'https://www.bbc.com/news/business-67890123';

    console.log(`📰 Test URL: ${testUrl}\n`);

    // Agent'a makale özetlemesi için istek gönder
    const response = await businessAgent.generate(
      `Bu makaleyi analiz et ve özetle: ${testUrl}`,
      {
        maxSteps: 5,
        toolsets,
      }
    );

    console.log('✅ Agent Yanıtı:');
    console.log('================');
    console.log(response.text);
    console.log('\n================\n');

    // Kullanılan tool'ları göster
    if (response.steps && response.steps.length > 0) {
      console.log('🔧 Kullanılan Tool\'lar:');
      response.steps.forEach((step, index) => {
        if (step.toolCalls && step.toolCalls.length > 0) {
          step.toolCalls.forEach((toolCall) => {
            console.log(`${index + 1}. ${toolCall.toolName}`);
            console.log(`   Args: ${JSON.stringify(toolCall.args, null, 2)}`);
          });
        }
      });
    }

    // MCP bağlantısını kapat
    await mcpClient.disconnect();

  } catch (error) {
    console.error('❌ Test sırasında hata oluştu:', error);
  }
}

// Test'i çalıştır
testBusinessAgent();
