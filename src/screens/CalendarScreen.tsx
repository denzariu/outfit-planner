import { Alert, Dimensions, Image, LayoutAnimation, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
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
import AppleStyleSwipeableRow from '../components/AppleSwipeableRow';


const CalendarScreen = ({...props}) => {

  const windowWidth = Dimensions.get('window').width;
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
  const [preview, setPreview] = useState<{x: number, y:number}>({x: 0, y: 0});

  const fetchOutfits = async () => {
    const db = await getDBConnection()

    const _month = month < 10 ? '0' + month : month?.toString()
    const outfitsThisMonth = await getOutfitsBetweenDates(db, `${year}-${_month}-01`, `${year}-${_month}-32`)

    LayoutAnimation.configureNext(swipeAnimation)
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
    weekVerticalMargin: 2,
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
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={currentTheme.colors.background}
      />
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
              height: 268,
            }}
            theme={themeCalendar}
          />
      </View>
      <FlatList
        keyExtractor={(i, index) => index + '_' + i.id}
        style={{ flex: 1, marginHorizontal: -Theme.spacing.page }}
        contentContainerStyle={{ gap: Theme.spacing.ms }}
        data={markedDates[selectedDate] ? markedDates[selectedDate].outfits ?? [] : []}
        renderItem={o =>
          <SwipeableRow 
            outfit={o.item} 
            setNoOutfit={setNoOutfit} 
            setModalVisible={setModalVisible}
            setPreview={setPreview}
            index={o.index}
          /> 
          // <TouchableOpacity
          //   onPress={() => {
          //     setNoOutfit(o.index)
          //     setModalVisible(true)
          //   }}
          //   delayLongPress={200}
          //   onLongPress={(e) => {
          //     setNoOutfit(o.index)
          //     LayoutAnimation.configureNext(swipeAnimation)
          //     setPreview({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})
          //   }}
          //   onPressOut={() => {
          //     setNoOutfit(o.index)
          //     LayoutAnimation.configureNext(swipeAnimation)
          //     setPreview({x: 0, y: 0})
          //   }}
          //   style={{
          //     flexDirection: 'row',
          //     justifyContent: 'space-between',
          //     borderColor: currentTheme.colors.secondary,
          //     borderWidth: Theme.spacing.xxs,
          //     borderRadius: Theme.spacing.m,
          //     elevation: Theme.spacing.elevation,
          //     backgroundColor: currentTheme.colors.background
          //   }}
          // >
          //   <Text style={{
          //     paddingVertical: Theme.spacing.l,
          //     paddingHorizontal: Theme.spacing.l,
          //     color: currentTheme.colors.secondary,
          //     textAlign: 'left',
          //     textAlignVertical: 'center',
          //     fontSize: Theme.fontSize.m_m,
          //     fontWeight: '400'
          //   }}>
          //     {o.item.name}
          //   </Text>
            
          //   <TouchableOpacity style={{
          //     // backgroundColor: currentTheme.colors.quaternary,
          //     borderTopRightRadius: Theme.spacing.m,
          //     borderBottomRightRadius: Theme.spacing.m,              
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //     paddingHorizontal: Theme.spacing.m,

          //   }}>
          //     <MaterialCommunityIcons name={icons.delete}
          //       color={currentTheme.colors.delete}
          //       size={Theme.fontSize.m_l}
          //     />
          //   </TouchableOpacity>
          // </TouchableOpacity>
        }
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => {
            }}
            style={{
              borderColor: currentTheme.colors.primary,
              borderWidth: Theme.spacing.xxs,
              paddingVertical: Theme.spacing.s,
              paddingHorizontal: Theme.spacing.m,
              backgroundColor: currentTheme.colors.primary,
              // borderRadius: Theme.spacing.m,
              borderTopLeftRadius: Theme.spacing.m,
              borderBottomLeftRadius: Theme.spacing.m,
              // justifyContent: 'space-around',
              // flexDirection: 'row',
              marginLeft: Theme.spacing.page
            }}
          >
            <Text style={{
              color: currentTheme.colors.background,
              textAlign: 'left',
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
        // presentationStyle='overFullScreen'
        swipeDirection={'down'}
        animationIn={'slideInUp'}
        isVisible={modalVisible}
        onSwipeComplete={(e) => {setModalVisible(prev => !prev)}}
        onBackButtonPress={() => {setModalVisible(prev => !prev)}}
        onDismiss={() => setModalVisible(prev => !prev)}
        propagateSwipe
        // pointerEvents='box-only'
        style={{
          // borderWidth: 1,
          justifyContent: 'center',
        }}
        backdropColor={currentTheme.colors.background}
      >
        <OutfitCreation
          selectedDate={selectedDate}
          outfit={markedDates[selectedDate] ? markedDates[selectedDate].outfits[noOutfit] ?? [] : []}
          items={markedDates[selectedDate] ? markedDates[selectedDate].items[noOutfit] ?? [] : []}
        />
      </Modal>

      {(preview.x != 0 && preview.y != 0) &&
        <View style={{
          position: 'absolute',
          left: preview.x < windowWidth/2 ? preview.x + 32 : preview.x - 128 - 32,
          top: preview.y - 120,
          // height: 240,
          width: 128,
          borderRadius: 16,
          padding: 4,
          backgroundColor: currentTheme.colors.secondary,
          flexDirection: 'column'
        }}>
          <View style={{
            flexDirection: 'row'
          }}>
            {markedDates[selectedDate].items[noOutfit].map((i: ClothingItem) => 
              i.type == 'extra' &&
                <Image key={'preview_extra_' + i.id} source={{uri: i.image}} style={{flex: i.aspect_ratio, aspectRatio: i.aspect_ratio}}/>
          )}
          </View>
          <View style={{
            flexDirection: 'row'
          }}>
            {markedDates[selectedDate].items[noOutfit].map((i: ClothingItem) => 
              i.type == 'top' &&
                <Image key={'preview_top_' + i.id} source={{uri: i.image}} style={{flex: i.aspect_ratio, aspectRatio: i.aspect_ratio}}/>
          )}
          </View>
          <View style={{
            flexDirection: 'row'
          }}>
            {markedDates[selectedDate].items[noOutfit].map((i: ClothingItem) => 
              i.type == 'bottom' &&
                <Image key={'preview_bottom_' + i.id} source={{uri: i.image}} style={{flex: i.aspect_ratio, aspectRatio: i.aspect_ratio}}/>
          )}
          </View>
          <View style={{
            flexDirection: 'row'
          }}>
            {markedDates[selectedDate].items[noOutfit].map((i: ClothingItem) => 
              i.type == 'feet' &&
                <Image key={'preview_footwear_' + i.id} source={{uri: i.image}} style={{flex: i.aspect_ratio, aspectRatio: i.aspect_ratio}}/>
          )}
          </View>
        </View>
      }
      
    </SafeAreaView>
  )
}

