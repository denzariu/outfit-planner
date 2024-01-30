import { Dimensions, Image, LayoutAnimation, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme, swipeAnimation } from '../defaults/ui'
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { icons } from '../defaults/custom-svgs';
import { Theme as CalendarTheme } from 'react-native-calendars/src/types'  
import { getDBConnection } from '../assets/database/db-service';
import { getOutfitsBetweenDates, getOutfitsItems, getOutfitsOnDate } from '../assets/database/db-operations/db-operations-outfit';
import { FlatList } from 'react-native-gesture-handler';
import { ClothingItem, Outfit } from '../assets/database/models';
import Modal from 'react-native-modal'
import OutfitCreation from '../components/OutfitCreation';
import AppleStyleSwipeableRow from '../components/AppleSwipeableRow';
import { useIsFocused } from '@react-navigation/native';
import { deleteOutfit as deleteFromDB } from '../assets/database/db-processing';


const CalendarScreen = ({...props}) => {

  const isFocused = useIsFocused()

  const windowWidth = Dimensions.get('window').width;
  const fadeAnimation = props.fadeAnimation;
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  

  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());

  const [list, setList] = useState<{date: string, outfit: {}}[]>([])
  const [markedDates, setMarkedDates] = useState<any>([])
  const [markedSelectedDates, setMarkedSelectedDates] = useState<any>()
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [noOutfit, setNoOutfit] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [preview, setPreview] = useState<{x: number, y:number}>({x: 0, y: 0});

  const fetchOutfits = async () => {
    const db = await getDBConnection()

    const _month = month < 10 ? '0' + month : month?.toString()
    const outfitsThisMonth = await getOutfitsBetweenDates(db, `${year}-${_month}-01`, `${year}-${_month}-32`)

    LayoutAnimation.configureNext(swipeAnimation)
    setList(outfitsThisMonth.map(i => {return {...i, date: i.date.split(' ')[0]}}))
  }

  const refreshOutfit = async () => {
    setNoOutfit(-1)
    fetchOutfits()

    //Dropping outfit-only update in favor of a total refresh
    //TODO: rework this if there are significant performance issues

    // const db = await getDBConnection()
    // const outfits_on_date = await getOutfitsOnDate(db, selectedDate)

    // //Pop outfits
    // while (markedDates[selectedDate].outfits.length)
    //   markedDates[selectedDate].outfits.pop()

    // //Push new outfits
    // for (let i=0; i<outfits_on_date.length; i++)
    //   markedDates[selectedDate].outfits.push(outfits_on_date[i])

    // console.log({marked: markedDates[selectedDate].outfits})

  }

  const deleteOutfit = async (outfit_id: number) => {
    deleteFromDB(outfit_id)
    .then(refreshOutfit)
  }

  useEffect(() => {
    if (!isFocused) return;

    // Setting the value to -1 in order to know if
    // user refreshed the page (outfit wasn't selected before)
    setNoOutfit(-1)
    fetchOutfits()
  }, [month, year, isFocused]);



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

    // Update outfit items when user reloaded the page
    if(noOutfit == -1)
      daysOutfits(selectedDate)

  }, [markedDates, selectedDate])

  // Fires every time the user selects a new date
  useEffect(() => {
    daysOutfits(selectedDate)
  }, [selectedDate])

  // Loads today's outfits' items
  const daysOutfits = async (day: any) => {
    if(markedDates && markedDates[day] && markedDates[day].outfits.length > 0) {
      const db = await getDBConnection()
      
      const outfits_ids = markedDates[day].outfits.map((o: Outfit) => o.id);

      const outfits = await getOutfitsItems(db, outfits_ids)
      setNoOutfit(0)

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
  
  // Force calendar (and gradient) update by updating its key
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
      <AnimatedGradient props={fadeAnimation} key={calendarKey + '_update_gradient'}/>
      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.textHeader]}>
          Outfit Planner
        </Text>
      </View>
      <View key={calendarKey}>
        <Calendar
            key={calendarKey + '_force_update'}
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
              LayoutAnimation.configureNext(swipeAnimation) //or mainAnimation?
              setMonth(month.month)
              setYear(month.year)
            }}
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
            deleteOutfit={deleteOutfit}
            index={o.index}
          />
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
        // useNativeDriver
        swipeDirection={'down'}
        animationIn={'slideInUp'}
        isVisible={modalVisible}
        onSwipeComplete={() => {setModalVisible(prev => !prev)}}
        onBackButtonPress={() => {setModalVisible(prev => !prev)}}
        onDismiss={() => setModalVisible(prev => !prev)}
        onModalHide={() =>
          // When the user closes the modal, automatically update outfit's items
          // daysOutfits(selectedDate)
          refreshOutfit()

        }
        propagateSwipe
        // pointerEvents='box-only'
        style={{
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

      {/* TODO: move this into a component */}
      {(preview.x != 0 && preview.y != 0) &&
        <View style={{
          position: 'absolute',
          left: preview.x < windowWidth/2 ? preview.x + 32 : preview.x - 128 - 32,
          top: preview.y - 120,
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
              i.type == 'footwear' &&
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
  setModalVisible: any,
  deleteOutfit?: any
}

const SwipeableRow = ({outfit, setNoOutfit, setModalVisible, setPreview, index, deleteOutfit}: RowProps) => {
  const editItem = () => {
    
  }
  
  const deleteItem = () => {
    // Call function from parent component
    deleteOutfit(outfit.id)
  }

  return (
    <AppleStyleSwipeableRow 
      actionButton1={editItem}
      actionButton2={deleteItem}
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
      <MaterialCommunityIcons 
        name={icons.dots}
        size={Theme.fontSize.m_m}
        color={currentTheme.colors.background}
      />
      <MaterialCommunityIcons 
        name={outfit.icon}
        size={Theme.fontSize.l_s}
        color={currentTheme.colors.background}
        style={styles.outfit_icon}
      />
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
    flexDirection: 'row',
    alignItems: 'center'
  },

  outfit_icon: {marginLeft: Theme.spacing.xs},

  outfit_title: {
    fontSize: Theme.fontSize.m_m,
    marginLeft: Theme.spacing.s
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
  }
})

