import { Animated, Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { icons } from "../defaults/custom-svgs";
import { DarkTheme, Theme, mainAnimation, swipeAnimation } from "../defaults/ui";
import { useRef, useState } from "react";
import AnimatedGradient from "./AnimatedGradient";

type TabProps = {
  state: any, 
  descriptors: any, 
  navigation: any, 
  setExpanded: any,
  expanded: any
  // position: any 
}
const CustomTab = ({ state, descriptors, navigation, setExpanded, expanded }: TabProps) => {
  const currentTheme = useColorScheme() == 'dark' ? DarkTheme : Theme;

  // const [expanded, setExpanded] = useState<boolean>(false)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spin = rotateAnim.interpolate({
    inputRange: [0, 90],
    outputRange: ['0deg', '90deg']
  })
    
  const fadeIn = () => {
    console.log('fadein')
    Animated.timing(rotateAnim, {
      toValue: 90,
      duration: 250,
      useNativeDriver: true
    }).start();
    LayoutAnimation.configureNext(swipeAnimation);
    setExpanded(true);
  };

  const fadeOut = () => {
    console.log('fadeout')
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start();
    LayoutAnimation.configureNext(swipeAnimation);
    setExpanded(false);
  }
  
  return (
    <>
    {expanded &&
      <View 
        pointerEvents='box-none' 
        style={{
          zIndex: 30,
          position: 'absolute',
          bottom: 56, // 56 above menu, or 8/10 to overlap menu 
          left: 20,
          right: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('AddItemScreen')}
          style={{
            width: 120,
            alignItems: 'center',
            padding: Theme.spacing.m,
            backgroundColor: currentTheme.colors.primary,
            borderRadius: Theme.spacing.m,
          }}
        >
          <Text
            style={{
              fontWeight: '500',
              color: currentTheme.colors.background,
              fontSize: Theme.fontSize.s_l
            }}
          >
            Add Item
          </Text>  
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddOutfitScreen')}
          activeOpacity={0.75}
          style={{
            width: 120,
            alignItems: 'center',
            padding: Theme.spacing.m,
            backgroundColor: currentTheme.colors.primary,
            borderRadius: Theme.spacing.m,
          }}
        >
          <Text
            style={{
              fontWeight: '500',
              color: currentTheme.colors.background,
              fontSize: Theme.fontSize.s_l,
            }}
          >
            Create Outfit
          </Text>  
        </TouchableOpacity>
      </View>
    }
    <View
      style={{
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        // right: 0,
        zIndex: 1,
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: expanded ?   currentTheme.colors.tertiary + 'FF' : currentTheme.colors.tertiary + 'BF'
      }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          
          // Middle button special case
          if (route.name === 'Add') {
            !expanded ? fadeIn() : fadeOut()
          } else if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_: any, i: any) => i);

        return (
          <TouchableOpacity
            key={'route_' + route.name + index}
            accessibilityRole="button"
            // accessibilityState={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={route.name === 'Add' ? 1 : 0.2}
          >
            {route.name === 'Home' ? (
              <MaterialCommunityIcons style={styles.logo_tiny} name={isFocused ? icons.home : icons.home_outline} color={currentTheme.colors.tabActive} size={styles.logo_tiny.height - styles.logo_tiny.padding*2} />
            ) : route.name === 'Calendar' ? (
              <MaterialCommunityIcons style={styles.logo_tiny} name={isFocused ? icons.calendar : icons.calendar_outline} color={currentTheme.colors.tabActive} size={styles.logo_tiny.height - styles.logo_tiny.padding*2} />
            ) : route.name === 'Wardrobe' ? (
              <MaterialCommunityIcons style={styles.logo_tiny} name={isFocused ? icons.wardrobe : icons.wardrobe_outline} color={currentTheme.colors.tabActive} size={styles.logo_tiny.height - styles.logo_tiny.padding*2} />
            ) : route.name === 'Settings' ? (
              <MaterialCommunityIcons style={styles.logo_tiny} name={isFocused ? icons.settings : icons.settings_outline} color={currentTheme.colors.tabActive} size={styles.logo_tiny.height - styles.logo_tiny.padding*2} />
            ) : (
              <Animated.View
                  style={[{
                    // position: 'absolute',
                    bottom: 20, // space from bottombar
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
                    name={icons.plus} color={currentTheme.colors.tabActive} size={48} 
                     />
                
                </Animated.View>
            )
          }
          </TouchableOpacity>
        );
      })}
    </View>
    
    </>
  );
}

// Add
{/* <Animated.View style={[{position: 'absolute', bottom: 64 + 8, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between'}, {opacity: fadeAnim}]}>
  <TouchableOpacity onPress={() => {navigator.navigate(AddItemScreen)}}>
    <Text style={{textAlign: 'center', textAlignVertical: 'center', color: currentTheme.colors.quaternary}}>Add item</Text>
  </TouchableOpacity>
  <TouchableOpacity>
    <Text style={{textAlign: 'center', textAlignVertical: 'center', color: currentTheme.colors.quaternary}}>Secret Feature</Text>
  </TouchableOpacity>
  
</Animated.View> */}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    bottom: 0,
  },
  logo_tiny: {
    width: 54,
    height: 42,
    padding: 6,
    paddingHorizontal: 12,
    // borderWidth: 1,
  },
});

export default CustomTab