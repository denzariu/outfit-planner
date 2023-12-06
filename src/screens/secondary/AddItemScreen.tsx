import { Button, Image, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import AnimatedGradient from '../../components/AnimatedGradient'
import { DarkTheme, Theme } from '../../defaults/ui'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import { getColors } from 'react-native-image-colors'
import { useNavigation } from '@react-navigation/native'

const AddItemScreen = () => {

  const navigator = useNavigation();
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const [focused, setFocus] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<boolean[]>([false, false, false, false]);
  const [weather, setWeather] = useState<boolean[]>([false, false, false, false]);

  const [image, setImage] = useState<any>(null);
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
  const [value, setValue] = useState('jacket');
  const [items, setItems] = useState([
    {label: 'Extras', value: 'extra'},
    {parent: 'extra', label: 'Hat', value: 'hat'},
    {parent: 'extra', label: 'Ring(s)', value: 'ring(s)'},
    {parent: 'extra', label: 'Scarf', value: 'scarf'},
    {parent: 'extra', label: 'Tie', value: 'tie'},
    {parent: 'extra', label: 'Belt', value: 'belt'},



    {label: 'Top', value: 'top'},
    {parent: 'top', label: 'Sweater', value: 'sweater'},
    {parent: 'top', label: 'Jacket', value: 'jacket'},
    {parent: 'top', label: 'T-Shirt', value: 'tshirt'},
    {parent: 'top', label: 'Coat', value: 'coat'},
    {parent: 'top', label: 'Shirt', value: 'shirt'},
    {parent: 'top', label: 'Vest', value: 'vest'},
    {parent: 'top', label: 'Blouse', value: 'blouse'},
    {parent: 'top', label: 'Suit', value: 'suit'},
    {parent: 'top', label: 'Cardigan', value: 'cardigan'},
    {parent: 'top', label: 'Dress', value: 'dress'},



    {label: 'Bottom', value: 'bottom'},
    {parent: 'bottom', label: 'Jeans', value: 'jeans'},
    {parent: 'bottom', label: 'Pants', value: 'pants'},
    {parent: 'bottom', label: 'Skirt', value: 'skirt'},


  ]);

  const [valuesFabrics, setValuesFabrics] = useState(['cotton']);
  const [fabrics, setFabrics] = useState([
    {"label": "Cotton", "value": "cotton"},
    {"label": "Polyester", "value": "polyester"},
    {"label": "Silk", "value": "silk"},
    {"label": "Wool", "value": "wool"},
    {"label": "Linen", "value": "linen"},
    {"label": "Rayon", "value": "rayon"},
    {"label": "Nylon", "value": "nylon"},
    {"label": "Spandex", "value": "spandex"},
    {"label": "Acrylic", "value": "acrylic"},
    {"label": "Velvet", "value": "velvet"},
    {"label": "Satin", "value": "satin"},
    {"label": "Chiffon", "value": "chiffon"},
    {"label": "Denim", "value": "denim"},
    {"label": "Flannel", "value": "flannel"},
    {"label": "Tulle", "value": "tulle"},
    {"label": "Cashmere", "value": "cashmere"},
    {"label": "Leather", "value": "leather"},
    {"label": "Suede", "value": "suede"},
    {"label": "Corduroy", "value": "corduroy"},
    {"label": "Organza", "value": "organza"},
    {"label": "Tweed", "value": "tweed"},
    {"label": "Chambray", "value": "chambray"},
    {"label": "Taffeta", "value": "taffeta"},
    {"label": "Georgette", "value": "georgette"},
    {"label": "Jersey", "value": "jersey"},
    {"label": "Fleece", "value": "fleece"},
    {"label": "Brocade", "value": "brocade"},
    {"label": "Tencel", "value": "tencel"},
    {"label": "Hemp", "value": "hemp"},
    {"label": "Bamboo", "value": "bamboo"}
  ]);

  const onChangeName = (value: string) => {
    setName(value)
  }

  useEffect(() => {
    getColors(image, {
      fallback: Theme.colors.primary,
      cache: true,
      key: image,
    })
    .then((colorz) => {setColors(() => {return colorz}), setMainColor(() => {return colorz.average})})
    .catch(e => {console.log("error")})
    
  }, [image])

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.7,
      allowsMultipleSelection: false, 
    })
    .then((res) => {return res})

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container: {backgroundColor: mainColor, shadowColor: currentTheme.colors.foreground},
    setting: {backgroundColor: currentTheme.colors.primary},
    setting_title: {color: currentTheme.colors.quaternary + '88'},
    button: {backgroundColor: currentTheme.colors.secondary, shadowColor: currentTheme.colors.foreground, borderColor: currentTheme.colors.tertiary},
    button_text: {color: currentTheme.colors.background}
  })

  function seasonPress (season: number) {
    setSeasons(() => { return [
      ...seasons.slice(0,season),
      seasons[season]= !seasons[season],
      ...seasons.slice(season+1, seasons.length)
    ]})
  }

  function weatherPress (w: number) {
    setWeather(() => { return [
      ...weather.slice(0,w),
      weather[w]= !weather[w],
      ...weather.slice(w+1, weather.length)
    ]})
  }

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      {/* <AnimatedGradient props={animate}/> */}
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', marginVertical: Theme.spacing.m, marginTop: Theme.spacing.l, gap: Theme.spacing.l}}>
        <TouchableOpacity 
          children={<MaterialCommunityIcons name="arrow-left" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.l_s} />}
          onPress={() => navigator.goBack()}
        />
        <Text style={[styles.header, dynamicStyle.textHeader]}>
          {name == '' ? 'Add Item' : name + ' ' + value.charAt(0).toUpperCase() + value.slice(1)}
        </Text>
      </View>
      <TouchableOpacity containerStyle={[styles.container, dynamicStyle.container]} onPress={addImage}>
        {!image && 
          <View style={styles.container_upload}>
            {/* <Text style={styles.no_item_text}>Upload</Text> */}
            <View style={{position: 'absolute', bottom: 0, top: Theme.spacing.xxl * 2, zIndex: 10}}>
              <MaterialCommunityIcons name="upload" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.l_l*1.2} />
            </View>
            <MaterialCommunityIcons name="tshirt-crew" color={seasons[0] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.l_l*3} />
          </View>
        }
        {image && <Image source={{ uri: image }} style={{ flex: 1, margin: Theme.spacing.xl, borderRadius: Theme.spacing.s, aspectRatio: 1, width: null, height: null }} />}
      </TouchableOpacity>

      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Name</Text>
          <TextInput 
            style={[styles.setting_input, {fontSize: name != '' ? Theme.fontSize.m_s : Theme.fontSize.s_l}]}
            numberOfLines={1}
            multiline={false}
            placeholder="'Cozy', 'Red', 'Long'..."
            placeholderTextColor={currentTheme.colors.background}
            onChangeText={(text) => onChangeName(text)}
            value={name}
          />
        </View>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Category</Text>

          <Dropdown
            // mode='modal'
            renderItem={(item) => {return <CategoryItem item={item} theme={currentTheme}/>}}
            data={items}
            labelField={'label'}
            valueField={'value'}
            value={value}
            onChange={(item)=>{
              setValue(item.value)
              setFocus(false)
            }}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            showsVerticalScrollIndicator={false}
            autoScroll={true}
            // dropdownPosition='top'
            placeholder='Type of clothing'
            renderRightIcon={() =>
              <MaterialCommunityIcons name="menu-down" color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            }
            // mode='modal'
            // backgroundColor={currentTheme.colors.primary}
            style={{borderRadius: currentTheme.spacing.m, marginHorizontal: 8}}
            containerStyle={{borderRadius: currentTheme.spacing.m, backgroundColor: currentTheme.colors.primary}}
            itemContainerStyle={{
              // borderRadius: currentTheme.spacing.m, //     <-- for a more round style
              // height: Theme.spacing.s + Theme.fontSize.l_m,
              backgroundColor: currentTheme.colors.primary
            }}
            selectedTextStyle={{fontSize: Theme.fontSize.m_s, color: currentTheme.colors.quaternary, textAlign: 'center', textAlignVertical: 'center',}}
            itemTextStyle={{fontSize: Theme.fontSize.s_l, textAlign: 'center', color: currentTheme.colors.quaternary}}
            activeColor={currentTheme.colors.secondary}
            // placeholderStyle={{paddingHorizontal: 16}}

          />
          
        </View>
      </View>
      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Seasons</Text>
          <View style={styles.container_seasons} key={seasons[0] ? 'update' : 'up'}>
            <TouchableOpacity 
              containerStyle={[styles.season, seasons[0] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => seasonPress(0)}
            >
              <MaterialCommunityIcons name="snowflake-variant" color={seasons[0] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, seasons[1] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => seasonPress(1)}
            >  
              <MaterialCommunityIcons name="flower-poppy" color={seasons[1] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, seasons[2] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => seasonPress(2)}
            >
              <MaterialCommunityIcons name="white-balance-sunny" color={seasons[2] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, seasons[3] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => seasonPress(3)}
            >
              <MaterialCommunityIcons name="leaf" color={seasons[3] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title, dynamicStyle.setting_title]}>Weather</Text>
          <View style={styles.container_seasons} key={weather[0] ? 'update' : 'up'}>
            <TouchableOpacity 
              containerStyle={[styles.season, weather[0] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => weatherPress(0)}
            >
              <MaterialCommunityIcons name="weather-snowy-heavy" color={weather[0] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, weather[1] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => weatherPress(1)}
            >  
              <MaterialCommunityIcons name="weather-partly-cloudy" color={weather[1] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, weather[2] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => weatherPress(2)}
            >
              <MaterialCommunityIcons name="weather-pouring" color={weather[2] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
            <TouchableOpacity 
              containerStyle={[styles.season, weather[3] ? {backgroundColor: currentTheme.colors.tertiary} : {}]}
              onPress={() => weatherPress(3)}
            >
              <MaterialCommunityIcons name="weather-windy" color={weather[3] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
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
              style={[{padding: Theme.spacing.l, borderRadius: Theme.spacing.s, borderWidth: Theme.spacing.xxs, borderColor: currentTheme.colors.primary}, {backgroundColor: colors.vibrant}, mainColor == colors.vibrant ? {borderColor: mainColor, borderWidth: Theme.spacing.xxs} : {}]}
              onPress={() => setMainColor(colors.vibrant)}
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
            // visibleSelectedItem={false}
            placeholder="Add fabrics..."
            placeholderStyle={{textAlign: 'center', opacity: 0.5}}

            renderRightIcon={() =>
              <MaterialCommunityIcons name="menu-down" color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_l} />
            }
            backgroundColor={currentTheme.colors.tertiary + '80'}
            style={{flex: 1, paddingHorizontal: 8}}
            containerStyle={{borderRadius: currentTheme.spacing.m, backgroundColor: currentTheme.colors.primary}}
            itemContainerStyle={{
              // borderRadius: currentTheme.spacing.m, //     <-- for a more round style
              // height: Theme.spacing.s + Theme.fontSize.l_m,
              backgroundColor: currentTheme.colors.primary,
            }}
            maxSelect={6}
            inside={true}
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
        onPress={() => setMainColor(colors.vibrant)}
        children={<Text style={[styles.button_text, dynamicStyle.button_text]}>Add to Collection</Text>}
      />
      
    </SafeAreaView>
  )
}

