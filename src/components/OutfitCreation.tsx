import { LayoutAnimation, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import OutfitOrganizer from './OutfitOrganizer'
import { ClothingItem, Outfit, OutfitIcons } from '../assets/database/models'
import { DarkTheme, Theme, swipeAnimation } from '../defaults/ui'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { icons } from '../defaults/custom-svgs'
import RecommendedOutfits from './RecommendedOutfits'
import { saveOutfit } from '../assets/database/db-processing'
import OutfitIconSelect from './OutfitIconSelect'
import { useNavigation } from '@react-navigation/native'

type OutfitCreationProps = {
  outfit?: Outfit,
  items: ClothingItem[],
  selectedDate: string,
}

const OutfitCreation = ({outfit, items, selectedDate}: OutfitCreationProps) => {

  const navigator = useNavigation()
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [outfitName, setOutfitName] = useState<string | undefined>(outfit?.name ?? 'Default Outfit')
  const [outfitIcon, setOutfitIcon] = useState<OutfitIcons>(outfit?.icon ?? 'palette')

  //Current ids of items
  const [modifiedAllItemsIds, setModifiedAllItemsIds] = useState<number[]>([])
  const [saveVisible, setSaveVisible] = useState<boolean>(true)

  //Icon modifier is selected
  const [changeIcon, setChangeIcon] = useState<boolean>(false)

  useEffect(() => {
    LayoutAnimation.configureNext(swipeAnimation)
  }, [changeIcon])

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

  const dynamicStyles = StyleSheet.create({
    outfit_icon: {backgroundColor: currentTheme.colors.primary},
    outfit_name: {backgroundColor: currentTheme.colors.primary, color: currentTheme.colors.quaternary}
  })
  

  return (
    <View
      style={{
        flex: 1,
        marginVertical: Theme.spacing.page
      }}
    >
      {/* Recommended outfits to select from OR Outfit Icon selector*/}
      {(!changeIcon && outfit) ?
        <RecommendedOutfits 
          outfit={outfit}
        />
        :
        <OutfitIconSelect
          currentIcon={outfitIcon}
          setOutfitIcon={setOutfitIcon}
        />
      }

      <View style={{
        // backgroundColor: currentTheme.colors.primary,
        marginBottom: Theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: Theme.spacing.s
      }}>
        <TouchableOpacity
          onPress={() => setChangeIcon(prev => !prev)}
          style={[styles.outfit_icon, dynamicStyles.outfit_icon]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={outfitIcon}
            size={Theme.fontSize.l_s}
            color={currentTheme.colors.quaternary}
          />
        </TouchableOpacity>
        <TextInput
          selectTextOnFocus
          numberOfLines={1}
          onChangeText={(text) => setOutfitName(text)}
          placeholder={'Outfit Name'}
          value={outfitName}
          style={[styles.outfit_name, dynamicStyles.outfit_name]}
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
          onPress={() => {
            saveOutfit(
              //Updated outfit
              {id: outfit? outfit.id : undefined, name: outfitName ?? 'Default Outfit', icon: outfitIcon}, 
              modifiedAllItemsIds, 
              selectedDate
            )
            //TODO: set outfit save behavior: go back or show save message
          }}
          style={[{
            position: 'absolute',
            bottom: -8,
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

const styles = StyleSheet.create({
  outfit_name: {
    flex: 1,
    borderRadius: Theme.spacing.ms,

    fontSize: Theme.fontSize.m_l,
    fontWeight: '200',

    padding: Theme.spacing.ms,
    paddingLeft: Theme.spacing.m
  },

  outfit_icon: {
    padding: Theme.spacing.ms,
    borderRadius: Theme.spacing.s,
  }
})

export default OutfitCreation