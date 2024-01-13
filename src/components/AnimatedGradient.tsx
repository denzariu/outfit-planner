// import { View, Text, Animated } from 'react-native'
// import React, { useEffect, useRef } from 'react'
// import LinearGradient from 'react-native-linear-gradient'
// import { useColorScheme } from 'react-native'
// import { DarkTheme, Theme } from '../defaults/ui'


// const AnimatedGradient = ({...props}) => {
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
  
//   const isDarkMode = useColorScheme() == 'dark';
//   const currentTheme = isDarkMode ? DarkTheme : Theme;

//   const AnimatedGradientHelper = Animated.createAnimatedComponent(GradientHelper); 
  
//   const tweener = new Animated.Value(0);

//   useEffect(() => {
//     Animated.timing(tweener, {
//       toValue: 1,
//       useNativeDriver: true
//     }).start()
//   }, [props])

//   // useEffect(() => {
//   //   if (props) {
//   //     console.log('fading in')
//   //     Animated.timing(fadeAnim, {
//   //         toValue: 30,
//   //         duration: 250,
//   //         useNativeDriver: true
//   //     }).start();
//   //   }
//   //   else {

//   //     // console.log('fading out')
//   //     // Animated.timing(fadeAnim, {
//   //     //   toValue: 10,
//   //     //   duration: 250,
//   //     //   useNativeDriver: true
//   //     // }).start();
//   //   }
//   // }, [props])

  

//   return (
//     <AnimatedGradientHelper
//       tweener={tweener}
//     />
//   )
// }

// const GradientHelper = ({...props}) => {

  
//   const isDarkMode = useColorScheme() == 'dark';
//   const currentTheme = isDarkMode ? DarkTheme : Theme;

//   const {tweener} = props

//   const endYinterp = tweener.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 0.5]
//   })

//   return (
//     <LinearGradient
//         colors={["#00000000", currentTheme.colors.secondary + '44', currentTheme.colors.secondary + 'FF']}
//         style={{
//           position: 'absolute',
//           overflow: 'visible',
//           pointerEvents: 'none',
//           left: 0,
//           right: 0,
//           bottom: 0,
//           height: '30%',
//           zIndex: 0
//         }}
//         start={{x: 0, y: endYinterp }}
//         end={{ x: 0, y: 1 }}
//         locations={[0.7, 0.8, 1]}
//       />
//   )
// }

// export default AnimatedGradient

import {
  TouchableOpacity,
  StyleSheet,
  View,
  useWindowDimensions,
  useColorScheme,
  LayoutAnimation,
} from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
import { Canvas, LinearGradient, Rect, runTiming, vec } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { DarkTheme, Theme } from '../defaults/ui';
import { useEffect, useState } from 'react';


const AnimatedGradient = ({...props}) => {
  const { width, height } = useWindowDimensions();
  
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  

  const expanded = props.props;

  const biggerFade = width/1.45;
  const smallerFade = width/1.25;
  const [spread, setSpread] = useState(smallerFade);

  console.log('update')

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));

    if (expanded == true)
      setSpread(biggerFade)
    else if (expanded == false)
      setSpread(smallerFade)

  }, [expanded])

  const leftColor = useSharedValue(currentTheme.colors.quaternary + '22');
  const middleColor = useSharedValue(currentTheme.colors.tertiary + '00');
  const rightColor = useSharedValue(currentTheme.colors.tertiary + 'FF');


  const colors = useDerivedValue(() => {
    return [leftColor.value, middleColor.value, rightColor.value];
  }, []);

  return (
    <>
    <Canvas style={{ 
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: -1,
      height: '35%' }}
    >
      <Rect x={0} y={0} width={width} height={height/10*3.5}>
        <LinearGradient
          start={vec(width, 0)}
          end={vec(width, spread)}
          colors={colors}
        />
      </Rect>
    </Canvas>
    </>
  );
};

export default AnimatedGradient ;