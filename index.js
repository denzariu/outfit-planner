/**
 * @format
 */

import {AppRegistry, useColorScheme} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function Wrapper() {
  return (
    <GestureHandlerRootView style={{flex: 1}} theme={useColorScheme() === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <NavigationContainer theme={useColorScheme() === 'dark' ? DarkTheme : DefaultTheme}> */}
        <App></App>
      {/* </NavigationContainer> */}
    </GestureHandlerRootView>
  )
}

AppRegistry.registerComponent(appName, () => Wrapper);
