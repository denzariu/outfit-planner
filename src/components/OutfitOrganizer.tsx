import { Animated, FlatList, Image, LayoutAnimation, Pressable, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SvgXml } from 'react-native-svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ClothingItem, Outfit } from '../assets/database/models'
import { icons } from '../defaults/custom-svgs'
import { getCategoryName } from '../defaults/data'
import { DarkTheme, Theme, swipeAnimation } from '../defaults/ui'
import { getDBConnection } from '../assets/database/db-service'
import ItemPicker from './ItemPicker'

type OutfitOrganizerProps = {
  items: ClothingItem[],
  setAllItemsIds: React.Dispatch<React.SetStateAction<number[]>>,
  allItemsIds: number[]
  outfit?: Outfit,

  //styling
  transparent?: boolean
}

const OutfitOrganizer = ({items, setAllItemsIds, allItemsIds, transparent}: OutfitOrganizerProps) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  useEffect(() => {
    setCategoryToBeAddedTo('all');
    setItemsToBeAdded(items);
  }, [items])

  // Current items shown
  const [extra, setExtra] = useState<ClothingItem[]>([]);
  const [top, setTop] = useState<ClothingItem[]>([]);
  const [bottom, setBottom] = useState<ClothingItem[]>([]);
  const [feet, setFeet] = useState<ClothingItem[]>([]);

  // Display a custom-made menu where the user can select
  // the desired item(s) [ClothingItem | Outfit] to be added

  const [categoryToBeAddedTo, setCategoryToBeAddedTo] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('')
  const [itemsToBeAdded, setItemsToBeAdded] = useState<ClothingItem[]>([]);
  const [itemSelection, setItemSelection] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('');

    // Whenever items are added to a category, add their IDs to the list
  useEffect(() => {
    const allIds = extra.concat(top, bottom, feet).map((item: ClothingItem) => item.id ? item.id : -1)
    setAllItemsIds(allIds.length ? allIds : [-1])
    console.log('Set Items')
  }, [extra, top, bottom, feet])

  
  
  // Item array updater
  useEffect(() => {
    console.log('Adding Items')

    if (categoryToBeAddedTo != '') {

      switch (categoryToBeAddedTo) {
        case 'all':
          setExtra(() => itemsToBeAdded.filter(item => item.type == 'extra'))
          setTop(() => itemsToBeAdded.filter(item => item.type == 'top'))
          setBottom(() => itemsToBeAdded.filter(item => item.type == 'bottom'))
          setFeet(() => itemsToBeAdded.filter(item => item.type == 'feet'))
          break;
        case 'extra':
          // Array is now replaced, so unselected items will also be removed
          setExtra(itemsToBeAdded)
          break;
        case 'top':
          setTop(itemsToBeAdded)
          break;
        case 'bottom':
          setBottom(itemsToBeAdded)
          break;
        case 'feet':
          setFeet(itemsToBeAdded)
          break;
      }
      setCategoryToBeAddedTo('')
      setItemsToBeAdded([])
    }
  }, [itemsToBeAdded])
  // Remove item, by tapping '-'
  const removeItem = (type: string, id: number | null) => {
    LayoutAnimation.configureNext(swipeAnimation);

    switch(type) {
      case 'extra':
        setExtra(prev => prev.filter((item) => item.id != id))
        break;
      case 'top':
        setTop(prev => prev.filter((item) => item.id != id))
        break;
      case 'bottom':
        setBottom(prev => prev.filter((item) => item.id != id))
        break;
      case 'feet':
        setFeet(prev => prev.filter((item) => item.id != id))
        break;
    }
  } 

  // Add item, by tapping '+'
  const addItem = (type: typeof itemSelection) => {
    LayoutAnimation.configureNext(swipeAnimation);
    setItemSelection(type)
  } 

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    text_header: {color: currentTheme.colors.tertiary},
    container_clothing: {backgroundColor: transparent ? 'transparent' : currentTheme.colors.background, borderColor: currentTheme.colors.tertiary},
    container_items_category: {backgroundColor: currentTheme.colors.secondary},
    category_text: {color: currentTheme.colors.quaternary},
    add_item: {backgroundColor: currentTheme.colors.quaternary},
    item_container: {backgroundColor: currentTheme.colors.quaternary},
    item_name: {color: currentTheme.colors.primary}
  })

  return (
    <>
    {itemSelection != ''
      && <ItemPicker 
            handleItemsToBeAdded={setItemsToBeAdded} 
            handleCategoryToBeAddedTo={setCategoryToBeAddedTo}
            alreadySelectedItems={allItemsIds}
            handleItemSelection={setItemSelection} 
            categoryToChooseFrom={itemSelection}
          />
    }
    <View style={styles.container}>
        <View style={[styles.container_clothing, dynamicStyle.container_clothing]}>
          <SectionElement index={0} colorDisabled={currentTheme.colors.tertiary} addItem={addItem} category={extra} categoryName={'extra'} />
          <SectionElement index={1} colorDisabled={currentTheme.colors.tertiary} addItem={addItem} category={top} categoryName={'top'} />
          <SectionElement index={2} colorDisabled={currentTheme.colors.tertiary} addItem={addItem} category={bottom} categoryName={'bottom'} />
          <SectionElement index={3} colorDisabled={currentTheme.colors.tertiary} addItem={addItem} category={feet} categoryName={'feet'} />
        </View>
        <View style={styles.container_items}>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={addItem} removeItem={removeItem} fieldName={'extra'} field={extra}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={addItem} removeItem={removeItem} fieldName={'top'} field={top}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={addItem} removeItem={removeItem} fieldName={'bottom'} field={bottom}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={addItem} removeItem={removeItem} fieldName={'feet'} field={feet}/>          
        </View>
      </View>
    </>
  )
}

