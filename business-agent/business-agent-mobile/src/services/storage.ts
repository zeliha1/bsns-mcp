import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from './api';

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: '@business_agent_history',
  SETTINGS: '@business_agent_settings',
  FAVORITES: '@business_agent_favorites',
};

export interface AppSettings {
  maxSteps: number;
  autoSave: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'tr' | 'en';
}

const DEFAULT_SETTINGS: AppSettings = {
  maxSteps: 5,
  autoSave: true,
  notifications: true,
  theme: 'light',
  language: 'tr',
};

class StorageService {
  // Analysis History Management
  async saveAnalysis(analysis: AnalysisResult): Promise<void> {
    try {
      const history = await this.getAnalysisHistory();
      const updatedHistory = [analysis, ...history].slice(0, 100); // Keep last 100
      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYSIS_HISTORY, 
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw new Error('Analiz kaydedilemedi');
    }
  }

  async getAnalysisHistory(): Promise<AnalysisResult[]> {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error loading analysis history:', error);
      return [];
    }
  }

  async deleteAnalysis(id: string): Promise<void> {
    try {
      const history = await this.getAnalysisHistory();
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.ANALYSIS_HISTORY, 
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw new Error('Analiz silinemedi');
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    } catch (error) {
      console.error('Error clearing history:', error);
      throw new Error('Geçmiş temizlenemedi');
    }
  }

  // Settings Management
  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS, 
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Ayarlar kaydedilemedi');
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsJson ? { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw new Error('Ayarlar sıfırlanamadı');
    }
  }

  // Favorites Management
  async addToFavorites(analysis: AnalysisResult): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = [analysis, ...favorites.filter(fav => fav.id !== analysis.id)];
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES, 
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw new Error('Favorilere eklenemedi');
    }
  }

  async removeFromFavorites(id: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES, 
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw new Error('Favorilerden kaldırılamadı');
    }
  }

  async getFavorites(): Promise<AnalysisResult[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  async isFavorite(id: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === id);
    } catch (error) {
      return false;
    }
  }

  // Utility methods
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      return items.reduce((size, [key, value]) => {
        return size + (value ? value.length : 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Tüm veriler temizlenemedi');
    }
  }
}

export const storageService = new StorageService();
