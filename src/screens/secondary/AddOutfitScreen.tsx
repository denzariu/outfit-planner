import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../../defaults/ui';
import OutfitCreation from '../../components/OutfitCreation';
import { getClothingItems } from '../../assets/database/db-operations/db-operations-clothingitem';
import { getDBConnection } from '../../assets/database/db-service';
import { ClothingItem } from '../../assets/database/models';

type AddOutfitProps = {
  navigation: any,
  route: {
    params: {
      date?: string,
      items_ids?: number[]
    }
  }
}
const AddOutfitScreen = ({navigation, route}: AddOutfitProps) => {

  const {date, items_ids} = route.params || []

  console.log(date, items_ids)
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    text_header: {color: currentTheme.colors.tertiary},
  })

  const [items, setItems] = useState<ClothingItem[]>([])

  //There needs to be a conversion of items_ids to ClothingItem[]
  useEffect(() => {
    if(items_ids) {
      getDBConnection().then(db =>
        getClothingItems(db, undefined, items_ids).then(result => 
          setItems(result)  
        )
      )
    }
  }, [items_ids])
  
  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>      
      
      <OutfitCreation
        items={items}
        selectedDate={date ?? ''}
        outfit={{icon: 'bag-suitcase', name: 'Outfit Name'}}
      />

    </SafeAreaView>
  )
}

export default AddOutfitScreen

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: Theme.spacing.page,
  },

  header_container: {
    marginVertical: Theme.spacing.m,
    marginTop: Theme.spacing.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  header: {
    alignSelf: 'flex-start',
    fontSize: Theme.fontSize.l_s,
    fontWeight: '200'
  },

})