import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import OutfitOrganizer from './OutfitOrganizer'
import { ClothingItem, Outfit, OutfitIcons } from '../assets/database/models'
import { DarkTheme, Theme } from '../defaults/ui'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { icons } from '../defaults/custom-svgs'
import RecommendedOutfits from './RecommendedOutfits'
import { saveOutfit } from '../assets/database/db-processing'

type OutfitCreationProps = {
  outfit?: Outfit,
  items: ClothingItem[],
  selectedDate: string,
}

const OutfitCreation = ({outfit, items, selectedDate}: OutfitCreationProps) => {

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [outfitName, setOutfitName] = useState<string | undefined>(outfit?.name ?? 'Default Outfit')
  const [outfitIcon, setOutfitIcon] = useState<OutfitIcons>(outfit?.icon ?? 'palette')

  //Current ids of items
  const [modifiedAllItemsIds, setModifiedAllItemsIds] = useState<number[]>([])
  const [saveVisible, setSaveVisible] = useState<boolean>(true)


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

  
  

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* Recommended outfits to select from */}
      {outfit &&
        <RecommendedOutfits 
          outfit={outfit}
        />
      }

      {/* TODO: Outfit icon / name */}
      <View style={{
        backgroundColor: currentTheme.colors.primary,
        borderRadius: Theme.spacing.m,
        marginBottom: Theme.spacing.m,
        paddingHorizontal: Theme.spacing.m
      }}>
        <TextInput
          selectTextOnFocus
          numberOfLines={1}
          onChangeText={(text) => setOutfitName(text)}
          placeholder={'Outfit Name'}
          value={outfitName}
        />
      </View>

      {/* Current clothing items showcase */}
      <OutfitOrganizer
        items={items}
        allItemsIds={modifiedAllItemsIds}
        setAllItemsIds={setModifiedAllItemsIds}
      />
      

      {/* Save (changes to) outfit */}
      {saveVisible &&          
        <TouchableOpacity
          onPress={() => saveOutfit({id: outfit? outfit.id : undefined, name: outfitName ?? 'Default Outfit', icon: outfitIcon}, modifiedAllItemsIds, selectedDate)}
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
              name={icons.save} color={currentTheme.colors.tabActive} size={Theme.fontSize.l_s} 
            />
        </TouchableOpacity>
      }
    </View>
  )
}

export default OutfitCreation