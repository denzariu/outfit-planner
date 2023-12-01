import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui'
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { Direction } from 'react-native-calendars/src/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CalendarScreen = () => {

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [list, setList] = useState([
    {date: '2023-12-29'},
    {date: '2023-12-17'},
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
      // markedColor: currentTheme.colors.secondary,
      // selected: true,
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
      marked: markedDates[selectedDate]?.marked,
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
  
  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container_clothing: {backgroundColor: currentTheme.colors.tertiary},
  })

  const themeCalendar = {
    // backgroundColor: currentTheme.colors.tertiary,
    calendarBackground: currentTheme.colors.background,
    textSectionTitleColor: currentTheme.colors.secondary,
    monthTextColor: currentTheme.colors.secondary,

    selectedDayBackgroundColor: currentTheme.colors.quaternary,
    selectedDayTextColor: currentTheme.colors.tertiary,

    todayTextColor: currentTheme.colors.background,
    todayBackgroundColor: currentTheme.colors.tertiary,

    dayTextColor: currentTheme.colors.tertiary,

    textDisabledColor: currentTheme.colors.quaternary,
    dotColor: currentTheme.colors.tertiary,
    selectedDotColor: currentTheme.colors.quaternary,
    
    backgroundColor: '#ffffff',
    // arrowColor: 'orange',
    // disabledArrowColor: '#d9e1e8',
    // indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '200',
    // textMonthFontWeight: '200',
    // textDayHeaderFontWeight: '200',
    weekVerticalMargin: 0,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    // textDayHeaderFontSize: 12
  }; 
  
  // Force calendar update
  const [themeId, setThemeId] = React.useState(isDarkMode ? 'dark' : 'light');

  useEffect(() => {
    setThemeId(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, themeCalendar]);
  const calendarKey = isDarkMode ? 'dark' : 'light';

  

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <LinearGradient
        colors={["#00000000", currentTheme.colors.secondary + '44', currentTheme.colors.secondary + 'FF']}
        style={{
          position: 'absolute',
          overflow: 'visible',
          pointerEvents: 'none',
          left: 0,
          right: 0,
          bottom: 0,
          height: "10%",
          zIndex: 0
        }}
      />
      <Text style={[styles.header, dynamicStyle.textHeader]}>
        Outfit Planner
      </Text>
      <View key={calendarKey}>
        <Calendar
            // customHeaderTitle={<Text>Hi</Text>}
            renderArrow={(direction) => 
              <MaterialCommunityIcons name= {direction === 'left' ? "chevron-left" : "chevron-right"} color={currentTheme.colors.secondary} size={currentTheme.fontSize.m_m} />
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
              borderRadius: currentTheme.spacing.m
              // borderWidth: 1,
              // borderColor: 'gray',
              // height: 350,
              
            }}
            theme={themeCalendar}
          />
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
})

