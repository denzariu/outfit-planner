import React, { useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme as DarkThemeNav, DefaultTheme as DefaultThemeNav, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import {
  Animated,
  LayoutAnimation,
  Text,
  useColorScheme,
} from 'react-native';

import { 
  DarkTheme,
  Theme,
} from './src/defaults/ui'
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
import CalendarScreen from './src/screens/CalendarScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddItemScreen from './src/screens/secondary/AddItemScreen';

import { Logs } from 'expo'
import WardrobeScreen from './src/screens/WardrobeScreen';
import { icons } from './src/defaults/custom-svgs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTab from './src/components/CustomTab';
import AnimatedGradient from './src/components/AnimatedGradient';
Logs.enableExpoCliLogging()

// const Tab = createMaterialBottomTabNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transparent'
  const currentTheme = useColorScheme() == 'dark' ? DarkTheme : Theme

  return (
    <SafeAreaProvider>
      <PaperProvider  
        theme={DarkThemePaperModified}
      >
      <NavigationContainer 
          theme={useColorScheme() == 'dark' ? DarkThemeNav : DefaultThemeNav}
        >
          <Stack.Navigator 
            screenOptions={{
              animation: 'slide_from_right',
              statusBarStyle: useColorScheme() == 'dark' ? 'dark' : 'light',
              statusBarColor: currentTheme.colors.background,
              headerShown: false
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="AddItemScreen" component={AddItemScreen}
              // options={{
              //   animation: 'slide_from_right'
              // }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


function Tabs(): JSX.Element {

  const [expanded, setExpanded] = useState<boolean>(false);
    

  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false
        }}
        tabBar={(props) => <CustomTab {...props} setExpanded={setExpanded} expanded={expanded}/>}
      >
        <Tab.Screen 
          name="Home"
          children={() => <HomeScreen fadeAnimation={expanded}></HomeScreen>}
        />

        <Tab.Screen
          name="Calendar"
          children={() => <CalendarScreen fadeAnimation={expanded}></CalendarScreen>}
        />
        
        <Tab.Screen
          name="Add"
          component={HomeScreen}
        />

        <Tab.Screen 
          name="Wardrobe"
          children={() => <WardrobeScreen fadeAnimation={expanded}></WardrobeScreen>}
        />

        <Tab.Screen 
          name="Settings"
          component={HomeScreen}
        />
      </Tab.Navigator>
  );
}

export default App;
