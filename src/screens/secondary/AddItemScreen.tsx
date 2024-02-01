import { Image, LayoutAnimation, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DarkTheme, Theme, mainAnimation, swipeAnimation } from '../../defaults/ui'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import { getColors } from 'react-native-image-colors'
import { useNavigation } from '@react-navigation/native'
import { saveClothingItems, updateClothingItem } from '../../assets/database/db-operations/db-operations-clothingitem'
import { getDBConnection, tableName_ClothingItem } from '../../assets/database/db-service'
import { icons } from '../../defaults/custom-svgs'
import { ClothingItem } from '../../assets/database/models'
import { CLOTHING_FABRICS, CLOTHING_TYPES } from '../../defaults/data'
import { simplifiedColor512, simplifiedColorID } from '../../defaults/data-processing'

type AddItemScreen = {
  navigation: any,
  route: {params: {
    item?: ClothingItem,
    editMode: boolean
  }}
}

const AddItemScreen = ({navigation, route}: AddItemScreen) => {

  const {item, editMode} = route.params || []

  useEffect (() => {
    if (item) {
      setName(item.adjective)
      setImage(item.image)  
      setAspectRatio(item.aspect_ratio)
      //TODO: colors & fabrics & weather in DB 
      //setColors()
      // setMainColor(item.)
      // setFabrics
      // setWeather(item.weather)
       
      setSeasons([
        item.seasons[0] == '1' ? true : false,
        item.seasons[1] == '1' ? true : false,
        item.seasons[2] == '1' ? true : false,
        item.seasons[3] == '1' ? true : false,
      ])
      setCategory({parent: item.type, label: item.subtype, value: item.subtype})
    }
  }, [item])

  const navigator = useNavigation();
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const [focused, setFocus] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<boolean[]>([false, false, false, false]);
  const [weather, setWeather] = useState<boolean[]>([false, false, false, false]);

  const [image, setImage] = useState<any>(null);
  const [enlargedImage, setEnlargedImage] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1.0);
  const [mainColor, setMainColor] = useState<string>(currentTheme.colors.tertiary);
  const [colors, setColors] = React.useState<any>({
    average: Theme.colors.primary,
    darkMuted: Theme.colors.primary,
    darkVibrant: Theme.colors.primary,
    dominant: Theme.colors.primary,
    lightMuted: Theme.colors.primary,
    lightVibrant: Theme.colors.primary,
    muted: Theme.colors.primary,
    "platform": "android",
    vibrant: Theme.colors.primary,
  })

  const [name, setName] = useState('')
  const [category, setCategory] = useState<{ parent: string; label: string; value: string; } |
                                           { parent?: undefined; label: string; value: string; }>(
    {parent: 'top', label: 'Jacket', value: 'jacket'},
  )
  const [items, setItems] = useState(CLOTHING_TYPES);
  const [valuesFabrics, setValuesFabrics] = useState(['cotton']);
  const [fabrics, setFabrics] = useState(CLOTHING_FABRICS);

  const onChangeName = (value: string) => {
    setName(value)
  }

  useEffect(() => {
    getColors(image, {
      fallback: Theme.colors.primary,
      cache: true,
      key: image,
    })
    .then((imgPalette) => {
      setColors(() => {return imgPalette}), 
      setMainColor(() => {return imgPalette.average})
    })
    .catch(e => {console.log("error")})
    
  }, [image])

  const addImage = async () => {
    // Opens up the native image picker 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [1,1],
      quality: 0.7,
      allowsMultipleSelection: false, 
    })
    .then((res) => {return res})

    LayoutAnimation.configureNext(swipeAnimation);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAspectRatio(result.assets[0].width/result.assets[0].height)
    }
  }

  const dynamicStyle = StyleSheet.create({
    background: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container: {backgroundColor: mainColor, shadowColor: currentTheme.colors.foreground},
    setting: {backgroundColor: currentTheme.colors.primary},
    setting_title: {color: currentTheme.colors.quaternary + '88'},
    button: {backgroundColor: currentTheme.colors.secondary, shadowColor: currentTheme.colors.foreground, borderColor: currentTheme.colors.tertiary},
    button_text: {color: currentTheme.colors.background},
    image_enlarge_icon: {backgroundColor: currentTheme.colors.tertiary}
  })

  // Handles state change for item's wearability in 'seasons'
  function seasonPress (season: number) {
    setSeasons(() => { return [
      ...seasons.slice(0,season),
      seasons[season]= !seasons[season],
      ...seasons.slice(season+1, seasons.length)
    ]})
  }

  // Handles state change for item's wearability in 'weather'
  function weatherPress (w: number) {
    setWeather(() => { return [
      ...weather.slice(0,w),
      weather[w]= !weather[w],
      ...weather.slice(w+1, weather.length)
    ]})
  }

  //WIP: add Item to the database
  const addItem = async () => {
    const db = await getDBConnection();
    
    const new_item: ClothingItem = {
      id: null,
      adjective: name,
      type: category.parent ? category.parent : category.value,
      subtype: category.value,
      seasons: seasons.map((item) => Number(item)).join(''),  // [false, true] => '01'
      image: image,
      aspect_ratio: aspectRatio
    }
    // If user creates the item
    if (!editMode) {
      try {
        await saveClothingItems(db, [new_item])

      } catch (e) {
        console.error(e)
      }
    }
    // If user updates information about the item
    else {
      console.log({item:item, new:new_item})
      await updateClothingItem(db, item?.id ?? 0, new_item)
    }
  }
  
  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background]}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', marginVertical: Theme.spacing.m, marginTop: Theme.spacing.l, gap: Theme.spacing.l}}>
        <TouchableOpacity 
          children={<MaterialCommunityIcons name={icons.arrow_left} color={currentTheme.colors.tertiary} size={currentTheme.fontSize.l_s} />}
          onPress={() => navigator.goBack()}
        />
        <Text 
          numberOfLines={1}
          style={[styles.header, dynamicStyle.textHeader]}
        >
          {name == '' ? 'Add Item' : name + ' ' + category.label}
        </Text>
      </View>
      
      <View style={[styles.container, dynamicStyle.container]}>
        <TouchableOpacity 
          onLongPress={() => setEnlargedImage((prev) => !prev)}
          onPress={() => addImage()}
          style={{ height: '100%' }}
        >
          <View style={styles.container_upload}>
            {image ? 
              <Image 
                source={{ uri: image }} 
                style={[
                  {flex: 1, borderRadius: Theme.spacing.s},
                  // Long pressing the image will zoom it in/out, based on its aspect ratio
                  enlargedImage ? 
                    {aspectRatio: 1 }
                    : {aspectRatio: aspectRatio, flex: 1/aspectRatio, maxWidth: '100%'}
                ]}
              />
              :
              <>
                <View style={{position: 'absolute', zIndex: 10}}>
                  <MaterialCommunityIcons 
                    name={icons.upload} 
                    color={currentTheme.colors.tertiary} 
                    size={currentTheme.fontSize.l_l * 1.2} 
                  />
                </View>
                <MaterialCommunityIcons 
                  name={icons.tshirt} 
                  color={currentTheme.colors.quaternary} 
                  size={currentTheme.fontSize.l_l * 3} 
                />
              </>
            }
          </View>
        </TouchableOpacity>
      </View>

      {image &&
      <>
      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Name</Text>
          <TextInput 
            style={[styles.setting_input, {fontSize: Theme.fontSize.m_s, color: currentTheme.colors.quaternary}]}
            numberOfLines={1}
            multiline={false}
            placeholder="'Cozy', 'Red', '90s'..."
            placeholderTextColor={currentTheme.colors.quaternary}
            onChangeText={(text) => onChangeName(text)}
            value={name}
          />
        </View>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Category</Text>

          <Dropdown
            renderItem={(item) => {return <CategoryItem item={item} theme={currentTheme}/>}}
            data={items}
            labelField={'label'}
            valueField={'value'}
            value={category.value}
            onChange={(item)=>{
              setCategory(item)
              setFocus(false)
            }}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            showsVerticalScrollIndicator={false}
            autoScroll={true}
            placeholder='Type of clothing'
            renderRightIcon={() =>
              <MaterialCommunityIcons name="menu-down" color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            }
            itemContainerStyle={{
              backgroundColor: currentTheme.colors.primary,
            }}
            selectedTextStyle={{fontSize: Theme.fontSize.m_s, color: currentTheme.colors.quaternary, textAlign: 'center', textAlignVertical: 'center'}}
            itemTextStyle={{fontSize: Theme.fontSize.s_l, textAlign: 'center', color: currentTheme.colors.quaternary}}
            activeColor={currentTheme.colors.secondary}
            // placeholderStyle={{paddingHorizontal: 16}}
            // dropdownPosition='top'
            // mode='modal'
          />
          
        </View>
      </View>
      
      <View style={styles.container_clothing_settings}>
        
        {/* Seasons Buttons */}

        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Seasons</Text>
          <View style={styles.container_seasons}>
            <ButtonPress value={seasons[0]} handler={() => seasonPress(0)} icon={icons.season1} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={seasons[1]} handler={() => seasonPress(1)} icon={icons.season2} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={seasons[2]} handler={() => seasonPress(2)} icon={icons.season3} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={seasons[3]} handler={() => seasonPress(3)} icon={icons.season4} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
          </View>
        </View>

        {/* Weather Buttons */}

        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Weather</Text>
          <View style={styles.container_seasons}>
            <ButtonPress value={weather[0]} handler={() => weatherPress(0)} icon={icons.weather1} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={weather[1]} handler={() => weatherPress(1)} icon={icons.weather2} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={weather[2]} handler={() => weatherPress(2)} icon={icons.weather3} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
            <ButtonPress value={weather[3]} handler={() => weatherPress(3)} icon={icons.weather4} color_background={currentTheme.colors.tertiary} color_icon={currentTheme.colors.quaternary}/>
          </View>
        </View>
      </View>

      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Colors</Text>
          <View style={styles.container_colors}>
            <TouchableOpacity  
              style={[{padding: Theme.spacing.l, borderRadius: Theme.spacing.s, borderWidth: Theme.spacing.xxs, borderColor: currentTheme.colors.primary}, {backgroundColor: colors.average}, mainColor == colors.average ? {borderColor: mainColor} : {}]}
              onPress={() => setMainColor(colors.average)}
            />
            <TouchableOpacity  
              style={[{padding: Theme.spacing.l, borderRadius: Theme.spacing.s, borderWidth: Theme.spacing.xxs, borderColor: currentTheme.colors.primary}, {backgroundColor: colors.dominant}, mainColor == colors.dominant ? {borderColor: mainColor, borderWidth: Theme.spacing.xxs} : {}]}
              onPress={() => setMainColor(colors.dominant)}
            />
          </View>
          <View style={styles.container_colors}>
            <TouchableOpacity  
              style={[{padding: Theme.spacing.l, borderRadius: Theme.spacing.s, borderWidth: Theme.spacing.xxs, borderColor: currentTheme.colors.primary}, {backgroundColor: colors.muted}, mainColor == colors.muted ? {borderColor: mainColor, borderWidth: Theme.spacing.xxs} : {}]}
              onPress={() => setMainColor(colors.muted)}
            />
            <TouchableOpacity  
              style={[{padding: Theme.spacing.l, borderRadius: Theme.spacing.s, borderWidth: Theme.spacing.xxs, borderColor: currentTheme.colors.primary}, {backgroundColor: colors.lightVibrant}, mainColor == colors.vibrant ? {borderColor: mainColor, borderWidth: Theme.spacing.xxs} : {}]}
              onPress={() => setMainColor(colors.lightVibrant)}
            />
          </View>
        </View>
        <View style={[styles.setting, {paddingBottom: 4, overflow: 'hidden'}, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Materials</Text>

          <MultiSelect
            mode='modal'
            // renderItem={(item) => {return <CategoryItem item={item} theme={currentTheme}/>}}
            data={fabrics}
            labelField={'label'}
            valueField={'value'}
            value={valuesFabrics}
            onChange={(item)=>{
              setValuesFabrics(item)
              setFocus(false)
            }}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            showsVerticalScrollIndicator={false}
            search={true}
            maxSelect={6}
            inside={true}
            searchPlaceholder='Search...'
            // visibleSelectedItem={false}
            placeholder="Add fabrics..."
            placeholderStyle={{textAlign: 'center', opacity: 0.5}}
            alwaysRenderSelectedItem={true}
            // renderItem={(item, selected) => {return <View style={{display: 'flex', flexWrap: 'wrap', alignSelf: 'flex-start'}}><Text>{item.label}</Text></View>}}

            renderRightIcon={() =>
              <MaterialCommunityIcons name="menu-down" color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            }
            backgroundColor={currentTheme.colors.tertiary + '80'}
            style={{flex: 1, paddingHorizontal: 8}}
            containerStyle={{borderRadius: currentTheme.spacing.m, backgroundColor: currentTheme.colors.primary, flex: 1}}
            itemContainerStyle={{
              // borderRadius: currentTheme.spacing.m, //     <-- for a more round style
              // height: Theme.spacing.s + Theme.fontSize.l_m,
              backgroundColor: currentTheme.colors.primary,
            }}
            renderSelectedItem={(item, unselect) => {return <MultiSelectItem item={item} unselect={unselect} theme={currentTheme}/>}}
            selectedStyle={{borderRadius: 16, backgroundColor: currentTheme.colors.tertiary}}
            selectedTextStyle={{fontSize: Theme.fontSize.s_s, color: currentTheme.colors.quaternary, textAlign: 'center', textAlignVertical: 'center'}}
            itemTextStyle={{fontSize: Theme.fontSize.s_l, textAlign: 'center', color: currentTheme.colors.quaternary}}
            activeColor={currentTheme.colors.secondary}

          />
          
        </View>
      </View>

      <TouchableOpacity  
        style={[styles.button, dynamicStyle.button]}
        onPress={() => {
          addItem()
          navigator.goBack()
        }}
        children={
          <Text style={[styles.button_text, dynamicStyle.button_text]}>{editMode? 'Update' : 'Add to Collection'}</Text>
        }
      />
      </>
      }
    </SafeAreaView>
  )
}

