import { FlatList, LayoutAnimation, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Outfit, OutfitIcons } from '../assets/database/models'
import { DarkTheme, Theme, swipeAnimation } from '../defaults/ui'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

type OutfitIconSelect = {
  currentIcon?: OutfitIcons,
  setOutfitIcon: React.Dispatch<React.SetStateAction<OutfitIcons>> 
}

const OutfitIconSelect = ({currentIcon, setOutfitIcon}: OutfitIconSelect) => {
  
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [icons] = useState<any[]>([
    'glass-cocktail', 'school', 'briefcase', 'microphone', 'camera', 'palette', 'monitor', 'beach', 'umbrella', 'bag-suitcase', 'baguette', 'shopping'
  ])
  const [showIcons, setShowIcons] = useState<boolean>(false)

  useEffect(() => {
    toggleList()
  }, [])

  const toggleList = () => {
    LayoutAnimation.configureNext(swipeAnimation)
    setShowIcons(prev => !prev)
  }

  const dynamicStyles = StyleSheet.create({
    container: { borderColor: currentTheme.colors.secondary },
    button: { backgroundColor: currentTheme.colors.primary },
    button_text: { color: currentTheme.colors.quaternary },
    list: { backgroundColor: currentTheme.colors.primary }
  })

  return (
    <View
      style={[styles.container, dynamicStyles.container]}
      >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.primary}
      />
      <TouchableOpacity style={[styles.button, dynamicStyles.button]}
        activeOpacity={0.9}
        onPress={() => toggleList()}
      >
        <Text style={[styles.button_text, dynamicStyles.button_text]}>
          Outfit Icons
        </Text>
      </TouchableOpacity>
      
      {showIcons &&
        <FlatList
          centerContent
          style={dynamicStyles.list}
          contentContainerStyle={styles.list_content}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={icons}
          renderItem={i => 

            // The square-shaped recommendation (outfit)
            <TouchableOpacity 
              onPress={() => {
                setOutfitIcon(i.item)
                toggleList()
              }}
              activeOpacity={0.8}
              style={{
                padding: Theme.spacing.xxs,
                borderWidth: Theme.spacing.xxs,
                borderRadius: Theme.spacing.s,
                borderColor: currentTheme.colors.secondary,
                backgroundColor: (currentIcon == i.item) ? currentTheme.colors.primary : currentTheme.colors.quaternary,
                height: 100,
                width: 100,
                
                alignItems: 'center',
                justifyContent: 'center',
                
            }}>
              <MaterialCommunityIcons
                name={i.item}
                size={Theme.fontSize.l_m}
                color={(currentIcon == i.item) ? currentTheme.colors.quaternary : currentTheme.colors.primary}
              />
              
            </TouchableOpacity>
            
          }
        />
      }
    </View>
  )
}

export default OutfitIconSelect

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.s,
    borderWidth: Theme.spacing.xs,

    marginHorizontal: -Theme.spacing.page - Theme.spacing.s,
    marginTop: -Theme.spacing.m - Theme.spacing.s,

    borderTopWidth: 0,
  },

  button: {
    paddingVertical: Theme.spacing.xs,
  },

  button_text: {
    fontWeight: '200',
    textAlign: 'center'
  },

  list_content: {
    columnGap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.s
  }
})