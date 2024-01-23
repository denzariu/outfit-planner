import { Alert, LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme, mainAnimation, swipeAnimation, swipeYAnimation } from '../defaults/ui'
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { icons } from '../defaults/custom-svgs';
import { Theme as CalendarTheme } from 'react-native-calendars/src/types'  
import { getDBConnection } from '../assets/database/db-service';
import { getOutfitsBetweenDates, getOutfitsItems } from '../assets/database/db-operations/db-operations-outfit';
import { FlatList } from 'react-native-gesture-handler';
import { ClothingItem, Outfit } from '../assets/database/models';
import Modal from 'react-native-modal'
import { FontWeight } from '@shopify/react-native-skia';
import OutfitOrganizer from '../components/OutfitOrganizer';
import OutfitCreation from '../components/OutfitCreation';

const CalendarScreen = ({...props}) => {

  const fadeAnimation = props.fadeAnimation;
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [list, setList] = useState<{date: string, outfit: {}}[]>([
    {date: '2023-12-29', outfit: {}},
    {date: '2023-12-17', outfit: {}},
    {date: '2023-12-18', outfit: {}},
    {date: '2023-12-19', outfit: {}},
  ])

  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2024);

  const [noOutfit, setNoOutfit] = useState<number>(0);
  const [outfits, setOutfits] = useState<Outfit[]>()

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchOutfits = async () => {
    const db = await getDBConnection()

    const _month = month < 10 ? '0' + month : month?.toString()
    const outfitsThisMonth = await getOutfitsBetweenDates(db, `${year}-${_month}-01`, `${year}-${_month}-32`)

    LayoutAnimation.configureNext(mainAnimation)
    setList(outfitsThisMonth.map(i => {return {...i, date: i.date.split(' ')[0]}}))
  }

  useEffect(() => {
    fetchOutfits()
  }, [month, year]);


  const [markedDates, setMarkedDates] = useState<any>([])
  const [markedSelectedDates, setMarkedSelectedDates] = useState<any>()
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));


  useEffect(() => {
    type DateArray = {
      [key: string]: any;
    }
    let accumulator: DateArray = {}
    setMarkedDates(
      list.reduce((acc, current) => {
  
        const {date, ...outfit} = current
        const dot = {
          key: acc[date]? acc[date].dots.length : 1 + date, 
          color: currentTheme.colors.quaternary,
          selectedDotColor: currentTheme.colors.quaternary
        }
    
        acc[date] = { 
          outfits: acc[date] ? [...acc[date].outfits, outfit] ?? outfit : [outfit],
          items: acc[date] ? [...acc[date].items, []] ?? [] : [[]],
          dots: acc[date] ? [...acc[date].dots, dot] : [dot],
          marked: true, 
          selected: true,

          // markedColor: currentTheme.colors.primary,
          // selectedColor: currentTheme.colors.secondary,
          // selectedDotColor: currentTheme.colors.secondary,
          // selectedDotTextColor: currentTheme.colors.quaternary
        };
        return acc;
      }, accumulator)
    )
  }, [list])

  useEffect(() => {
    setMarkedSelectedDates({
      ...markedDates,
      [selectedDate]: {
        selected: true,
      }
    })
  }, [markedDates, selectedDate])

  // Fires every time the user selects a new date/day
  useEffect(() => {
    daySchedule(selectedDate)
  }, [selectedDate])

  const daySchedule = async (day: any) => {
    if(markedDates && markedDates[day] && markedDates[day].outfits.length > 0) {
      const db = await getDBConnection()
      
      const outfits_ids = markedDates[day].outfits.map((o: Outfit) => o.id);
      const outfits = await getOutfitsItems(db, outfits_ids)

      for(let i=0; i<markedDates[day].items.length; i++)
        while (markedDates[day].items[i].length)
          markedDates[day].items[i].pop()

      //Push items to each outfit
      outfits.map((i:any) => {
        const {outfit_id, ...item} = i;
        const index = (markedDates[day].outfits.map((o: Outfit) => o.id)).indexOf(outfit_id)
        markedDates[day].items[index].push(item)
      })
    }
  }
  
  console.log({hmm: markedDates[selectedDate]?.items[noOutfit]})


  const themeCalendar: CalendarTheme = {
    calendarBackground: currentTheme.colors.background,
    textSectionTitleColor: currentTheme.colors.secondary,
    monthTextColor: currentTheme.colors.secondary,

    selectedDayBackgroundColor: currentTheme.colors.tertiary,
    selectedDayTextColor: currentTheme.colors.quaternary,

    todayTextColor: currentTheme.colors.tertiary,
    todayBackgroundColor: currentTheme.colors.quaternary,

    dayTextColor: currentTheme.colors.tertiary,

    textDisabledColor: currentTheme.colors.quaternary,
    dotColor: currentTheme.colors.tertiary,
    selectedDotColor: currentTheme.colors.quaternary,
  
    backgroundColor: '#ffffff',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '200',
    weekVerticalMargin: 0,
    textDayFontSize: 16,
    textMonthFontSize: 16,
  }; 
  
  
  // Force calendar update
  const [themeId, setThemeId] = React.useState(isDarkMode ? 'dark' : 'light');

  useEffect(() => {
    setThemeId(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, themeCalendar]);

  const calendarKey = isDarkMode ? 'dark' : 'light';

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container_clothing: {backgroundColor: currentTheme.colors.tertiary},
    container_items_category: {backgroundColor: currentTheme.colors.secondary},
    category_text: {color: currentTheme.colors.quaternary},
    add_item: {backgroundColor: currentTheme.colors.background}
  })
  

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={fadeAnimation}/>
      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.textHeader]}>
          Outfit Planner
        </Text>
      </View>
      <View key={calendarKey}>
        <Calendar
            // customHeaderTitle={<Text>Hi</Text>}
            markingType='multi-dot'
            renderArrow={(direction) => 
              <MaterialCommunityIcons 
                name= {direction === 'left' ? icons.chevron_left : icons.chevron_right} 
                color={currentTheme.colors.secondary} 
                size={currentTheme.fontSize.m_m} 
              />
            }
            // disableArrowLeft={true}
            // disableArrowRight={true}
            // showSixWeeks={true}
            // hideDayNames={true}
            // onDayLongPress={} <-- this is interesting
            // hideArrows={true}
            firstDay={1}
            minDate='2023-11-10'
            onDayPress={day => {
              console.log('selected day', day),
              LayoutAnimation.configureNext(swipeAnimation) //or mainAnimation?
              setSelectedDate(day.dateString)
            }}
            markedDates={markedSelectedDates}
            monthFormat={'MMM, yyyy'}
            hideExtraDays={true}
            onPressArrowLeft={subtractMonth => subtractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            disableAllTouchEventsForDisabledDays={true}
            onMonthChange={month => {
              console.log('month changed', month);
              setMonth(month.month)
              setYear(month.year)
            }}
            // headerStyle={{backgroundColor: currentTheme.colors.tertiary}}
            style={{
              borderRadius: currentTheme.spacing.m,
              height: 258,
            }}
            theme={themeCalendar}
          />
      </View>
      <FlatList
        keyExtractor={(i, index) => index + '_' + i.id}
        style={{
          flex: 1,
          // borderWidth: 1,
          // flexGrow: 0.9,
        }}
        contentContainerStyle={{
          gap: Theme.spacing.ms
          // borderWidth: 1,
          // flex: 1,
          // flexDirection: 'row',
          // justifyContent: 'flex-end',
          // alignItems: 'center',
        }}
        data={markedDates[selectedDate] ? markedDates[selectedDate].outfits ?? [] : []}
        renderItem={o => 
          <TouchableOpacity
            onPress={() => {
              setNoOutfit(o.index)
              setModalVisible(true)
            }}
            onLongPress={() => {
              setNoOutfit(o.index)
              // setLongPressed(true)
              setModalVisible(true)
            }}
            onPressOut={() => {
              setNoOutfit(o.index)
              // setLongPressed(false)
              setModalVisible(false)
            }}
            style={{
              borderColor: currentTheme.colors.secondary,
              borderWidth: Theme.spacing.xxs,
              paddingVertical: Theme.spacing.l,
              paddingHorizontal: Theme.spacing.l,
              backgroundColor: currentTheme.colors.background,
              borderRadius: Theme.spacing.m,
              elevation: Theme.spacing.elevation
            }}
          >
            <Text style={{
              color: currentTheme.colors.secondary,
              textAlign: 'left',
              textAlignVertical: 'center',
              fontSize: Theme.fontSize.m_m,
              fontWeight: '400'
            }}>
              {o.item.name}
            </Text>
          </TouchableOpacity>
        }
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => {
            }}
            style={{
              borderColor: currentTheme.colors.primary,
              borderWidth: Theme.spacing.xxs,
              paddingVertical: Theme.spacing.s,
              backgroundColor: currentTheme.colors.primary,
              borderRadius: Theme.spacing.m,
              justifyContent: 'space-around',
              flexDirection: 'row'
            }}
          >
            <Text style={{
              color: currentTheme.colors.background,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: Theme.fontSize.m_m,
              fontWeight: '200' 
            }}>
              Add Outfit
            </Text>
          </TouchableOpacity>
        }
      />
      
      <Modal
        swipeDirection={'down'}
        animationIn={'slideInUp'}
        isVisible={modalVisible}
        onSwipeComplete={(e) => {setModalVisible(prev => !prev)}}
        onBackButtonPress={() => {setModalVisible(prev => !prev)}}
        onDismiss={() => setModalVisible(prev => !prev)}
        // pointerEvents='box-only'
        style={{
          // borderWidth: 1,
          justifyContent: 'center',
        }}
        backdropColor={currentTheme.colors.background}
      >
        <OutfitCreation
          items={markedDates[selectedDate] ? markedDates[selectedDate].items[noOutfit] : []}
        />
      </Modal>
      
    </SafeAreaView>
  )
}

export default CalendarScreen

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
    marginTop: Theme.spacing.xxs,
    display: 'flex',
    flexDirection: 'row',
    gap: Theme.spacing.m,
    height: '47%',
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
  },

  container_clothing: {
    flex: 0.52,
    borderRadius: Theme.spacing.m,
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
    // flex: 0.25,` 
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  },

  category_text: {
    flex: 0.75,
    fontSize: Theme.fontSize.m_m,
    fontWeight: '200' 
  },

  add_item: {
    alignSelf: 'center',
    padding: Theme.spacing.xxs,
    borderRadius: Theme.spacing.m
  }
})

