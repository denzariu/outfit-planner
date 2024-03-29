import { LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme, swipeAnimation } from '../defaults/ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { getDBConnection } from '../assets/database/db-service';
import { ClothingItem, Outfit } from '../assets/database/models';
import { icons } from '../defaults/custom-svgs';
import { getOutfitItems, getOutfitsOnDate } from '../assets/database/db-operations/db-operations-outfit';
import DatePicker from 'react-native-date-picker';
import OutfitOrganizer from '../components/OutfitOrganizer';
import { saveOutfit } from '../assets/database/db-processing';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = ({...props}) => {
  const isFocused = useIsFocused();
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;



  // Date picker
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date);
  const [intDate, setIntDate] = useState<string>('1970-01-01');
  const [headerTitle, setHeaderTitle] = useState<string>("Today's Outfit")
  
  // Outfit manager
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>({name: 'Default Outfit', icon: 'bag-suitcase'})


  const [items, setItems] = useState<Array<ClothingItem>>([])
  const [updatingOutfit, setUpdatingOutfit] = useState<boolean>(false)
  const [allItemsIds, setAllItemsIds] = useState<Array<number>>([])
  


  useEffect(() => {
    if (!isFocused) return

    updateOutfit(intDate)
  }, [isFocused])


  // Whenever the outfit changes, update its itemss
  useEffect(() => {
    if (updatingOutfit)
      loadOutfitItems()
  }, [updatingOutfit])


  // TODO: Feature in testing
  // Load the outfit items from the DB
  const loadOutfitItems = async () => {
    LayoutAnimation.configureNext(swipeAnimation);
    const db = await getDBConnection()
  
    if (currentOutfit?.id) {
      await getOutfitItems(db, currentOutfit.id)
      .then(res => {
        setItems(res)
      }) 
    } else {
      setItems([])
      console.log('There is no outfit on this date.')
    }

    setUpdatingOutfit(false)
  }

  const updateOutfit = async (intFullDate: string) => {
    const db = await getDBConnection()

    await getOutfitsOnDate(db, intFullDate)
    .then( results => {
      // Not necessary to check if outfit exists yet
      // TODO: add all outfit options for the day

      // Setting 'updatingOutfit' to true, because results[0]
      // might return undefined and thus not trigger updatesS
      setCurrentOutfit(results[0])
      setUpdatingOutfit(true)

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

    
  // Force gradient update by updating its key
  const gradientKey = isDarkMode ? 'dark_update_gradient' : 'light_update_gradient';

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      
      <AnimatedGradient props={fadeAnimation} key={gradientKey}/>

      <View style={styles.header_container}>
        {/* Header title */}
        <Text style={[styles.header, dynamicStyle.text_header]}>
          {headerTitle}
        </Text>
        
        <View style={styles.header_buttons}>
          {/* Save button */}
          <TouchableOpacity 
            onPress={() => saveOutfit(currentOutfit ?? {name: 'Default Outfit', icon: 'bag-suitcase'}, allItemsIds, intDate)} 
            style={{padding: Theme.spacing.xs}}
          >
            <MaterialCommunityIcons 
              name={icons.save} 
              color={currentTheme.colors.tertiary} 
              size={currentTheme.fontSize.l_s} 
            />
          </TouchableOpacity>
          {/* Calendar button */}
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

      {/* Modal which opens when pressing on calendar button */}
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

      {/* Item viewer */}
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

  header_buttons: {
    flex: 0.7, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center',
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