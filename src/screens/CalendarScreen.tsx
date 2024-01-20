import { Alert, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui'
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { Direction } from 'react-native-calendars/src/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { icons } from '../defaults/custom-svgs';
import { Theme as CalendarTheme } from 'react-native-calendars/src/types'  

const CalendarScreen = ({...props}) => {

  const fadeAnimation = props.fadeAnimation;
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [list, setList] = useState([
    {date: '2023-12-29'},
    {date: '2023-12-17'},
    {date: '2023-12-18'},
    {date: '2023-12-19'},
  ])

  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();

  useEffect(() => {
    // getCalendar(year, month, setList, setCenter, setLoading);
  }, [month]);

  type DateArray = {
    [key: string]: any;
  }
  let accumulator: DateArray = {}
  const markedDates = list.reduce((acc, current) => {
    const formattedDate = current.date
    acc[formattedDate] = { 
      marked: true, 
      markedColor: currentTheme.colors.secondary,
      selected: true,
      selectedColor: currentTheme.colors.secondary,
      selectedDotColor: currentTheme.colors.secondary,
      selectedDotTextColor: currentTheme.colors.quaternary
    };
    return acc;
  }, accumulator);

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
  const daySchedule = (day: any) => {
    // list.forEach((v) => {
    //   if (v.lectureDate === day) {
    //     a.push(v)
    //   }
    // })
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
  


  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={fadeAnimation}/>
      <Text style={[styles.header, dynamicStyle.textHeader]}>
        Outfit Planner
      </Text>
      <View key={calendarKey}>
        <Calendar
            // customHeaderTitle={<Text>Hi</Text>}
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
              console.log('selected day', day)
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
  header: {
    alignSelf: 'flex-start',
    fontSize: Theme.fontSize.l_s,
    marginVertical: Theme.spacing.m,
    marginTop: Theme.spacing.l,
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

