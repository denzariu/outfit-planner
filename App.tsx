import React from 'react';
import type {PropsWithChildren} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './src/screens/HomeScreen';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { 
  DarkTheme,
  Theme,
} from './src/defaults/ui'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme as DarkThemeNav, DefaultTheme as DefaultThemeNav, NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  MD2LightTheme as DefaultThemePaper,
  MD2DarkTheme as DarkThemePaper,
  PaperProvider,
} from 'react-native-paper';

const DarkThemePaperModified = {
  ...DarkThemePaper,
  colors: {
    ...DarkThemePaper,
    notification: DarkTheme.colors.tabNotification
  }
}

const DefaultThemePaperModified = {
  ...DefaultThemePaper,
  colors: {
    ...DefaultThemePaper,
    notification: Theme.colors.tabNotification
  }
}

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App(): JSX.Element {

  return (
    <SafeAreaProvider>
      <PaperProvider  
        theme={useColorScheme() == 'dark' ? DarkThemePaperModified : DefaultThemePaperModified}
      >
        <NavigationContainer 
          theme={useColorScheme() == 'dark' ? DarkThemeNav : DefaultThemeNav}
        >
          <Stack.Navigator 
            screenOptions={{
              statusBarStyle: useColorScheme() == 'dark' ? 'light' : 'dark',
              statusBarColor: useColorScheme() == 'dark' ? DarkTheme.colors.tabBackgound : Theme.colors.background,
              headerShown: false
            }}
            >
            <Stack.Screen
              name="Tabs"
              component={Tabs}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function Tabs(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  return (
      <Tab.Navigator
        initialRouteName="Home"
        activeColor={currentTheme.colors.tabActive}
        inactiveColor={currentTheme.colors.tabAccent}
        barStyle={{ backgroundColor: currentTheme.colors.tabBackgound }}
      >
        <Tab.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home-variant" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Discover"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Discover',
            tabBarBadge: true, //2 for instance
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-blank-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen 
          name="Search"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="wardrobe-outline" color={color} size={26} />
            ),
          }}  
        />
        <Tab.Screen 
          name="Settings"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

export default App;
