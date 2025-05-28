# Business Agent Mobile

Business Agent'ın React Native/Expo ile geliştirilmiş mobil uygulaması. İş makalelerini analiz eden AI asistanınızın mobil versiyonu.

## 🚀 Özellikler

### 📱 Mobil Özellikler
- **Native Performans**: React Native ile optimize edilmiş performans
- **Cross-Platform**: iOS ve Android desteği
- **Offline Support**: Yerel veri saklama ile offline erişim
- **Push Notifications**: Analiz tamamlandığında bildirimler
- **Modern UI**: Material Design 3 ile modern arayüz

### 🤖 AI Özellikleri
- **Makale Analizi**: Web URL'lerinden makale özetleme
- **MCP Entegrasyonu**: Smithery'deki MCP server ile entegrasyon
- **Çoklu Dil**: Türkçe ve İngilizce makale desteği
- **Akıllı Özetleme**: LSA algoritması ile kaliteli özetler

### 📊 Veri Yönetimi
- **Analiz Geçmişi**: Tüm analizlerin yerel kaydı
- **Favoriler**: Önemli analizleri favorilere ekleme
- **Arama ve Filtreleme**: Gelişmiş arama özellikleri
- **Veri Paylaşımı**: Sonuçları kolayca paylaşma

## 🛠️ Teknolojiler

- **React Native**: 0.79.2
- **Expo**: ~53.0.9
- **TypeScript**: ~5.8.3
- **React Navigation**: 6.x
- **React Native Paper**: Material Design 3
- **AsyncStorage**: Yerel veri saklama
- **Expo Vector Icons**: İkon seti

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- Expo CLI
- iOS Simulator (macOS) veya Android Emulator
- Expo Go app (fiziksel cihaz için)

### Adımlar

1. **Bağımlılıkları yükleyin**:
```bash
npm install
```

2. **Expo development server'ını başlatın**:
```bash
npm start
```

3. **Platform seçin**:
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

## 🎯 Kullanım

### İlk Kurulum
1. Uygulamayı açın
2. Ayarlar sekmesinden backend bağlantısını kontrol edin
3. İlk makale analizinizi yapın

### Makale Analizi
1. **Analiz** sekmesine gidin
2. Makale URL'sini girin veya panodan yapıştırın
3. **Analiz Et** butonuna tıklayın
4. Sonuçları görüntüleyin ve paylaşın

### Geçmiş Yönetimi
1. **Geçmiş** sekmesinde tüm analizleri görün
2. Arama yapın veya filtreleyin
3. Favorilere ekleyin veya silin
4. Sonuçları paylaşın

## 📱 Ekranlar

### 🏠 Ana Sayfa
- Uygulama özeti ve istatistikler
- Hızlı erişim butonları
- Son analizler
- Kullanım ipuçları

### 📊 Analiz Ekranı
- URL girişi ve doğrulama
- Gerçek zamanlı analiz progress'i
- Sonuç görüntüleme
- Paylaşım ve kopyalama

### 📚 Geçmiş Ekranı
- Tüm analizlerin listesi
- Arama ve filtreleme
- Favori yönetimi
- Toplu işlemler

### ⚙️ Ayarlar Ekranı
- Analiz parametreleri
- Görünüm ayarları
- Bağlantı durumu
- Veri yönetimi

## 🔧 Konfigürasyon

### Backend Bağlantısı
```typescript
// src/services/api.ts
const baseUrl = 'http://localhost:4111'; // Development
// const baseUrl = 'https://your-production-url.com'; // Production
```

### Tema Özelleştirme
```typescript
// src/theme/theme.ts
export const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  // ... diğer renkler
};
```

## 📱 Platform Özellikleri

### iOS
- Native navigation
- Haptic feedback
- iOS design guidelines
- App Store ready

### Android
- Material Design 3
- Adaptive icons
- Edge-to-edge display
- Google Play ready

### Web
- Progressive Web App (PWA)
- Responsive design
- Desktop uyumlu
- Modern browser desteği

## 🚀 Deployment

### Expo Build
```bash
# Development build
expo build:android
expo build:ios

# Production build
expo build:android --release-channel production
expo build:ios --release-channel production
```

### EAS Build (Önerilen)
```bash
# EAS CLI kurulumu
npm install -g @expo/eas-cli

# Build konfigürasyonu
eas build:configure

# Android build
eas build --platform android

# iOS build
eas build --platform ios
```

## 🔍 Test

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
# Detox ile
npm run test:e2e
```

### Manual Testing
1. Tüm ekranları test edin
2. Offline/online durumları test edin
3. Farklı cihaz boyutlarında test edin
4. Performance'ı kontrol edin

## 📊 Performance

### Optimizasyonlar
- **Lazy Loading**: Ekranlar ihtiyaç halinde yüklenir
- **Image Optimization**: Otomatik resim optimizasyonu
- **Bundle Splitting**: Kod bölümleme
- **Caching**: Akıllı önbellekleme

### Monitoring
- **Crash Reporting**: Expo Sentry entegrasyonu
- **Analytics**: Kullanım istatistikleri
- **Performance Metrics**: Uygulama performansı

## 🔒 Güvenlik

### Veri Güvenliği
- Yerel veri şifreleme
- Secure storage kullanımı
- API key güvenliği
- HTTPS zorunluluğu

### Privacy
- Kullanıcı verisi toplama yok
- Yerel veri saklama
- Şeffaf veri kullanımı
- GDPR uyumlu

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Push edin
5. Pull Request oluşturun

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 📞 Destek

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@businessagent.com

## 🔄 Güncellemeler

### v1.0.0 (Mevcut)
- ✅ Temel makale analizi
- ✅ Geçmiş yönetimi
- ✅ Ayarlar paneli
- ✅ Cross-platform destek

### v1.1.0 (Planlanan)
- 🔄 Push notifications
- 🔄 Offline mode
- 🔄 Dark theme
- 🔄 Widget desteği

### v1.2.0 (Gelecek)
- 🔄 AI chat interface
- 🔄 Bulk analysis
- 🔄 Export features
- 🔄 Advanced analytics
