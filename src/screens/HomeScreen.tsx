import { ActivityIndicator, Alert, Animated, Dimensions, Easing, LayoutAnimation, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DarkTheme, Theme, mainAnimation } from '../defaults/ui';
import { Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { deleteTable, getDBConnection, tableName_ClothingItem } from '../assets/database/db-service';
import { deleteClothingItem, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import { ClothingItem, Outfit } from '../assets/database/models';
import ItemPicker from '../components/ItemPicker';
import { useNavigation } from '@react-navigation/native';
import { icons } from '../defaults/custom-svgs';
import { FlatList } from 'react-native-gesture-handler';
import { getCategoryName } from '../defaults/data';
import { addItemsToOutfit, addOutfitsOnDate, createOutfit, deleteAllItemsFromOutfit, deleteOutfit, getOutfitItems, getOutfitItemsTable, getOutfitPlannerTable, getOutfits, getOutfitsOnDate } from '../assets/database/db-operations/db-operations-outfit';
import moment, { Moment } from 'moment'
import DatePicker from 'react-native-date-picker';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;

  // Display a custom-made menu where the user can select
  // the desired item(s) [ClothingItem | Outfit] to be added

  const [itemSelection, setItemSelection] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('');
  const [categoryToBeAddedTo, setCategoryToBeAddedTo] = useState<'all' | 'extra' | 'top' | 'bottom' | 'feet' | ''>('')
  const [itemsToBeAdded, setItemsToBeAdded] = useState<ClothingItem[]>([]);

  // Date picker
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date);
  const [intDate, setIntDate] = useState<string>('1970-01-01');
  const [headerTitle, setHeaderTitle] = useState<string>("Today's Outfit")
  
  // Outfit manager
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({name: 'Default'})

  // Current items shown
  const [extra, setExtra] = useState<ClothingItem[]>([]);
  const [top, setTop] = useState<ClothingItem[]>([]);
  const [bottom, setBottom] = useState<ClothingItem[]>([]);
  const [feet, setFeet] = useState<ClothingItem[]>([]);
  const [allItemsIds, setAllItemsIds] = useState<Array<number>>([])

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

  // TODO: Feature in testing, default / favourite outfits + outfit selector coming soon
  const saveOutfit = async () => {
    const db = await getDBConnection()
    
    if (!currentOutfit || !currentOutfit.id) {
      const insertId = await createOutfit(db, 'NameNotSetYet')
      await addItemsToOutfit(db, allItemsIds, {id: insertId, name: 'NameNotSetYet'})
      await addOutfitsOnDate(db, [insertId], intDate)
    }
    else {
      await deleteAllItemsFromOutfit(db, currentOutfit.id)
      await addItemsToOutfit(db, allItemsIds, currentOutfit)

    }
    console.log('Added Items to Outfit')

  }
  
  // TODO: Feature in testing
  const loadOutfit = async () => {
    const db = await getDBConnection()

    LayoutAnimation.configureNext(mainAnimation);
  
    if (currentOutfit?.id) 
      await getOutfitItems(db, currentOutfit.id)
        .then(res => {
          console.log({outfit_items: res})
          
          setCategoryToBeAddedTo('all')
          setItemsToBeAdded(res)
        }) 

    else {
      console.log('LOADING NO OUTFIT ID')
      setCategoryToBeAddedTo('all')
      setItemsToBeAdded([])
    }
  }

  const updateOutfit = async (intFullDate: string) => {
    const db = await getDBConnection()

    console.log(intFullDate)

    await getOutfitsOnDate(db, intFullDate)
    .then( results => {
      // Not necessary to check if outfit exists yet
      // TODO: add all outfit options for the day
      setCurrentOutfit(results[0])
    })
  }

  // Whenever the outfit changes, update the items
  useEffect(() => {
    loadOutfit()
  }, [currentOutfit])

  // Whenever the date changes, update the outfit
  useEffect(() => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) ;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    
    setIntDate(year + '-' + month + '-' + day)
    updateOutfit(year + '-' + month + '-' + day)

    const today = new Date()

    //TODO
    setHeaderTitle(  
      date.setHours(0,0,0,0) == today.setHours(0,0,0,0) ? 
        "Today's Outfit"
      : date.setHours(0,0,0,0) == today.setHours(0,0,0,0) ? 
        "Tomorrow's Outfit"
      : date.setHours(0,0,0,0) == today.setHours(0,0,0,0)? 
        "Yesterday's Outfit"
      : 'Outfit of ' + date.toLocaleDateString() 
      
    )
  }, [date])

  // Whenever items are added to a category, add their IDs to the list
  useEffect(() => {
    setAllItemsIds(extra.concat(top, bottom, feet).map((item: ClothingItem) => item.id ? item.id : -1))
  }, [extra, top, bottom, feet])
  
  // Item array updater
  useEffect(() => {
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

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    text_header: {color: currentTheme.colors.tertiary},
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
      && <ItemPicker 
            handleItemsToBeAdded={setItemsToBeAdded} 
            handleCategoryToBeAddedTo={setCategoryToBeAddedTo}
            alreadySelectedItems={allItemsIds}
            handleItemSelection={setItemSelection} 
            categoryToChooseFrom={itemSelection}
          />
      }
      <AnimatedGradient props={fadeAnimation}/>

      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.text_header]}>
          {headerTitle}
        </Text>
        
        <View style={{
          // TODO: move these to 'styles'
          flex: 0.7, 
          flexDirection: 'row', 
          justifyContent: 'flex-end', 
          alignItems: 'center'
        }}>
          {/* {(extra.length || top.length || bottom.length || feet.length) && */}
            <TouchableOpacity 
              onPress={() => saveOutfit()} 
              style={{paddingHorizontal: Theme.spacing.xs}}
            >
              <MaterialCommunityIcons 
                name={icons.upload} 
                color={currentTheme.colors.primary} 
                size={currentTheme.fontSize.m_l} 
              />
            </TouchableOpacity>
          {/* } */}
          <TouchableOpacity 
            onPress={() => setOpenDatePicker(true)} 
            style={{paddingHorizontal: Theme.spacing.xs}}
          >
            <MaterialCommunityIcons 
              name={icons.calendar} 
              color={currentTheme.colors.primary} 
              size={currentTheme.fontSize.m_l} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <DatePicker 
        modal
        open={openDatePicker}
        date={date}
        mode='date'
        title={'View your outfit on...'}
        onCancel={() => setOpenDatePicker(false)}
        onConfirm={(date) => {
          setOpenDatePicker(false)
          setDate(date)
        }}
      />
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
        renderItem={(item) => 
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
  category: ClothingItem[]
}

const SectionElement = ({index, category}: SectionElementProps) => {

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
          renderItem={(item) => <EachItem imageUri={item.item.image} handleView={setView} aspectRatio={item.item.aspect_ratio}/>}
          keyExtractor={(item, index) => 'carousel_' + index + '_id_' + item.id}
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
    paddingVertical: Theme.spacing.xxs
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