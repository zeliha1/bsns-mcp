import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AnalyzeScreen from './src/screens/AnalyzeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Ana Sayfa') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Analiz') {
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                } else if (route.name === 'Geçmiş') {
                  iconName = focused ? 'time' : 'time-outline';
                } else if (route.name === 'Ayarlar') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else {
                  iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen
              name="Ana Sayfa"
              component={HomeScreen}
              options={{
                title: 'Business Agent',
              }}
            />
            <Tab.Screen
              name="Analiz"
              component={AnalyzeScreen}
              options={{
                title: 'Makale Analizi',
              }}
            />
            <Tab.Screen
              name="Geçmiş"
              component={HistoryScreen}
              options={{
                title: 'Analiz Geçmişi',
              }}
            />
            <Tab.Screen
              name="Ayarlar"
              component={SettingsScreen}
              options={{
                title: 'Ayarlar',
              }}
            />
          </Tab.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
