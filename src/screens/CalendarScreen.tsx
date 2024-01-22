import { Alert, Animated, LayoutAnimation, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme, mainAnimation, swipeAnimation, swipeXAnimation, swipeYAnimation } from '../defaults/ui'
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { Direction } from 'react-native-calendars/src/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { icons } from '../defaults/custom-svgs';
import { Theme as CalendarTheme } from 'react-native-calendars/src/types'  
import { getDBConnection } from '../assets/database/db-service';
import { getOutfitItems, getOutfits, getOutfitsBetweenDates, getOutfitsItems } from '../assets/database/db-operations/db-operations-outfit';
import { FlatList } from 'react-native-gesture-handler';
// @ts-ignore
import SwitchSelector from 'react-native-switch-selector';
import { Outfit } from '../assets/database/models';

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

  const fetchOutfits = async () => {
    const db = await getDBConnection()

    const _month = month < 10 ? '0' + month : month?.toString()
    const outfitsThisMonth = await getOutfitsBetweenDates(db, `${year}-${_month}-01`, `${year}-${_month}-32`)
    // setList(outfitsThisMonth.map(date => {return {date: date}}))
    // console.log(outfitsThisMonth.map(i => i.date = i.date.split(' ')[0]))
    // console.log(outfitsThisMonth)
    // setList(outfitsThisMonth)
    LayoutAnimation.configureNext(mainAnimation)
    setList(outfitsThisMonth.map(i => {return {...i, date: i.date.split(' ')[0]}}))
    // console.log((
    //   outfitsThisMonth.map(o => {
    //   const {date, ...rest} = o;
    //   return rest
    // })))
    
  }

  useEffect(() => {
    
    fetchOutfits()
  }, [month]);

  type DateArray = {
    [key: string]: any;
  }
  let accumulator: DateArray = {}
  const markedDates = list.reduce((acc, current) => {

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
      // markedColor: currentTheme.colors.primary,
      selected: true,
      // selectedColor: currentTheme.colors.secondary,
      // selectedDotColor: currentTheme.colors.secondary,
      // selectedDotTextColor: currentTheme.colors.quaternary
    };
    return acc;
  }, accumulator);

  // console.log(markedDates)

 const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const markedSelectedDates = {
    ...markedDates,
    [selectedDate]: {
      selected: true,
      // marked: markedDates[selectedDate]?.marked,
    }
  }


  const a = []
  const daySchedule = async (day: any) => {

    if(markedDates && markedDates[day] && markedDates[day].outfits.length > 0) {
      // console.log(markedDates[day].outfits)
      const db = await getDBConnection()
      
      const outfits_ids = markedDates[day].outfits.map((o: Outfit) => o.id);
      // console.log(outfits_ids)
      const outfits = await getOutfitsItems(db, outfits_ids)
      // console.log({out: outfits})
      const associativeArray = outfits.map((i:any) => {
        const {outfit_id, ...item} = i;
        const index = (markedDates[day].outfits.map((o: Outfit) => o.id)).indexOf(outfit_id)
        markedDates[day].items[index].push(item)
      })
      console.log({arr: markedDates[day].items})
    }
    // setOut
    // const noOutfits = markedDates[day] ? markedDates[day].outfits.length ?? 0 : 0
    // const optionOutfits = []
    // for(let i=0; i<noOutfits; i++) 
    //   optionOutfits.push({
    //     label: (i+1).toString(), 
    //     value: i.toString()
    //   })  
    
    // console.log({oO: optionOutfits})
    // setOptionOutfit(optionOutfits)
    // setNoOutfit(0)
  }
  

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
  

  // console.log({exista: })

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={fadeAnimation}/>
      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.textHeader]}>
          Outfit Planner
        </Text>
       
        <FlatList
          keyExtractor={(i, index) => index + '_' + i.id}
          style={{
            flexGrow: 0.9,
          }}
          contentContainerStyle={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          data={markedDates[selectedDate] ? markedDates[selectedDate].outfits ?? [] : []}
          renderItem={o => 
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(swipeYAnimation);
                setNoOutfit(o.index);
              }}
              style={{
                paddingHorizontal: Theme.spacing.m,
                paddingVertical: Theme.spacing.s,
                backgroundColor: o.index == noOutfit ? currentTheme.colors.secondary : currentTheme.colors.background,
                borderRadius: Theme.spacing.m
              }}
            >
              <Text style={{
                color: o.index == noOutfit ? currentTheme.colors.background : currentTheme.colors.primary,
                textAlign: 'center',
                textAlignVertical: 'center'
              }}>
                {o.index + 1}
              </Text>
            </TouchableOpacity>
          }
        />
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
              LayoutAnimation.configureNext(swipeAnimation)
              setSelectedDate(day.dateString),
              daySchedule(day.dateString)
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
              // borderWidth: 1,
              // borderColor: 'gray',
              height: '30%',
              
            }}
            theme={themeCalendar}
          />
        </View>
        <View style={styles.container}>
          <View style={[styles.container_clothing, dynamicStyle.container_clothing]}>
            
            
          </View>
        <View style={styles.container_items}>
          
          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text style={[styles.category_text, dynamicStyle.category_text]}>Extras</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />

              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text style={[styles.category_text, dynamicStyle.category_text]}>Tops</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />

              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text style={[styles.category_text, dynamicStyle.category_text]}>Bottoms</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />

              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text numberOfLines={1} style={[styles.category_text, dynamicStyle.category_text]}>Feet</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />

              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
    height: '47%'
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

