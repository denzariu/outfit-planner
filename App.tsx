import React, { useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './src/screens/HomeScreen';

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

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme as DarkThemeNav, DefaultTheme as DefaultThemeNav, NavigationContainer, useNavigation } from '@react-navigation/native';
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
import CalendarScreen from './src/screens/CalendarScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddItemScreen from './src/screens/secondary/AddItemScreen';

import { Logs } from 'expo'
import WardrobeScreen from './src/screens/WardrobeScreen';
import { icons } from './src/defaults/custom-svgs';
Logs.enableExpoCliLogging()

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const theme = useTheme();
  // theme.colors.secondaryContainer = useColorScheme() == 'dark' ? DarkTheme.colors.tertiary : Theme.colors.tertiary
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
  const navigator = useNavigation();

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spin = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg']
  })

  // const inputAnim = useRef(new Animated.Value(100)).current;
  // const [animatedSearch, setAnimatedSearch] = useState<Object>({});
  const [expanded, setExpanded] = useState<boolean>(false)
    
  const fadeIn = () => {
    console.log('fading in')
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
    }).start();
    Animated.timing(rotateAnim, {
      toValue: 90,
      duration: 250,
      useNativeDriver: true
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.create(2000, 'easeInEaseOut', 'opacity'));
    setExpanded(true);
  };

  const fadeOut = () => {
    console.log('fading out')
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.create(2000, 'easeInEaseOut', 'opacity'));
    setExpanded(false);
  }
    

  return (
      <>
      <Tab.Navigator
        // initialRouteName="Calendar"
        activeColor={currentTheme.colors.tabActive}
        inactiveColor={currentTheme.colors.tabAccent}
        style={{zIndex: 0}}
        barStyle={{ position: 'absolute', bottom: 0, height: 80, backgroundColor: currentTheme.colors.tabBackgound + '00'}}
      >
        <Tab.Screen 
          name="Home"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? icons.home : icons.home_outline} color={color} size={26} />
            ),
          }}
        >
          {(props) => <HomeScreen props={expanded}></HomeScreen>}
        </Tab.Screen>

        <Tab.Screen
          name="Calendar"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? icons.calendar : icons.calendar_outline} color={color} size={26} />
            ),
          }}
        >
          {(props) => <CalendarScreen props={expanded}></CalendarScreen>}
        </Tab.Screen>
        
        <Tab.Screen
          name="Add"
          component={HomeScreen}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevents navigation
              
              !expanded ? fadeIn() : fadeOut()
            },
            blur: (e) => {fadeOut()},
            focus: () => {}
          })}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({  }) => (
              <Animated.View
                style={[{
                  position: 'absolute',
                  bottom: -20, // space from bottombar
                  height: 64,
                  width: 64,
                  borderRadius: 64,
                  backgroundColor: currentTheme.colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 15
                },
                { transform: [{rotate: spin}] }
              ]}
              >
                  <MaterialCommunityIcons 
                  style={{alignContent: 'center'}}
                  name={icons.plus} color={currentTheme.colors.background} size={48} 
                   />
              
              </Animated.View>
            ),
          }}
        />

        <Tab.Screen
          name="Wardrobe"
          options={{
            tabBarLabel: '',
            // tabBarBadge: 2,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? icons.wardrobe : icons.wardrobe_outline} color={color} size={26} />
            ),
          }}
        >
          {(props) => <WardrobeScreen props={expanded}></WardrobeScreen>}
        </Tab.Screen>

        <Tab.Screen 
          name="Settings"
          component={HomeScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons style={{top: 20}} name={focused ? icons.settings : icons.settings_outline} color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
      
      {/* {expanded && */}
        <Animated.View style={[{position: 'absolute', bottom: 64 + 8, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between'}, {opacity: fadeAnim}]}>
          <TouchableOpacity onPress={() => {navigator.navigate(AddItemScreen)}}>
            <Text style={{textAlign: 'center', textAlignVertical: 'center', color: currentTheme.colors.quaternary}}>Add item</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{textAlign: 'center', textAlignVertical: 'center', color: currentTheme.colors.quaternary}}>Secret Feature</Text>
          </TouchableOpacity>
          
        </Animated.View>
      {/* } */}
      
      </>
  );
}

export default App;