const CategoryItem = ({item, theme}: {item: any, theme: any}) => {
  return (
    
    <View 
      style={[
        {paddingHorizontal: theme.spacing.s}, 
        !item.parent ? {backgroundColor: theme.colors.tertiary, borderWidth: 1, borderColor: theme.colors.primary} 
                     : {}
      ]}
    >
      <Text 
        style={[
          {color: theme.colors.quaternary, fontSize: theme.fontSize.s_l}, 
          !item.parent ? {color: theme.colors.quaternary, fontWeight: '500', } 
                      : {paddingVertical: theme.spacing.xs, textAlign: 'center'}
        ]}
      >
        {item.label}
        </Text>
    </View>
  )
}

const MultiSelectItem = ({item, theme}: {item: any, unselect: any, theme: any}) => {
  return (
    
    <View style={[{paddingHorizontal: theme.spacing.xs, paddingVertical: theme.spacing.xxs, margin: theme.spacing.xs, backgroundColor: theme.colors.tertiary, borderWidth: 0.5, borderColor: theme.colors.quaternary, borderRadius: 8}]}>
      <Text style={[{color: theme.colors.quaternary, fontSize: theme.fontSize.s_l}]}>
        {item.label}
      </Text>
    </View>
  )
}

export default AddItemScreen

