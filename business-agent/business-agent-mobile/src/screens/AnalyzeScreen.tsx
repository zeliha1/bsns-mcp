import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  ProgressBar,
  Chip,
  Surface,
  Text,
  Divider,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';

import { colors, spacing, shadows } from '../theme/theme';
import { apiService, AnalysisRequest, AnalysisResponse } from '../services/api';
import { storageService, AppSettings } from '../services/storage';

interface AnalyzeScreenProps {
  navigation: any;
}

const AnalyzeScreen: React.FC<AnalyzeScreenProps> = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await storageService.getSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) {
      setError('Lütfen bir URL girin');
      return false;
    }

    if (!apiService.isValidUrl(inputUrl)) {
      setError('Geçerli bir URL girin (örn: https://example.com/article)');
      return false;
    }

    return true;
  };

  const analyzeArticle = async () => {
    if (!validateUrl(url)) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setProgress(0);
    Keyboard.dismiss();

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 0.9) {
          clearInterval(progressInterval);
          return 0.9;
        }
        return prev + 0.1;
      });
    }, 500);

    try {
      const request: AnalysisRequest = {
        url: url.trim(),
        maxSteps: settings?.maxSteps || 5,
      };

      const response = await apiService.analyzeArticle(request);
      setResult(response);
      setProgress(1);

      // Save to history if auto-save is enabled
      if (settings?.autoSave) {
        const analysisResult = apiService.formatAnalysisResult(url, response);
        await storageService.saveAnalysis(analysisResult);
      }

      // Show success message
      Alert.alert(
        'Analiz Tamamlandı',
        'Makale başarıyla analiz edildi!',
        [
          { text: 'Tamam' },
          {
            text: 'Geçmişe Git',
            onPress: () => navigation.navigate('Geçmiş'),
          },
        ]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);

      // Save error to history if auto-save is enabled
      if (settings?.autoSave) {
        const analysisResult = apiService.formatAnalysisResult(url, { text: '', steps: [] }, errorMessage);
        await storageService.saveAnalysis(analysisResult);
      }
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent && apiService.isValidUrl(clipboardContent)) {
        setUrl(clipboardContent);
        setError(null);
      } else {
        Alert.alert('Hata', 'Panoda geçerli bir URL bulunamadı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Pano içeriği okunamadı');
    }
  };

  const shareResult = async () => {
    if (!result) return;

    try {
      const shareContent = `Business Agent Analiz Sonucu\n\nURL: ${url}\n\nÖzet:\n${result.text}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareContent);
      } else {
        await Clipboard.setStringAsync(shareContent);
        Alert.alert('Başarılı', 'Analiz sonucu panoya kopyalandı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Başarılı', 'Metin panoya kopyalandı');
    } catch (error) {
      Alert.alert('Hata', 'Kopyalama sırasında bir hata oluştu');
    }
  };

  const clearForm = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const getUsedTools = (): string[] => {
    if (!result?.steps) return [];

    const tools = result.steps.flatMap(step =>
      step.toolCalls?.map(tool => tool.toolName) || []
    );

    return [...new Set(tools)]; // Remove duplicates
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* URL Input Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title>Makale URL'si</Title>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Makale URL'si girin"
                  value={url}
                  onChangeText={(text) => {
                    setUrl(text);
                    setError(null);
                  }}
                  mode="outlined"
                  placeholder="https://example.com/business-article"
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.textInput}
                  error={!!error}
                  disabled={isAnalyzing}
                />
                <IconButton
                  icon="content-paste"
                  mode="outlined"
                  onPress={pasteFromClipboard}
                  disabled={isAnalyzing}
                  style={styles.pasteButton}
                />
              </View>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={analyzeArticle}
                  loading={isAnalyzing}
                  disabled={isAnalyzing || !url.trim()}
                  style={styles.analyzeButton}
                  icon="stats-chart"
                >
                  {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
                </Button>

                {(url || result) && (
                  <Button
                    mode="outlined"
                    onPress={clearForm}
                    disabled={isAnalyzing}
                    style={styles.clearButton}
                    icon="close"
                  >
                    Temizle
                  </Button>
                )}
              </View>

              {isAnalyzing && (
                <View style={styles.progressContainer}>
                  <ProgressBar progress={progress} color={colors.primary} />
                  <Text style={styles.progressText}>
                    Makale analiz ediliyor... {Math.round(progress * 100)}%
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Result Card */}
          {result && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.resultHeader}>
                  <Title>Analiz Sonucu</Title>
                  <View style={styles.resultActions}>
                    <IconButton
                      icon="content-copy"
                      mode="outlined"
                      size={20}
                      onPress={() => copyToClipboard(result.text)}
                    />
                    <IconButton
                      icon="share"
                      mode="outlined"
                      size={20}
                      onPress={shareResult}
                    />
                  </View>
                </View>

                <Surface style={styles.resultSurface}>
                  <Paragraph style={styles.resultText}>
                    {result.text}
                  </Paragraph>
                </Surface>

                {/* Used Tools */}
                {getUsedTools().length > 0 && (
                  <>
                    <Divider style={styles.divider} />
                    <Text style={styles.toolsTitle}>Kullanılan Araçlar:</Text>
                    <View style={styles.toolsContainer}>
                      {getUsedTools().map((tool, index) => (
                        <Chip
                          key={index}
                          mode="outlined"
                          icon="tool"
                          style={styles.toolChip}
                        >
                          {tool}
                        </Chip>
                      ))}
                    </View>
                  </>
                )}

                {/* URL Info */}
                <Divider style={styles.divider} />
                <View style={styles.urlInfo}>
                  <Text style={styles.urlLabel}>Kaynak:</Text>
                  <Text style={styles.urlText} numberOfLines={2}>
                    {url}
                  </Text>
                  <Text style={styles.domainText}>
                    {apiService.extractDomain(url)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Tips Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title>💡 Analiz İpuçları</Title>
              <Paragraph>
                • Makale URL'si doğrudan makale sayfasına yönlendirmeli{'\n'}
                • En iyi sonuçlar için tam makale URL'si kullanın{'\n'}
                • Analiz süresi makale uzunluğuna göre değişebilir{'\n'}
                • Sonuçlar otomatik olarak geçmişinize kaydedilir
              </Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
    ...shadows.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  textInput: {
    flex: 1,
  },
  pasteButton: {
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  analyzeButton: {
    flex: 1,
  },
  clearButton: {
    flex: 0.4,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressText: {
    textAlign: 'center',
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultActions: {
    flexDirection: 'row',
  },
  resultSurface: {
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
  },
  resultText: {
    lineHeight: 22,
    color: colors.text,
  },
  divider: {
    marginVertical: spacing.md,
  },
  toolsTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toolChip: {
    marginBottom: spacing.xs,
  },
  urlInfo: {
    marginTop: spacing.sm,
  },
  urlLabel: {
    fontWeight: 'bold',
    color: colors.textSecondary,
    fontSize: 12,
  },
  urlText: {
    color: colors.text,
    marginTop: spacing.xs,
  },
  domainText: {
    color: colors.primary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

export default AnalyzeScreen;
