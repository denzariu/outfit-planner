import { StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import OutfitOrganizer from './OutfitOrganizer'
import { ClothingItem, Outfit } from '../assets/database/models'
import { DarkTheme, Theme } from '../defaults/ui'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { icons } from '../defaults/custom-svgs'
import RecommendedOutfits from './RecommendedOutfits'
import { arraysEqual } from '../defaults/data-processing'

type OutfitCreationProps = {
  outfit?: Outfit,
  items: ClothingItem[]
}

const OutfitCreation = ({outfit, items}: OutfitCreationProps) => {

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  //Original ids of items
  const [allItemsIds, setAllItemsIds] = useState<number[]>([])

  //Current ids of items
  const [modifiedAllItemsIds, setModifiedAllItemsIds] = useState<number[]>([])
  const [saveVisible, setSaveVisible] = useState<boolean>(true)

  useEffect(() => {
    // console.log({items: items})
  }, [items])

  useEffect(() => {
    // TODO: Any attempt to get items[].id leads to unexpected behavior

    /*
    if (arraysEqual(allIds, modifiedAllItemsIds)){
      console.log('false')
      setSaveVisible(false)
    }  else {
      console.log('true')
      setSaveVisible(true)
    }
    */
  }, [modifiedAllItemsIds])

  
  const saveOutfit = () => {

  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      
      {outfit &&
      <RecommendedOutfits 
        outfit={outfit}
      />
      }
      <View style={{
        height: '99%'
      }}>
        <OutfitOrganizer
          items={items}
          allItemsIds={modifiedAllItemsIds}
          setAllItemsIds={setModifiedAllItemsIds}
        />
      </View>
      {saveVisible &&          
        <TouchableOpacity
          onPress={() => saveOutfit()}
          style={[{
            position: 'absolute',
            bottom: -8, // space from bottombar, TODO: why 13? 
            alignSelf: 'center',
            height: 64,
            width: 64,
            borderRadius: 64,
            backgroundColor: currentTheme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }
        ]}
        >
            <MaterialCommunityIcons 
              style={{alignContent: 'center'}}
              name={icons.save} color={currentTheme.colors.tabActive} size={32} 
            />
        </TouchableOpacity>
      }
    </View>
  )
}

export default OutfitCreation

const styles = StyleSheet.create({})