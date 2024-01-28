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
import { DarkTheme, Theme, mainAnimation } from '../defaults/ui';
import { useEffect, useState } from 'react';

const AnimatedGradient = ({...props}) => {
  const { width, height } = useWindowDimensions();
  
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  

  const expanded = props.props;

  const biggerFade = width/1.45;
  const smallerFade = width/1.25;
  const [spread, setSpread] = useState(smallerFade);


  useEffect(() => {
    LayoutAnimation.configureNext(mainAnimation);

    expanded ? setSpread(biggerFade) : setSpread(smallerFade)

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