// Component for the 'weather' & 'conditions' buttons
type ButtonPressType = {
  value: boolean,
  handler: () => void,
  icon: string,
  color_background: string,
  color_icon: string
}
const ButtonPress = ({value, handler, icon, color_background, color_icon}: ButtonPressType) => {

  return (
    <TouchableOpacity 
      containerStyle={[styles.season, value ? {backgroundColor: color_background} : {}]}
      onPress={handler}
    >
      <MaterialCommunityIcons name={icon} color={color_icon} size={Theme.fontSize.m_l} />
    </TouchableOpacity>
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
    fontWeight: '200',
    // borderWidth: 1,
    flex: 1,
  },

  container: {
    flex: 1,
    // maxHeight: '35%',
    maxHeight: '80%',
    justifyContent: 'center',
    borderRadius: Theme.spacing.m,
    elevation: Theme.spacing.elevation,
  },

  container_upload: {
    flex: 1, 
    margin: Theme.spacing.s, 
    borderRadius: Theme.spacing.s, 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  no_item_text: {
    fontSize: Theme.fontSize.l_s,
    fontWeight: '200'
  },

  image_enlarge_icon: {
    position: 'absolute',
    zIndex: 20,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    padding: Theme.spacing.xs,
    borderRadius: Theme.spacing.s,
  },

  container_clothing_settings: {
    flexDirection: 'row',
    marginTop: Theme.spacing.m,
    gap: Theme.spacing.ms,
  },

  setting: {
    flex: 0.5,
    borderRadius: Theme.spacing.m,
    
    // Shadow to the setting containers
                                                  
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // elevation: 10,
  },

  setting_title: {
    fontSize: Theme.fontSize.s_l,
    fontWeight: '200',
    paddingHorizontal: Theme.spacing.m,
    paddingTop: Theme.spacing.xxs
  },
  
  setting_input: {
    textAlign: 'center',
    textAlignVertical: 'center', 
    paddingHorizontal: Theme.spacing.ms,
    paddingVertical: 0,
    paddingBottom: Theme.spacing.s,
  },

  container_seasons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    paddingBottom: Theme.spacing.s,
  },

  season: {
    borderRadius: Theme.spacing.s,
    padding: Theme.spacing.xs,
  },

  container_colors: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: Theme.spacing.s,
    paddingVertical: Theme.spacing.xs,
    paddingBottom: Theme.spacing.s,
  },

  button: {
    position: 'relative',
    bottom: 0,
    paddingVertical: Theme.spacing.m,
    borderRadius: Theme.spacing.l,
    marginVertical: Theme.spacing.m,

    borderWidth: Theme.spacing.xxs,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: Theme.spacing.elevation,
  },

  button_text: {
    fontSize: Theme.fontSize.m_m,
    fontWeight: '500',
    alignSelf: 'center',
  }
})