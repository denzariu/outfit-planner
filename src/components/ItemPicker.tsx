import { Alert, FlatList, LayoutAnimation, RefreshControl, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ClothingItem } from '../assets/database/models'
import { useIsFocused } from '@react-navigation/native'
import { DarkTheme, Theme } from '../defaults/ui'
import { getDBConnection } from '../assets/database/db-service'
import { getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { icons } from '../defaults/custom-svgs'
import ItemShowcase from './ItemShowcase'


type ItemSelectorProps = {
  handleItemsToBeAdded: React.Dispatch<React.SetStateAction<ClothingItem[] | undefined>>
  categoryToChooseFrom: 'extra' | 'top' | 'bottom' | 'feet' | 'all' | ''
  handleItemSelection:  React.Dispatch<React.SetStateAction<'extra' | 'top' | 'bottom' | 'feet' | 'all' | ''>>

}

const ItemPicker = ({handleItemSelection, handleItemsToBeAdded, categoryToChooseFrom}: ItemSelectorProps) => {

  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [selectedType, setSelectedType] = useState<typeof categoryToChooseFrom>()
  const [itemsSelected, setItemsSelected] = useState<Array<number | null>>([]);
  const [items, setItems] = useState<ClothingItem[] | undefined>()
  
  const [refreshing, setRefreshing] = useState(false);

  const dynamicStyle = StyleSheet.create({
    list_style: {backgroundColor: currentTheme.colors.background},
    list_empty_text: {color: currentTheme.colors.tertiary},
    button: {backgroundColor: currentTheme.colors.secondary, shadowColor: currentTheme.colors.foreground, borderColor: currentTheme.colors.tertiary},
    button_text: {color: currentTheme.colors.background},
  })

  useEffect(() => {
    if (isFocused) {
      // Gather data
      loadItems()
    }
  }, [isFocused])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadItems = async () => {
    console.log('load')

    if (categoryToChooseFrom != '') {
      const db = await getDBConnection()
      await getClothingItems(db, categoryToChooseFrom).then((res) => {
        setSelectedType(categoryToChooseFrom), setItems(res), console.log(res)
      })
    }
  }

  const close = () => {
    console.log('closed')
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));
    handleItemSelection('')
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => close()}
    >
      <View style={styles.absoluteView}>
        <View style={styles.list_container}>

          <FlatList
              data={items}
              // TODO: Move this to 'styles'
              style={[styles.list_style, dynamicStyle.list_style]}
              contentContainerStyle={[styles.container_content]}
              columnWrapperStyle={[styles.container_wrapper]}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                  colors={[currentTheme.colors.tertiary, currentTheme.colors.secondary]}
                />
              }
              keyExtractor={(item) => item.id ? 'key_items_listed_' + item.id.toString() : 'key_items_listed_0'}
              ListEmptyComponent={
                <View style={[styles.list_empty, {opacity: 0.7}]}>
                  <MaterialCommunityIcons 
                    name={icons.missing} 
                    color={currentTheme.colors.tertiary} 
                    size={currentTheme.fontSize.l_l * 2} 
                  />
                  <Text style={[styles.list_empty_text, dynamicStyle.list_empty_text]}>No items</Text>
                </View>
              }
              renderItem={(info) => 
                <ItemShowcase 
                  item={info.item} 
                  index={info.index} 
                  currentTheme={currentTheme} 
                  aspectRatio={1} 
                  selectOnly={true}
                  setSelectedItems={setItemsSelected}
                  selectedItems={itemsSelected}
                />
              }
            >
            </FlatList>
        </View>
        {itemsSelected.length > 0 &&
          <TouchableOpacity  
            style={[styles.button, dynamicStyle.button]}
            onPress={() => Alert.alert('pressed')}
            children={<Text style={[styles.button_text, dynamicStyle.button_text]}>Add to Outfit</Text>}
          />
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ItemPicker

const styles = StyleSheet.create({
  absoluteView: {
    zIndex: 25,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.background + '88',
    padding: Theme.spacing.page,
    justifyContent: 'flex-end',
  },

  list_container: {
    maxHeight: '80%',
  },

  list_style: { 
    paddingHorizontal: Theme.spacing.s,
    borderRadius: Theme.spacing.m, 
    elevation: Theme.spacing.elevation,
  },

  container_content: {
    gap: Theme.spacing.s, // Vertical gap
    paddingVertical: Theme.spacing.s,
  },

  container_wrapper: {
    justifyContent: 'space-evenly',
    // gap: Theme.spacing.xxs, // Horizontal gap,
  },

  list_empty: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Theme.spacing.s
  },

  list_empty_text: {
    fontSize: Theme.fontSize.m_m
  },

  button: {
    position: 'relative',
    bottom: 0,
    paddingVertical: Theme.spacing.m,
    borderRadius: Theme.spacing.l,
    marginVertical: Theme.spacing.m,

    borderWidth: Theme.spacing.xxs,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: Theme.spacing.elevation,
  },

  button_text: {
    fontSize: Theme.fontSize.m_m,
    fontWeight: '500',
    alignSelf: 'center',
  }
})