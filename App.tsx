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
import { LinearGradient } from 'react-native-linear-gradient';
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
    notification: DarkTheme.colors.tabNotification,
  }
}

const DefaultThemePaperModified = {
  ...DefaultThemePaper,
  colors: {
    ...DefaultThemePaper,
    notification: Theme.colors.tabNotification
  }
}
import { useTheme } from 'react-native-paper';


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const theme = useTheme();
  // theme.colors.secondaryContainer = useColorScheme() == 'dark' ? DarkTheme.colors.tertiary : Theme.colors.tertiary
  theme.colors.secondaryContainer = 'transparent'

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
      <>
      
      <Tab.Navigator
      
        initialRouteName="Home"
        activeColor={currentTheme.colors.tabActive}
        inactiveColor={currentTheme.colors.tabAccent}
        style={{zIndex: 0}}
        barStyle={{ position: 'absolute', bottom: 0, height: 80, backgroundColor: currentTheme.colors.tabBackgound + '00'}}
      >
        <Tab.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? "home-variant" : "home-variant-outline"} color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Discover"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            // tabBarBadge: true, //2 for instance
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? "calendar-blank" : "calendar-blank-outline"} color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({  }) => (
              <View
                style={{
                  position: 'absolute',
                  bottom: -20, // space from bottombar
                  height: 64,
                  width: 64,
                  borderRadius: 64,
                  backgroundColor: currentTheme.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 15
                }}
              >
                <MaterialCommunityIcons 
                  style={{alignContent: 'center'}}
                  name="plus" color={currentTheme.colors.background} size={48} 
                  onPress={() => {/* TODO */}} />
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name='Search'
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? "wardrobe" : "wardrobe-outline"} color={color} size={26} />
            ),
          }}  
        />
        <Tab.Screen 
          name="Settings"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? "cog" : "cog-outline"} color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
      <LinearGradient
        colors={["#00000000", currentTheme.colors.secondary + '44', currentTheme.colors.secondary + 'FF']}
        style={{
          position: 'absolute',
          overflow: 'visible',
          pointerEvents: 'none',
          left: 0,
          right: 0,
          bottom: 0,
          height: "10%",
          zIndex: 0
        }}
      />
      </>
  );
}

export default App;
