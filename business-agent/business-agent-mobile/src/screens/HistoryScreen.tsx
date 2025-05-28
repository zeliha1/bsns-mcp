import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Chip,
  IconButton,
  Searchbar,
  FAB,
  Surface,
  Menu,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';

import { colors, spacing, shadows } from '../theme/theme';
import { storageService } from '../services/storage';
import { AnalysisResult, apiService } from '../services/api';

interface HistoryScreenProps {
  navigation: any;
  route?: any;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation, route }) => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<AnalysisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'success' | 'error'>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAnalyses();
      
      // Handle navigation from other screens
      if (route?.params?.selectedId) {
        setSelectedId(route.params.selectedId);
      }
    }, [route?.params?.selectedId])
  );

  const loadAnalyses = async () => {
    try {
      const history = await storageService.getAnalysisHistory();
      setAnalyses(history);
      filterAnalyses(history, searchQuery, selectedFilter);
    } catch (error) {
      console.error('Error loading analyses:', error);
      Alert.alert('Hata', 'Geçmiş yüklenirken bir hata oluştu');
    }
  };

  const filterAnalyses = (
    data: AnalysisResult[], 
    query: string, 
    filter: 'all' | 'success' | 'error'
  ) => {
    let filtered = data;

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.status === filter);
    }

    // Search filter
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(item =>
        item.url.toLowerCase().includes(lowercaseQuery) ||
        item.summary.toLowerCase().includes(lowercaseQuery) ||
        apiService.extractDomain(item.url).toLowerCase().includes(lowercaseQuery)
      );
    }

    setFilteredAnalyses(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalyses();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterAnalyses(analyses, query, selectedFilter);
  };

  const handleFilterChange = (filter: 'all' | 'success' | 'error') => {
    setSelectedFilter(filter);
    setMenuVisible(false);
    filterAnalyses(analyses, searchQuery, filter);
  };

  const deleteAnalysis = async (id: string) => {
    Alert.alert(
      'Analizi Sil',
      'Bu analizi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteAnalysis(id);
              await loadAnalyses();
              Alert.alert('Başarılı', 'Analiz silindi');
            } catch (error) {
              Alert.alert('Hata', 'Analiz silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const shareAnalysis = async (analysis: AnalysisResult) => {
    try {
      const shareContent = `Business Agent Analiz Sonucu\n\nURL: ${analysis.url}\n\nTarih: ${formatDate(analysis.timestamp)}\n\nÖzet:\n${analysis.summary}`;
      
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

  const toggleFavorite = async (analysis: AnalysisResult) => {
    try {
      const isFav = await storageService.isFavorite(analysis.id);
      
      if (isFav) {
        await storageService.removeFromFavorites(analysis.id);
        Alert.alert('Başarılı', 'Favorilerden kaldırıldı');
      } else {
        await storageService.addToFavorites(analysis);
        Alert.alert('Başarılı', 'Favorilere eklendi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Favori işlemi sırasında bir hata oluştu');
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Geçmişi Temizle',
      'Tüm analiz geçmişini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearHistory();
              await loadAnalyses();
              Alert.alert('Başarılı', 'Geçmiş temizlendi');
            } catch (error) {
              Alert.alert('Hata', 'Geçmiş temizlenirken bir hata oluştu');
            }
          },
        },
      ]
    );
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

  const getFilterText = (filter: string) => {
    switch (filter) {
      case 'all': return 'Tümü';
      case 'success': return 'Başarılı';
      case 'error': return 'Hatalı';
      default: return 'Tümü';
    }
  };

  const renderAnalysisItem = ({ item }: { item: AnalysisResult }) => {
    const isSelected = selectedId === item.id;
    
    return (
      <Card 
        style={[
          styles.analysisCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.statusContainer}>
              <Chip
                mode="outlined"
                textStyle={styles.chipText}
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(item.status) + '20' }
                ]}
              >
                {getStatusText(item.status)}
              </Chip>
              <Text style={styles.dateText}>
                {formatDate(item.timestamp)}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <IconButton
                icon="heart-outline"
                size={20}
                onPress={() => toggleFavorite(item)}
              />
              <IconButton
                icon="share"
                size={20}
                onPress={() => shareAnalysis(item)}
              />
              <IconButton
                icon="delete"
                size={20}
                onPress={() => deleteAnalysis(item.id)}
              />
            </View>
          </View>

          <Text style={styles.urlText} numberOfLines={2}>
            {item.url}
          </Text>
          
          <Text style={styles.domainText}>
            {apiService.extractDomain(item.url)}
          </Text>

          {item.status === 'success' && item.summary && (
            <Paragraph style={styles.summaryText} numberOfLines={isSelected ? undefined : 3}>
              {item.summary}
            </Paragraph>
          )}

          {item.status === 'error' && item.error && (
            <Text style={styles.errorText}>
              Hata: {item.error}
            </Text>
          )}

          {item.tools && item.tools.length > 0 && (
            <View style={styles.toolsContainer}>
              {item.tools.map((tool, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  textStyle={styles.toolChipText}
                  style={styles.toolChip}
                >
                  {tool}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <Surface style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Henüz analiz yok</Text>
      <Text style={styles.emptySubtitle}>
        İlk makale analizinizi yapmak için "Analiz" sekmesine gidin
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Analiz')}
        style={styles.emptyButton}
      >
        Analiz Yap
      </Button>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="URL veya içerik ara..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter"
              mode="outlined"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => handleFilterChange('all')}
            title="Tümü"
            leadingIcon={selectedFilter === 'all' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => handleFilterChange('success')}
            title="Başarılı"
            leadingIcon={selectedFilter === 'success' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => handleFilterChange('error')}
            title="Hatalı"
            leadingIcon={selectedFilter === 'error' ? 'check' : undefined}
          />
          <Divider />
          <Menu.Item
            onPress={clearHistory}
            title="Geçmişi Temizle"
            leadingIcon="delete"
          />
        </Menu>
      </View>

      {/* Filter Info */}
      {(selectedFilter !== 'all' || searchQuery) && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            {filteredAnalyses.length} sonuç • {getFilterText(selectedFilter)}
            {searchQuery && ` • "${searchQuery}"`}
          </Text>
          <Button
            mode="text"
            onPress={() => {
              setSearchQuery('');
              setSelectedFilter('all');
              filterAnalyses(analyses, '', 'all');
            }}
          >
            Temizle
          </Button>
        </View>
      )}

      {/* Analysis List */}
      <FlatList
        data={filteredAnalyses}
        renderItem={renderAnalysisItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredAnalyses.length === 0 ? styles.emptyContainer : styles.listContainer
        }
      />

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Analiz')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  searchbar: {
    flex: 1,
    marginRight: spacing.sm,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  analysisCard: {
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  statusContainer: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  chipText: {
    fontSize: 10,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
  },
  urlText: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  domainText: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  summaryText: {
    lineHeight: 20,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontStyle: 'italic',
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  toolChip: {
    height: 24,
  },
  toolChipText: {
    fontSize: 10,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    ...shadows.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default HistoryScreen;