export default OutfitOrganizer


type SectionElementNameProps = {
  dynamicStyle: any, 
  currentTheme: any, 
  addItem: (type: "" | "all" | "extra" | "top" | "bottom" | "feet") => void, 
  removeItem: (type: string, id: number | null) => void, 
  field: ClothingItem[], 
  fieldName: "" | "all" | "extra" | "top" | "bottom" | "feet",
}
const SectionElementName = ({dynamicStyle, currentTheme, addItem, removeItem, field, fieldName}: SectionElementNameProps) => {
  const [category, setCategory] = useState('')

  useEffect(() => {
    setCategory(getCategoryName(fieldName)) 
  }, [fieldName])

  return (
    
    <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
      <View style={styles.container_category}>
        <Text style={[styles.category_text, dynamicStyle.category_text]}>
          {category}
        </Text>
        <TouchableOpacity 
          style={[styles.add_item, dynamicStyle.add_item]} 
          onPress={() => addItem(fieldName)}
        >
          <MaterialCommunityIcons 
            name={icons.plus} 
            color={currentTheme.colors.tertiary} 
            size={currentTheme.fontSize.m_m} 
            />
        </TouchableOpacity>
      </View>
      {/* Show the title of each item in the category */}
      <FlatList
        data={field}
        keyExtractor={(item, index) => 'item_name_' + item.id + item.adjective + '_at_' + index}
        renderItem={ item => 
           <View style={[styles.item_container, dynamicStyle.item_container]}>
              <Text 
                numberOfLines={1}
                style={[styles.item_name, dynamicStyle.item_name]}
              >
                {item.item.adjective + ' ' + item.item.subtype[0].toUpperCase() + item.item.subtype.slice(1)}
              </Text>
              <MaterialCommunityIcons 
                name={icons.minus} 
                color={currentTheme.colors.secondary} 
                size={currentTheme.fontSize.m_m} 
                onPress={() => removeItem(item.item.type, item.item.id)}
              />
          </View>
        }
      />
    </View>
  )
}

