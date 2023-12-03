import { Image, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import AnimatedGradient from '../../components/AnimatedGradient'
import { DarkTheme, Theme } from '../../defaults/ui'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import DropDownPicker from 'react-native-dropdown-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dropdown } from 'react-native-element-dropdown'


const AddItemScreen = () => {

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const [focused, setFocus] = useState<boolean>(false);
  const [seasons, setSeasons] = useState<boolean[]>([false, false, false, false]);
  const [weather, setWeather] = useState<boolean[]>([false, false, false, false]);

  const [image, setImage] = useState<any>(null);
  const [value, setValue] = useState('jacket');
  const [items, setItems] = useState([
    {label: 'Tops', value: 'tops'},
    {parent: 'tops', label: 'Sweater', value: 'sweater'},
    {parent: 'tops', label: 'Jacket', value: 'jacket'},
    {parent: 'tops', label: 'T-Shirt', value: 'tshirt'},


    {label: 'Bottoms', value: 'bottoms'},
    {parent: 'bottoms', label: 'Jeans', value: 'jeans'},
    {parent: 'bottoms', label: 'Pants', value: 'pants'},

  ]);

  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.7,
      allowsMultipleSelection: false, 
    });    

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container: {backgroundColor: currentTheme.colors.tertiary},
    setting: {backgroundColor: currentTheme.colors.primary}
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

      <Text style={[styles.header, dynamicStyle.textHeader]}>
        Add Item
      </Text>
      <TouchableOpacity containerStyle={[styles.container, dynamicStyle.container]} onPress={addImage}>
        {!image && 
          <View style={styles.container_upload}>
            {/* <Text style={styles.no_item_text}>Upload</Text> */}
            <View style={{position: 'absolute', bottom: 0, top: Theme.spacing.xxl * 2, zIndex: 10}}><MaterialCommunityIcons name="upload" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.l_l*1.5} />
            </View>
            <MaterialCommunityIcons name="tshirt-crew" color={seasons[0] ? currentTheme.colors.quaternary : currentTheme.colors.quaternary} size={currentTheme.fontSize.l_l*4} />
          </View>
        }
        {image && <Image source={{ uri: image }} style={{ flex: 1, margin: Theme.spacing.xl, borderRadius: Theme.spacing.s, aspectRatio: 1, width: null, height: null }} />}
      </TouchableOpacity>

      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title]}>Name</Text>
          <TextInput 
            numberOfLines={1}
            multiline={false}
            placeholder="e.g. 'Cozy', 'Red', 'Long'..."
            style={styles.setting_input}
          />
        </View>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title]}>Category</Text>

          <Dropdown
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
            activeColor={currentTheme.colors.tertiary}
            // placeholderStyle={{paddingHorizontal: 16}}

          />
          
        </View>
      </View>
      <View style={styles.container_clothing_settings}>
        <View style={[styles.setting, dynamicStyle.setting]}>
          <Text style={[styles.setting_title]}>Seasons</Text>
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
          <Text style={[styles.setting_title]}>Weather</Text>
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
      
    </SafeAreaView>
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
    marginVertical: Theme.spacing.m,
    marginTop: Theme.spacing.l,
    fontWeight: '200'
  },

  container: {
    height: '50%',
    borderRadius: Theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
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
    gap: Theme.spacing.ms
  },

  setting: {
    flex: 0.5,
    borderRadius: Theme.spacing.m,
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
    fontSize: Theme.fontSize.s_l
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
  }
})