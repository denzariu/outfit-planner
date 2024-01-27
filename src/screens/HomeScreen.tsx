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
import { SvgXml } from 'react-native-svg';
import OutfitOrganizer from '../components/OutfitOrganizer';
import { saveOutfit } from '../assets/database/db-processing';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;



  // Date picker
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date);
  const [intDate, setIntDate] = useState<string>('1970-01-01');
  const [headerTitle, setHeaderTitle] = useState<string>("Today's Outfit")
  
  // Outfit manager
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({name: 'Default'})


  const [items, setItems] = useState<Array<ClothingItem>>([])
  const [allItemsIds, setAllItemsIds] = useState<Array<number>>([])


  

  
  // TODO: Feature in testing
  const loadOutfit = async () => {
    const db = await getDBConnection()

    LayoutAnimation.configureNext(mainAnimation);
  
    if (currentOutfit?.id) 
      await getOutfitItems(db, currentOutfit.id)
        .then(res => {
          console.log({outfit_items: res})
          setItems(res)
        console.log('UPDATED ITEMS')

        }) 

    else {
      console.log('LOADING NO OUTFIT ID')
      console.log('NO ITEMS?')
    }
  }

  // Whenever the outfit changes, update the items
  useEffect(() => {
    loadOutfit()
  }, [currentOutfit])

  const updateOutfit = async (intFullDate: string) => {
    const db = await getDBConnection()

    console.log(intFullDate)

    await getOutfitsOnDate(db, intFullDate)
    .then( results => {
      // Not necessary to check if outfit exists yet
      // TODO: add all outfit options for the day

      // Setting items to [] is needed in case results 
      // does not change the current outfit ([] -> [] doesn't trigger update)
      setItems([])
      setCurrentOutfit(results[0])
    })
  }


  // Whenever the date changes, update the outfit
  useEffect(() => {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1) ;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    
    setIntDate(year + '-' + month + '-' + day)
    updateOutfit(year + '-' + month + '-' + day)

    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const strDate: string[] = date.toDateString().split(' ')
    setHeaderTitle(  
      date.setHours(0,0,0,0) == today.setHours(0,0,0,0) ? 
        "Today's Outfit"
      : date.setHours(0,0,0,0) == tomorrow.setHours(0,0,0,0) ? 
        "Tomorrow's Outfit"
      : date.setHours(0,0,0,0) == yesterday.setHours(0,0,0,0) ? 
        "Yesterday's Outfit"
      : `${strDate[0]}, ${strDate[1]} ${strDate[2]}`
      
    )
  }, [date])


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
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            onPress={() => saveOutfit(currentOutfit, allItemsIds, intDate)} 
            style={{padding: Theme.spacing.xs}}
          >
            <MaterialCommunityIcons 
              name={icons.save} 
              color={currentTheme.colors.tertiary} 
              size={currentTheme.fontSize.l_s} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setOpenDatePicker(true)} 
            style={{paddingHorizontal: Theme.spacing.xs}}
          >
            <MaterialCommunityIcons 
              name={icons.date_pick} 
              color={currentTheme.colors.tertiary} 
              size={currentTheme.fontSize.l_s} 
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
      <OutfitOrganizer
        items={items}
        allItemsIds={allItemsIds}
        setAllItemsIds={setAllItemsIds}
        transparent
      />
    </SafeAreaView>
  )
}

export default HomeScreen



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