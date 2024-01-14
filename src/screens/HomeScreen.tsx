import { ActivityIndicator, Alert, Animated, Dimensions, Easing, LayoutAnimation, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DarkTheme, Theme, mainAnimation } from '../defaults/ui';
import { Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { deleteTable, getDBConnection, tableName_ClothingItem } from '../assets/database/db-service';
import { deleteClothingItem, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import { ClothingItem } from '../assets/database/models';
import ItemSelector from '../components/ItemPicker';
import { useNavigation } from '@react-navigation/native';
import { icons } from '../defaults/custom-svgs';
import { FlatList } from 'react-native-gesture-handler';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;

  // Display a custom-made menu where the user can select
  // the desired item(s) [ClothingItem | Outfit] to be added

  const [itemSelection, setItemSelection] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('');
  const [categoryToBeAddedTo, setCategoryToBeAddedTo] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('')
  const [itemsToBeAdded, setItemsToBeAdded] = useState<ClothingItem[]>([]);
  
  // Outfit manager
  const [currentOutfit, setCurrentOutfit] = useState<number>(0)
  const [outfits, setOutfits] = useState<Array<ClothingItem[]>>([])

  // Current items shown
  const [extra, setExtra] = useState<ClothingItem[]>([]);
  const [top, setTop] = useState<ClothingItem[]>([]);
  const [bottom, setBottom] = useState<ClothingItem[]>([]);
  const [feet, setFeet] = useState<ClothingItem[]>([]);


  // Remove item, by tapping '-'
  const removeItem = (type: string, id: number | null) => {
    LayoutAnimation.configureNext(mainAnimation);

    switch(type) {
      case 'extra':
        setExtra(extra.filter((item) => item.id != id))
        break;
      case 'top':
        setTop(top.filter((item) => item.id != id))
        break;
      case 'bottom':
        setBottom(bottom.filter((item) => item.id != id))
        break;
      case 'feet':
        setFeet(feet.filter((item) => item.id != id))
        break;
    }
  } 

  // Add item, by tapping '+'
  const addItem = (type: typeof itemSelection) => {
    LayoutAnimation.configureNext(mainAnimation);
    setItemSelection(type)
  } 

  const loadOutfit = async () => {
    // const db = await getDBConnection()

    // await getClothingItems(db, 'extra').then((res) => setExtra(res))
    // await getClothingItems(db, 'top').then((res) => setTop(res))
    // await getClothingItems(db, 'bottom').then((res) => setBottom(res))
    // await getClothingItems(db, 'feet').then((res) => setFeet(res))

  }

  useEffect(() => {
    loadOutfit()
  }, [])
  
  // If there are items to be added, add them
  useEffect(() => {
    console.log('tobeadded', itemsToBeAdded)
    if (itemsToBeAdded?.length) {
      switch (categoryToBeAddedTo) {
        case 'all':
          //TODO: Filter based on clothing type
          break;
        case 'extra':
          setExtra((prev) => {return prev.concat(itemsToBeAdded)})
          break;
        case 'top':
          setTop((prev) => {return prev.concat(itemsToBeAdded)})
          break;
        case 'bottom':
          setBottom((prev) => {return prev.concat(itemsToBeAdded)})
          break;
        case 'feet':
          setFeet((prev) => {return prev.concat(itemsToBeAdded)})
          break;
      }
      setItemsToBeAdded([])
    }
  }, [itemsToBeAdded?.length])

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container_clothing: {backgroundColor: 'transparent', borderColor: currentTheme.colors.tertiary},
    container_items_category: {backgroundColor: currentTheme.colors.secondary},
    category_text: {color: currentTheme.colors.quaternary},
    add_item: {backgroundColor: currentTheme.colors.quaternary},
    item_container: {backgroundColor: currentTheme.colors.quaternary},
    item_name: {color: currentTheme.colors.primary}
  })


  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      {itemSelection != '' 
      && <ItemSelector 
            handleItemsToBeAdded={setItemsToBeAdded} 
            handleCategoryToBeAddedTo={setCategoryToBeAddedTo}
            handleItemSelection={setItemSelection} 
            categoryToChooseFrom={itemSelection}
          />
      }
      <AnimatedGradient props={fadeAnimation}/>
      <Text style={[styles.header, dynamicStyle.textHeader]}>
        Today's Outfit
      </Text>
      <View style={styles.container}>
        <View style={[styles.container_clothing, dynamicStyle.container_clothing]}>
          <SectionElement index={0} category={extra} />
          <SectionElement index={1} category={top} />
          <SectionElement index={2} category={bottom} />
          <SectionElement index={3} category={feet} />
        </View>
        <View style={styles.container_items}>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={() => addItem('extra')} removeItem={removeItem} fieldName={'extra'} field={extra}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={() => addItem('top')} removeItem={removeItem} fieldName={'top'} field={top}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={() => addItem('bottom')} removeItem={removeItem} fieldName={'bottom'} field={bottom}/>
          <SectionElementName dynamicStyle={dynamicStyle} currentTheme={currentTheme} addItem={() => addItem('feet')} removeItem={removeItem} fieldName={'feet'} field={feet}/>          
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