const CategoryItem = ({item, theme}: {item: any, theme: any}) => {
  return (
    
    <View style={[{paddingHorizontal: theme.spacing.s}, !item.parent ? {backgroundColor: theme.colors.tertiary, borderWidth: 1, borderColor: theme.colors.primary} : {}]}>
      <Text style={[{color: theme.colors.quaternary, fontSize: theme.fontSize.s_l}, !item.parent ? {color: theme.colors.quaternary, fontWeight: '500', } : {paddingVertical: theme.spacing.xs, textAlign: 'center'}]}>{item.label}</Text>
    </View>
  )
}

const MultiSelectItem = ({item, theme}: {item: any, unselect: any, theme: any}) => {
  return (
    
    <View style={[{paddingHorizontal: theme.spacing.xs, paddingVertical: theme.spacing.xxs, margin: theme.spacing.xs, backgroundColor: theme.colors.tertiary, borderWidth: 0.5, borderColor: theme.colors.quaternary, borderRadius: 8}]}>
      <Text style={[{color: theme.colors.quaternary, fontSize: theme.fontSize.s_l}]}>{item.label}</Text>
    </View>
  )
}

export default AddItemScreen

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: Theme.spacing.page,
  },
  
  header: {
    alignSelf: 'flex-start',
    fontSize: Theme.fontSize.l_s,
    fontWeight: '200'
  },

  container: {
    // aspectRatio: 1,
    
    height: '40%',
    borderRadius: Theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },

  container_upload: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: -Theme.spacing.s
  },

  no_item_text: {
    fontSize: Theme.fontSize.l_s,
    fontWeight: '200'
  },

  container_clothing_settings: {
    // flex: 1,
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
    elevation: 10,
  },

  button_text: {
    fontSize: Theme.fontSize.m_m,
    fontWeight: '500',
    alignSelf: 'center',
  }
})