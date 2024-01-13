import { ActivityIndicator, Alert, Animated, Dimensions, Easing, LayoutAnimation, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui';
import { Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { deleteTable, getDBConnection, tableName_ClothingItem } from '../assets/database/db-service';
import { deleteClothingItem, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import { ClothingItem } from '../assets/database/models';
import ItemSelector from '../components/ItemPicker';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;

  // Display a custom-made menu where the user can select
  // the desired item(s) [ClothingItem | Outfit] to be added

  const [itemSelection, setItemSelection] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('');
  const [itemsToBeAdded, setItemsToBeAdded] = useState<Array<ClothingItem>>();
  
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
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));

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
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));
    setItemSelection(type)
  } 

  const loadOutfit = async () => {
    const db = await getDBConnection()

    await getClothingItems(db, 'extra').then((res) => setExtra(res))
    await getClothingItems(db, 'top').then((res) => setTop(res))
    await getClothingItems(db, 'bottom').then((res) => setBottom(res))
    await getClothingItems(db, 'feet').then((res) => setFeet(res))

  }

  useEffect(() => {
    loadOutfit()
  }, [])
  
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
      {itemSelection != '' && <ItemSelector handleItemSelection={setItemSelection} handleItemsToBeAdded={setItemsToBeAdded} categoryToChooseFrom={itemSelection}/>}

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

const SectionElementName = (props: any) => {
  const {dynamicStyle, currentTheme, addItem, removeItem, field, fieldName} = props || {}
  const category = fieldName[0].toUpperCase() + fieldName.slice(1)

  return (
    
    <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
      <View style={styles.container_category}>

        <Text style={[styles.category_text, dynamicStyle.category_text]}>{category}</Text>

        <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={() => addItem(fieldName, 0)}>
          <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
        </TouchableOpacity>
        
      </View>
      {/* Show the title of each item in the 'Extra' category */}
      { field?.map((item: ClothingItem, index: number) => 
          <View style={[styles.item_container, dynamicStyle.item_container]} key={'title_' + item.adjective + item.subtype + index}>
            <Text 
              numberOfLines={1}
              style={[styles.item_name, dynamicStyle.item_name]}>
                {item.adjective + ' ' + item.subtype[0].toUpperCase() + item.subtype.slice(1)}
            </Text>
            <MaterialCommunityIcons name="minus" color={currentTheme.colors.primary} size={currentTheme.fontSize.m_m} 
              onPress={() => removeItem(item.type, item.id)}
            />
          </View>
      )}
    </View>
  )
}

const SectionElement = (props: any) => {

  const {category, currentView} = props || {}
  const [view, setView] = useState<boolean>(false)

  const eachItem = ({item, index}: any) => {
    const idCategory = item.type == 'extra' ? 0 : item.type == 'top' ? 1 : item.type == 'bottom' ? 2 : 3
    return <EachItem imageUri={item.image} currentView={currentView} index={index} idCategory={idCategory} setView={setView}/>
  }

  return (
    <View style={[styles.container_section]}>
    { view ? 

      category?.map((item: any) => 
        <Pressable 
          onPress={() => setView(!view)}
          style={{flex: 0.8, aspectRatio: 1}}
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
          renderItem={eachItem}
          keyExtractor={(item, index) => 'carousel_' + index + item.image}
        />
      </View>
    }
    </View>
  )
}
const EachItem = (props: any) => {
  
  // Populate props with passed values
  const {imageUri = "", index = 0, setView} = props || {}

  const animRef = useRef(new Animated.Value(0)).current
  
  const startAnimation = useCallback(() => {
    Animated.timing(animRef, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start()
  }, [animRef])

  const stopAnimation = useCallback(() => {
    Animated.timing(animRef, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start()
  }, [animRef])

  return (
    <Pressable onPress={() => setView((currentValue: any) => [!currentValue[0], !currentValue[1], !currentValue[2], !currentValue[3]])}>
      <Animated.View
        key={'image_container_' + index + imageUri}
        style={{ aspectRatio: 1 }}>
          <Animated.Image source={{uri: imageUri}} 
            key={'image_' + index + imageUri}
            style={{ flex: 1 }}/>
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