type SectionElementNameProps = {
  dynamicStyle: any, 
  currentTheme: any, 
  addItem: (type: "" | "all" | "extra" | "top" | "bottom" | "feet") => void, 
  removeItem: (type: string, id: number | null) => void, 
  field: ClothingItem[], 
  fieldName: "" | "all" | "extra" | "top" | "bottom" | "feet",
}
const SectionElementName = ({dynamicStyle, currentTheme, addItem, removeItem, field, fieldName}: SectionElementNameProps) => {
  const category = fieldName[0].toUpperCase() + fieldName.slice(1)

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
        renderItem={(item) => 
           <View 
              style={[styles.item_container, dynamicStyle.item_container]}
            >
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
  category: ClothingItem[]
}

const SectionElement = ({index, category}: SectionElementProps) => {

  const [view, setView] = useState<boolean>(false)

  return (
    <View style={[styles.container_section]}>
    { view ? 
      category?.map((item) => 
        <Pressable 
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
          renderItem={(item) => <EachItem imageUri={item.item.image} handldeView={setView} aspectRatio={item.item.aspect_ratio}/>}
          keyExtractor={(item, index) => 'carousel_' + index + item.image}
        />
      </View>
    }
    </View>
  )
}

type EachItemProps = {
  imageUri: string,
  handldeView: React.Dispatch<React.SetStateAction<boolean>>,
  aspectRatio: number
}
const EachItem = ({imageUri, handldeView, aspectRatio}: EachItemProps) => {

  return (
    <Pressable onPress={() => handldeView((currentValue) => !currentValue)}>
      {/* TODO: better formula */}
      <Animated.View style={{ flex: 1/aspectRatio, aspectRatio: aspectRatio }}>
          <Animated.Image 
            source={{uri: imageUri}} 
            style={{ flex: 1 }}
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
  
  header: {
    alignSelf: 'flex-start',
    fontSize: Theme.fontSize.l_s,
    marginVertical: Theme.spacing.m,
    marginTop: Theme.spacing.l,
    fontWeight: '200'
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Theme.spacing.m,
    height: '80%'
  },

  container_clothing: {
    flex: 0.52,
    borderRadius: Theme.spacing.m,
    borderWidth: Theme.spacing.xxs,
    paddingVertical: Theme.spacing.xxs
  },

  container_section: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  container_items: {
    flex: 0.48,
    display: 'flex',
    flexDirection: 'column',
    rowGap: Theme.spacing.s,

  },

  container_items_category: {
    flex: 0.25,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: Theme.spacing.m,
    paddingHorizontal: Theme.spacing.s,
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