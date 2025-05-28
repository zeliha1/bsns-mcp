import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Switch,
  List,
  Divider,
  Text,
  Surface,
  SegmentedButtons,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';

import { colors, spacing, shadows } from '../theme/theme';
import { storageService, AppSettings } from '../services/storage';
import { apiService } from '../services/api';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    loadSettings();
    checkConnection();
    getStorageSize();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await storageService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Hata', 'Ayarlar yüklenirken bir hata oluştu');
    }
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    if (!settings) return;

    try {
      setLoading(true);
      const updatedSettings = { ...settings, ...newSettings };
      await storageService.saveSettings(updatedSettings);
      setSettings(updatedSettings);
      Alert.alert('Başarılı', 'Ayarlar kaydedildi');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Hata', 'Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isConnected = await apiService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const getStorageSize = async () => {
    try {
      const size = await storageService.getStorageSize();
      setStorageSize(size);
    } catch (error) {
      console.error('Error getting storage size:', error);
    }
  };

  const formatStorageSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetSettings = () => {
    Alert.alert(
      'Ayarları Sıfırla',
      'Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.resetSettings();
              await loadSettings();
              Alert.alert('Başarılı', 'Ayarlar sıfırlandı');
            } catch (error) {
              Alert.alert('Hata', 'Ayarlar sıfırlanırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Bu işlem tüm analiz geçmişi, favoriler ve ayarları silecektir. Bu işlem geri alınamaz!',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAllData();
              await loadSettings();
              await getStorageSize();
              Alert.alert('Başarılı', 'Tüm veriler silindi');
            } catch (error) {
              Alert.alert('Hata', 'Veriler silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const shareApp = async () => {
    try {
      const shareContent = 'Business Agent - İş makalelerini analiz eden AI asistanı. Mastra framework ile geliştirilmiştir.';
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareContent);
      } else {
        Alert.alert('Bilgi', 'Paylaşım bu cihazda desteklenmiyor');
      }
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    }
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/mastra-ai/mastra');
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return colors.success;
      case 'disconnected': return colors.error;
      case 'checking': return colors.warning;
      default: return colors.gray[400];
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Bağlı';
      case 'disconnected': return 'Bağlantı Yok';
      case 'checking': return 'Kontrol Ediliyor...';
      default: return 'Bilinmeyen';
    }
  };

  if (!settings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Ayarlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Connection Status */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Bağlantı Durumu</Title>
            <View style={styles.connectionContainer}>
              <View style={styles.connectionInfo}>
                <Text style={styles.connectionLabel}>Mastra Backend:</Text>
                <Text style={[styles.connectionStatus, { color: getConnectionStatusColor() }]}>
                  {getConnectionStatusText()}
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={checkConnection}
                loading={connectionStatus === 'checking'}
                disabled={connectionStatus === 'checking'}
              >
                Yeniden Test Et
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Analysis Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Analiz Ayarları</Title>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Maksimum Adım Sayısı</Text>
              <TextInput
                mode="outlined"
                value={settings.maxSteps.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 1;
                  if (value >= 1 && value <= 10) {
                    saveSettings({ maxSteps: value });
                  }
                }}
                keyboardType="numeric"
                style={styles.numberInput}
              />
            </View>
            <Text style={styles.settingDescription}>
              Analiz sırasında kullanılacak maksimum adım sayısı (1-10)
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Otomatik Kaydetme</Text>
                <Text style={styles.settingDescription}>
                  Analizleri otomatik olarak geçmişe kaydet
                </Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => saveSettings({ autoSave: value })}
                disabled={loading}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Bildirimler</Text>
                <Text style={styles.settingDescription}>
                  Analiz tamamlandığında bildirim gönder
                </Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => saveSettings({ notifications: value })}
                disabled={loading}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Appearance Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Görünüm</Title>
            
            <Text style={styles.settingLabel}>Tema</Text>
            <SegmentedButtons
              value={settings.theme}
              onValueChange={(value) => saveSettings({ theme: value as 'light' | 'dark' | 'auto' })}
              buttons={[
                { value: 'light', label: 'Açık' },
                { value: 'dark', label: 'Koyu' },
                { value: 'auto', label: 'Otomatik' },
              ]}
              style={styles.segmentedButtons}
            />

            <Divider style={styles.divider} />

            <Text style={styles.settingLabel}>Dil</Text>
            <SegmentedButtons
              value={settings.language}
              onValueChange={(value) => saveSettings({ language: value as 'tr' | 'en' })}
              buttons={[
                { value: 'tr', label: 'Türkçe' },
                { value: 'en', label: 'English' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Storage Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Depolama</Title>
            <View style={styles.storageInfo}>
              <Text style={styles.storageLabel}>Kullanılan Alan:</Text>
              <Text style={styles.storageSize}>{formatStorageSize(storageSize)}</Text>
            </View>
            <Button
              mode="outlined"
              onPress={getStorageSize}
              style={styles.refreshButton}
            >
              Yenile
            </Button>
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Uygulama Hakkında</Title>
            <List.Item
              title="Sürüm"
              description="1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Geliştirici"
              description="Mastra Framework"
              left={(props) => <List.Icon {...props} icon="account" />}
              onPress={openGitHub}
            />
            <List.Item
              title="Uygulamayı Paylaş"
              description="Arkadaşlarınızla paylaşın"
              left={(props) => <List.Icon {...props} icon="share" />}
              onPress={shareApp}
            />
          </Card.Content>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <Card.Content>
            <Title style={styles.dangerTitle}>Tehlikeli Bölge</Title>
            
            <Button
              mode="outlined"
              onPress={resetSettings}
              style={styles.dangerButton}
              textColor={colors.error}
            >
              Ayarları Sıfırla
            </Button>
            
            <Button
              mode="outlined"
              onPress={clearAllData}
              style={styles.dangerButton}
              textColor={colors.error}
            >
              Tüm Verileri Sil
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: spacing.md,
    ...shadows.sm,
  },
  dangerCard: {
    borderColor: colors.error + '30',
    borderWidth: 1,
  },
  connectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionLabel: {
    fontWeight: 'bold',
    color: colors.text,
  },
  connectionStatus: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  numberInput: {
    width: 80,
    height: 40,
  },
  divider: {
    marginVertical: spacing.md,
  },
  segmentedButtons: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  storageLabel: {
    fontWeight: 'bold',
    color: colors.text,
  },
  storageSize: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  refreshButton: {
    marginTop: spacing.sm,
  },
  dangerTitle: {
    color: colors.error,
  },
  dangerButton: {
    marginTop: spacing.sm,
    borderColor: colors.error,
  },
});

export default SettingsScreen;