export default CalendarScreen

type RowProps = {
  outfit: Outfit,
  index: number,
  setNoOutfit: any,
  setPreview: any,
  setModalVisible: any
}

const SwipeableRow = ({outfit, setNoOutfit, setModalVisible, setPreview, index}: RowProps) => {
  const edit = () => {
    console.log('pressed edit')
  }
  
  const deleteOutfit = () => {
    console.log('pressed delete')
  }

  return (
    <AppleStyleSwipeableRow 
      actionButton1={edit}
      actionButton2={deleteOutfit}
      children={
        <Row
          outfit={outfit} 
          setNoOutfit={setNoOutfit} 
          setModalVisible={setModalVisible} 
          setPreview={setPreview}
          index={index}
        />  
      } 
      outfit={outfit} 
    />
  );
};

const Row = ( {outfit, setNoOutfit, setModalVisible, setPreview, index}: RowProps ) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const dynamicStyles = StyleSheet.create({
    outfit_container: {backgroundColor: currentTheme.colors.secondary},
    outfit_title: {color: currentTheme.colors.quaternary}
  })

  return (
    <TouchableOpacity
      onPress={() => {
        setNoOutfit(index)
        setModalVisible(true)
      }}
      delayLongPress={200}
      onLongPress={(e) => {
        setNoOutfit(index)
        LayoutAnimation.configureNext(swipeAnimation)
        setPreview({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY})
      }}
      onPressOut={() => {
        setNoOutfit(index)
        LayoutAnimation.configureNext(swipeAnimation)
        setPreview({x: 0, y: 0})
      }}
      style={[styles.outfit_container, dynamicStyles.outfit_container]}
      activeOpacity={0.8}
    >
      <Text style={[styles.outfit_title, dynamicStyles.outfit_title]}>
        {outfit.name}
      </Text>
    </TouchableOpacity>
  )
};



const styles = StyleSheet.create({
  outfit_container: {
    paddingVertical: Theme.spacing.m,
    borderTopLeftRadius: Theme.spacing.m,
    borderBottomLeftRadius: Theme.spacing.m,
  },

  outfit_title: {
    fontSize: Theme.fontSize.m_m,
    marginLeft: Theme.spacing.m
  },

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

  container_clothing: {
    flex: 0.52,
    borderRadius: Theme.spacing.m,
  },

  // container_items: {
  //   flex: 0.48,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   rowGap: Theme.spacing.s,
  // },

  // container_items_category: {
  //   flex: 0.25,
  //   display: 'flex',
  //   flexDirection: 'column',
  //   borderRadius: Theme.spacing.m,
  //   paddingHorizontal: Theme.spacing.s,
  //   paddingVertical: Theme.spacing.xxs 
  // },

  // container_category: {
  //   // flex: 0.25,` 
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   flexWrap: 'nowrap'
  // },

  // category_text: {
  //   flex: 0.75,
  //   fontSize: Theme.fontSize.m_m,
  //   fontWeight: '200' 
  // },

  // add_item: {
  //   alignSelf: 'center',
  //   padding: Theme.spacing.xxs,
  //   borderRadius: Theme.spacing.m
  // }
})

