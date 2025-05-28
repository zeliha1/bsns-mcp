# Business Agent - İş Makalesi Analiz Asistanı

Bu proje, Mastra framework kullanarak oluşturulmuş bir iş makalesi analiz asistanıdır. Smithery'de deploy edilmiş MCP (Model Context Protocol) server'ını kullanarak web'deki iş makalelerini analiz eder ve özetler.

## 📱 Mobil Uygulama

Bu proje artık **React Native/Expo** ile geliştirilmiş tam özellikli bir mobil uygulamaya sahiptir!

### Mobil Özellikler:
- 🚀 **Cross-Platform**: iOS ve Android desteği
- 🎨 **Modern UI**: Material Design 3 ile şık arayüz
- 📊 **Gerçek Zamanlı Analiz**: Progress tracking ile
- 💾 **Offline Support**: Yerel veri saklama
- 🔍 **Gelişmiş Arama**: Filtreleme ve sıralama
- ⭐ **Favoriler**: Önemli analizleri kaydetme
- 📤 **Paylaşım**: Sonuçları kolayca paylaşma

## 🚀 Özellikler

- **İş Makalesi Özetleme**: Web URL'lerinden iş makalelerini otomatik olarak özetler
- **MCP Entegrasyonu**: Smithery'de deploy edilmiş MCP server ile entegre
- **Türkçe Destek**: Türkçe ve İngilizce makaleleri anlayabilir
- **Stratejik Analiz**: İş dünyası için önemli noktaları vurgular
- **Web Arayüzü**: Kolay kullanım için HTML demo sayfası

## 🛠️ Teknolojiler

- **Mastra Framework**: AI agent framework
- **OpenAI GPT-4**: Dil modeli
- **MCP (Model Context Protocol)**: External tool integration
- **Smithery**: MCP server hosting
- **TypeScript**: Development language

## 📦 Kurulum

1. **Projeyi klonlayın**:
```bash
git clone <repository-url>
cd business-agent
```

2. **Bağımlılıkları yükleyin**:
```bash
npm install
```

3. **Environment variables ayarlayın**:
`.env` dosyasında OpenAI API key'inizi ayarlayın:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🎯 Kullanım

### Backend (Mastra) Server

```bash
npm run dev
```

Server başladıktan sonra:
- **Playground**: http://localhost:4111/
- **API Docs**: http://localhost:4111/openapi.json
- **Swagger UI**: http://localhost:4111/swagger-ui
- **Demo Sayfası**: `demo.html` dosyasını tarayıcıda açın

### 📱 Mobil Uygulama

```bash
cd business-agent-mobile
npm install
npm start
```

Mobil uygulama başladıktan sonra:
- **QR Kod**: Expo Go ile tarayın
- **iOS Simulator**: `i` tuşuna basın
- **Android Emulator**: `a` tuşuna basın
- **Web Browser**: `w` tuşuna basın

### Test

Agent'ı test etmek için:

```bash
npm run test-agent
```

### API Kullanımı

```javascript
// POST http://localhost:4111/api/agents/businessAgent/generate
{
  "messages": [
    {
      "role": "user",
      "content": "Bu makaleyi analiz et ve özetle: https://example.com/business-article"
    }
  ],
  "maxSteps": 5
}
```

## 🔧 MCP Entegrasyonu

Bu proje, Smithery'de deploy edilmiş bir MCP server kullanır:

- **MCP Server URL**: `https://server.smithery.ai/@zeliha1/bsns-mcp/mcp`
- **Tool**: `summarize_business_article`
- **Fonksiyon**: Web URL'lerinden iş makalelerini özetler

### MCP Server Detayları

MCP server'ı şu özelliklere sahiptir:
- Python tabanlı
- `newspaper` ve `sumy` kütüphanelerini kullanır
- LSA (Latent Semantic Analysis) ile özetleme
- 3 cümlelik özetler üretir

## 📁 Proje Yapısı

```
business-agent/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── businessAgent.ts    # Ana agent tanımı
│       └── index.ts                # Mastra konfigürasyonu
├── business-agent-mobile/          # 📱 Mobil Uygulama
│   ├── src/
│   │   ├── screens/               # Uygulama ekranları
│   │   │   ├── HomeScreen.tsx     # Ana sayfa
│   │   │   ├── AnalyzeScreen.tsx  # Analiz ekranı
│   │   │   ├── HistoryScreen.tsx  # Geçmiş ekranı
│   │   │   └── SettingsScreen.tsx # Ayarlar ekranı
│   │   ├── services/              # API ve storage servisleri
│   │   │   ├── api.ts            # Mastra API entegrasyonu
│   │   │   └── storage.ts        # Yerel veri yönetimi
│   │   └── theme/                # UI tema ve stiller
│   │       └── theme.ts
│   ├── App.tsx                   # Ana uygulama komponenti
│   ├── app.json                  # Expo konfigürasyonu
│   └── package.json
├── test-agent.ts                 # Backend test dosyası
├── demo.html                     # Web demo arayüzü
├── .env                         # Environment variables
└── package.json
```

## 🎨 Demo Arayüzü

`demo.html` dosyası, agent'ı test etmek için basit bir web arayüzü sağlar:

1. Dosyayı tarayıcıda açın
2. Bir makale URL'si girin
3. "Makaleyi Analiz Et" butonuna tıklayın
4. Sonuçları görün

## 🔍 Örnek Kullanım

```typescript
import { businessAgent } from './src/mastra/agents/businessAgent';
import { MCPClient } from '@mastra/mcp';

// MCP client oluştur
const mcpClient = new MCPClient({
  servers: {
    businessSummarizer: {
      url: new URL('https://server.smithery.ai/@zeliha1/bsns-mcp/mcp?api_key=...'),
    },
  },
});

// Toolsets al
const toolsets = await mcpClient.getToolsets();

// Agent'ı kullan
const response = await businessAgent.generate(
  'Bu makaleyi analiz et: https://example.com/article',
  { toolsets, maxSteps: 5 }
);

console.log(response.text);
```

## 🚨 Sorun Giderme

### MCP Bağlantı Sorunları
- MCP server URL'sinin doğru olduğundan emin olun
- API key'in geçerli olduğunu kontrol edin

### OpenAI API Sorunları
- `.env` dosyasında `OPENAI_API_KEY` ayarlandığından emin olun
- API key'in geçerli ve kredisi olduğunu kontrol edin

### Server Başlatma Sorunları
- Port 4111'in kullanılabilir olduğundan emin olun
- `npm install` ile bağımlılıkları yeniden yükleyin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
