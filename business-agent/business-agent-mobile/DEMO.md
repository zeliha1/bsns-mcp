# Business Agent Mobile - Demo Guide

Bu rehber, Business Agent mobil uygulamasının özelliklerini test etmek için adım adım talimatlar içerir.

## 🚀 Uygulamayı Başlatma

1. **Development Server'ı başlatın**:
```bash
cd business-agent/business-agent-mobile
npm start
```

2. **QR kodu tarayın**:
   - Android: Expo Go uygulaması ile QR kodu tarayın
   - iOS: Kamera uygulaması ile QR kodu tarayın

3. **Alternatif olarak**:
   - `a` tuşuna basarak Android emulator'da açın
   - `i` tuşuna basarak iOS simulator'da açın
   - `w` tuşuna basarak web browser'da açın

## 📱 Uygulama Turu

### 🏠 Ana Sayfa
- **Özellikler**:
  - Uygulama özeti ve hoş geldin mesajı
  - İstatistikler (toplam analiz, başarı oranı, favoriler)
  - Hızlı erişim butonları
  - Son analizler listesi
  - Kullanım ipuçları

- **Test Adımları**:
  1. Ana sayfayı açın
  2. İstatistikleri kontrol edin
  3. "Yeni Analiz" butonuna tıklayın
  4. "Geçmişi Görüntüle" butonuna tıklayın
  5. Son analizlerden birine tıklayın

### 📊 Analiz Ekranı
- **Özellikler**:
  - URL girişi ve doğrulama
  - Panodan yapıştırma
  - Gerçek zamanlı progress bar
  - Sonuç görüntüleme
  - Paylaşım ve kopyalama
  - Kullanılan araçları gösterme

- **Test Adımları**:
  1. Analiz sekmesine gidin
  2. Test URL'si girin: `https://www.bbc.com/news/business`
  3. "Analiz Et" butonuna tıklayın
  4. Progress bar'ı izleyin
  5. Sonuçları görüntüleyin
  6. Paylaş butonunu test edin
  7. Kopyala butonunu test edin

### 📚 Geçmiş Ekranı
- **Özellikler**:
  - Tüm analizlerin listesi
  - Arama ve filtreleme
  - Durum bazlı filtreleme (başarılı/hatalı)
  - Favori ekleme/çıkarma
  - Analiz silme
  - Detaylı görünüm

- **Test Adımları**:
  1. Geçmiş sekmesine gidin
  2. Arama çubuğuna "bbc" yazın
  3. Filtre menüsünü açın
  4. "Başarılı" filtresi seçin
  5. Bir analize tıklayarak detayları görün
  6. Favori butonunu test edin
  7. Paylaş butonunu test edin
  8. Sil butonunu test edin

### ⚙️ Ayarlar Ekranı
- **Özellikler**:
  - Backend bağlantı durumu
  - Analiz parametreleri
  - Görünüm ayarları
  - Depolama bilgileri
  - Uygulama hakkında
  - Veri yönetimi

- **Test Adımları**:
  1. Ayarlar sekmesine gidin
  2. Bağlantı durumunu kontrol edin
  3. "Yeniden Test Et" butonuna tıklayın
  4. Maksimum adım sayısını değiştirin
  5. Otomatik kaydetme ayarını değiştirin
  6. Tema ayarını değiştirin
  7. Depolama bilgilerini görüntüleyin

## 🧪 Test Senaryoları

### Senaryo 1: İlk Kullanım
1. Uygulamayı ilk kez açın
2. Ana sayfadaki hoş geldin mesajını görün
3. "Yeni Analiz" butonuna tıklayın
4. İlk makale analizinizi yapın
5. Sonuçları favorilere ekleyin

### Senaryo 2: Toplu Analiz
1. Birden fazla makale URL'si analiz edin:
   - `https://www.reuters.com/business/`
   - `https://www.cnbc.com/business/`
   - `https://www.bloomberg.com/news/`
2. Geçmişte tüm analizleri görün
3. Başarılı olanları filtreleyin
4. En iyilerini favorilere ekleyin

### Senaryo 3: Hata Durumu
1. Geçersiz URL girin: `invalid-url`
2. Hata mesajını görün
3. Doğru URL girin ve tekrar deneyin
4. İnternet bağlantısını kapatın
5. Offline durumu test edin

### Senaryo 4: Veri Yönetimi
1. Çok sayıda analiz yapın
2. Geçmişte arama yapın
3. Filtreleme özelliklerini test edin
4. Favorileri yönetin
5. Depolama boyutunu kontrol edin

## 📋 Test Checklist

### ✅ Temel Özellikler
- [ ] Uygulama başarıyla açılıyor
- [ ] Tüm sekmeler çalışıyor
- [ ] Navigation sorunsuz
- [ ] URL doğrulama çalışıyor
- [ ] Analiz işlemi tamamlanıyor
- [ ] Sonuçlar görüntüleniyor

### ✅ UI/UX
- [ ] Responsive tasarım
- [ ] İkonlar doğru görünüyor
- [ ] Renkler tutarlı
- [ ] Animasyonlar akıcı
- [ ] Loading states çalışıyor
- [ ] Error states çalışıyor

### ✅ Veri Yönetimi
- [ ] Analizler kaydediliyor
- [ ] Arama çalışıyor
- [ ] Filtreleme çalışıyor
- [ ] Favoriler çalışıyor
- [ ] Silme işlemi çalışıyor
- [ ] Paylaşım çalışıyor

### ✅ Ayarlar
- [ ] Backend bağlantısı test ediliyor
- [ ] Ayarlar kaydediliyor
- [ ] Tema değişiklikleri uygulanıyor
- [ ] Depolama bilgileri doğru
- [ ] Reset işlemleri çalışıyor

## 🐛 Bilinen Sorunlar

1. **İkon Uyarıları**: Bazı ikonlar için uyarı mesajları (düzeltildi)
2. **Surface Overflow**: Shadow görünüm sorunları (kozmetik)
3. **Package Versions**: Bazı paketler güncel değil (çalışıyor)

## 📱 Platform Testleri

### iOS
- [ ] iPhone SE (küçük ekran)
- [ ] iPhone 14 (standart)
- [ ] iPhone 14 Pro Max (büyük ekran)
- [ ] iPad (tablet)

### Android
- [ ] Android 8+ (eski sürüm)
- [ ] Android 12+ (yeni sürüm)
- [ ] Farklı ekran boyutları
- [ ] Farklı DPI değerleri

### Web
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

## 🚀 Performance Testleri

1. **Başlangıç Süresi**: < 3 saniye
2. **Analiz Süresi**: Makale boyutuna bağlı
3. **Memory Usage**: < 100MB
4. **Bundle Size**: < 50MB
5. **Network Usage**: Minimal

## 📊 Başarı Kriterleri

- ✅ Tüm temel özellikler çalışıyor
- ✅ UI responsive ve kullanıcı dostu
- ✅ Performance kabul edilebilir
- ✅ Hata durumları düzgün yönetiliyor
- ✅ Veri güvenliği sağlanıyor

## 🎯 Sonraki Adımlar

1. **Beta Test**: Gerçek kullanıcılarla test
2. **Performance Optimization**: Bundle size ve memory
3. **Feature Enhancement**: Yeni özellikler
4. **Store Deployment**: App Store ve Google Play
