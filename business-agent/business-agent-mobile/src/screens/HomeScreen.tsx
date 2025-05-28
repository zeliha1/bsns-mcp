import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  Chip,
  Avatar,
  List,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, shadows } from '../theme/theme';
import { storageService, AppSettings } from '../services/storage';
import { AnalysisResult } from '../services/api';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    successRate: 0,
    favoriteCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [history, userSettings, favorites] = await Promise.all([
        storageService.getAnalysisHistory(),
        storageService.getSettings(),
        storageService.getFavorites(),
      ]);

      setRecentAnalyses(history.slice(0, 5)); // Son 5 analiz
      setSettings(userSettings);

      // İstatistikleri hesapla
      const successCount = history.filter(item => item.status === 'success').length;
      setStats({
        totalAnalyses: history.length,
        successRate: history.length > 0 ? Math.round((successCount / history.length) * 100) : 0,
        favoriteCount: favorites.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'pending': return colors.warning;
      default: return colors.gray[400];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Başarılı';
      case 'error': return 'Hatalı';
      case 'pending': return 'Beklemede';
      default: return 'Bilinmeyen';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.gradient}
          >
            <View style={styles.headerContent}>
              <Avatar.Icon
                size={60}
                icon="robot"
                style={styles.avatar}
              />
              <View style={styles.headerText}>
                <Title style={styles.headerTitle}>Business Agent</Title>
                <Paragraph style={styles.headerSubtitle}>
                  İş makalelerini analiz eden AI asistanınız
                </Paragraph>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Hızlı İşlemler</Title>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="stats-chart"
                onPress={() => navigation.navigate('Analiz')}
                style={styles.actionButton}
              >
                Yeni Analiz
              </Button>
              <Button
                mode="outlined"
                icon="history"
                onPress={() => navigation.navigate('Geçmiş')}
                style={styles.actionButton}
              >
                Geçmişi Görüntüle
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>İstatistikler</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalAnalyses}</Text>
                <Text style={styles.statLabel}>Toplam Analiz</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>%{stats.successRate}</Text>
                <Text style={styles.statLabel}>Başarı Oranı</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.favoriteCount}</Text>
                <Text style={styles.statLabel}>Favori</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Analyses */}
        {recentAnalyses.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Title>Son Analizler</Title>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Geçmiş')}
                >
                  Tümünü Gör
                </Button>
              </View>
              {recentAnalyses.map((analysis) => (
                <List.Item
                  key={analysis.id}
                  title={analysis.url.length > 40 ? `${analysis.url.substring(0, 40)}...` : analysis.url}
                  description={formatDate(analysis.timestamp)}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="web"
                      color={getStatusColor(analysis.status)}
                    />
                  )}
                  right={() => (
                    <Chip
                      mode="outlined"
                      textStyle={{ fontSize: 10 }}
                      style={{ backgroundColor: getStatusColor(analysis.status) + '20' }}
                    >
                      {getStatusText(analysis.status)}
                    </Chip>
                  )}
                  onPress={() => {
                    // Navigate to analysis detail
                    navigation.navigate('Geçmiş', { selectedId: analysis.id });
                  }}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Tips Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>💡 İpuçları</Title>
            <Paragraph>
              • En iyi sonuçlar için güvenilir haber sitelerinin URL'lerini kullanın{'\n'}
              • Makale URL'si doğrudan makale sayfasına yönlendirmeli{'\n'}
              • Analiz sonuçlarını favorilerinize ekleyerek daha sonra erişebilirsiniz
            </Paragraph>
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
  headerCard: {
    margin: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradient: {
    padding: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  card: {
    margin: spacing.md,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 0.48,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});

export default HomeScreen;