type SectionElementProps = {
  index: number, 
  category: ClothingItem[],
  categoryName: "extra" | "top" | "bottom" | "feet",
  colorDisabled: string,
  addItem: (type: "" | "all" | "extra" | "top" | "bottom" | "feet") => void, 
}

const SectionElement = ({index, category, categoryName, colorDisabled, addItem}: SectionElementProps) => {

  const [view, setView] = useState<boolean>(false)
  return (
    <View style={[styles.container_section]}>
    {( view  || category.length == 1 ) ? 
      category?.map((item) => 
        <Pressable 
          key={'all_items_' + index + '_id_' + item.id}
          onPress={() => setView(!view)}
          style={{flex: item.aspect_ratio - 0.08, aspectRatio: item.aspect_ratio}}
        >
          <Image source={{uri: item.image}} style={{flex: 1}}/> 
        </Pressable>
        )
      :
      <View style={styles.container_carousel}>
        <Animated.FlatList 
          data={category}
          style={{flex: 1, alignSelf: 'center'}}
          contentContainerStyle={{paddingHorizontal: Theme.spacing.m, columnGap: 8}}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          snapToAlignment={'center'}
          renderItem={ item => 
            <EachItem 
              imageUri={item.item.image} 
              handleView={setView} 
              aspectRatio={item.item.aspect_ratio}
            />
          }
          keyExtractor={(item, index) => 'carousel_' + index + '_id_' + item.id}
          ListEmptyComponent={
            <TouchableOpacity
              onPress={() => addItem(categoryName)}
              style={{
                flex: 1, 
                justifyContent: 'center', 
                opacity: 0.4
              }}
            >
            {categoryName == 'bottom' ? 
                <SvgXml xml={icons.bottom} 
                  fill={colorDisabled} 
                  height={Theme.fontSize.l_m * 2} 
                  width={Theme.fontSize.l_m * 2}
                />
              : <MaterialCommunityIcons name={categoryName == 'extra' ? icons.extra : categoryName == 'top' ? icons.top : icons.feet} 
                  color={colorDisabled} 
                  size={Theme.fontSize.l_m * 2} 
                />
            }
            </TouchableOpacity>
          }
        />
      </View>
    }
    </View>
  )
}

type EachItemProps = {
  imageUri: string,
  handleView: React.Dispatch<React.SetStateAction<boolean>>,
  aspectRatio: number
}
const EachItem = ({imageUri, handleView, aspectRatio}: EachItemProps) => {

  return (
    <Pressable onPress={() => handleView((currentValue) => !currentValue)}>
      {/* TODO: better formula */}
      <Animated.View style={{ flex: 1}}>
          <Animated.Image 
            source={{uri: imageUri}} 
            style={{ flex: 0.9/aspectRatio, aspectRatio: aspectRatio  }}
          />
      </Animated.View>
    </Pressable>
  )
}


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

  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Theme.spacing.s,
    height: '80%'
  },

  container_clothing: {
    flex: 0.5,
    borderRadius: Theme.spacing.m,
    borderWidth: Theme.spacing.xxs,
    paddingVertical: Theme.spacing.xs
  },

  container_section: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  container_items: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'column',
    rowGap: Theme.spacing.s,

  },

  container_items_category: {
    // maxHeight: '25%', //variable height
    flex: 0.25,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: Theme.spacing.xxs 
  },

  container_category: {
    // flex: 0.25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },

  category_text: {
    flex: 0.75,
    fontSize: Theme.fontSize.m_l,
    paddingLeft: Theme.spacing.xxs,
    fontWeight: '200' 
  },

  add_item: {
    alignSelf: 'center',
    padding: Theme.spacing.xs,
    borderRadius: Theme.spacing.m
  },

  item_container: {
    marginVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  item_name: {
    // textAlign: 'center',
    verticalAlign: 'middle',
    fontSize: Theme.fontSize.s_m,
    flex: 1
  },

  container_carousel: {
    flex: 1,
    justifyContent: 'center',
    // Padding between the clothing images categories
    paddingVertical: Theme.spacing.xxs,
    alignItems:'center'
  }
})