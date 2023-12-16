import { ActivityIndicator, Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui';
import { Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableHighlight } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedGradient from '../components/AnimatedGradient';
import { getDBConnection } from '../assets/database/db-service';
import { getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import { ClothingItem } from '../assets/database/models';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const animate = props.props;

  // TEST: if the added image was correctly added to the DB and can be displayed
  const [extra, setExtra] = useState<ClothingItem[]>([]);
  const [top, setTop] = useState<ClothingItem[]>([]);
  const [bottom, setBottom] = useState<ClothingItem[]>([]);
  const [feet, setFeet] = useState<ClothingItem[]>([]);

  const loadOutfit = async () => {
    const db = await getDBConnection()
    await getClothingItems(db, 'extra').then((res) => setExtra(res))
    await getClothingItems(db, 'top').then((res) => setTop(res))
    await getClothingItems(db, 'bottom').then((res) => setBottom(res))
    await getClothingItems(db, 'feet').then((res) => setFeet(res))

    console.log(extra)

  }

  useEffect(() => {
    loadOutfit()
  }, [])

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
      <AnimatedGradient props={animate}/>

      <Text style={[styles.header, dynamicStyle.textHeader]}>
        Today's Outfit
      </Text>

      <View style={styles.container}>
        <View style={[styles.container_clothing, dynamicStyle.container_clothing]}>

          <View style={[styles.container_section, {gap: -2.5 * extra.length}]}>
            {/* Show each image of the 'Extra' items */}
            {extra?.map((item) => 
              <View style={{flex: 0.8, aspectRatio: 1}}>
                <Image source={{uri: item.image}} style={{flex: 1, 
                  transform: [
                  // { perspective: 850 },
                  // { translateX: - Dimensions.get('window').width * 0.24 },
                  // { rotateY: '45deg'} //TODO: Animate this 
                ]}} 
                />
              </View>
              )
            }
          </View>
          <View style={[styles.container_section, {gap: -2.5 * top.length}]}>
            {top?.map((item) => 
              <View style={{flex: 0.8, aspectRatio: 1}}>
                <Image source={{uri: item.image}} style={{flex: 1, 
                  transform: [
                  { perspective: 200 },
                  // { translateX: - Dimensions.get('window').width * 0.24 },
                  { rotateY: '45deg'} //TODO: Animate this 
                ]}} 
                />
              </View>
              )
            }
          </View>
          <View style={[styles.container_section, {gap: -2.5 * bottom.length}]}>
            {top?.map((item) => 
              <View style={{flex: 0.8, aspectRatio: 1}}>
                <Image source={{uri: item.image}} style={{flex: 1, 
                  transform: [
                  { perspective: 200 },
                  // { translateX: - Dimensions.get('window').width * 0.24 },
                  { rotateY: '45deg'} //TODO: Animate this 
                ]}} 
                />
              </View>
              )
            }
          </View>
          <View style={[styles.container_section, {gap: -2.5 * feet.length}]}>
            {top?.map((item) => 
              <View style={{flex: 0.8, aspectRatio: 1}}>
                <Image source={{uri: item.image}} style={{flex: 1, 
                  transform: [
                  { perspective: 200 },
                  // { translateX: - Dimensions.get('window').width * 0.24 },
                  { rotateY: '45deg'} //TODO: Animate this 
                ]}} 
                />
              </View>
              )
            }
          </View>
        </View>
        <View style={styles.container_items}>
          
          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text style={[styles.category_text, dynamicStyle.category_text]}>Extras</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
              </TouchableOpacity>
              
            </View>
            {/* Show the title of each item in the 'Extra' category */}
            {extra?.map((item) => 
                <Text style={styles.item_name}>{item.adjective + ' ' + item.subtype[0].toUpperCase() + item.subtype.slice(1)}</Text>
                )
              }
          </View>

          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <View style={styles.container_category}>

              <Text style={[styles.category_text, dynamicStyle.category_text]}>Tops</Text>

              <TouchableOpacity style={[styles.add_item, dynamicStyle.add_item]} onPress={()=>{Alert.alert('ok')}}>
                <MaterialCommunityIcons name="plus" color={currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
              </TouchableOpacity>

            </View>
            {/* Show the title of each item in the 'Top' category */}
            {top?.map((item) => 
              <Text style={styles.item_name}>{item.adjective + ' ' + item.subtype[0].toUpperCase() + item.subtype.slice(1)}</Text>
              )
            }
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
    display: 'flex',
    flexDirection: 'row',
    gap: Theme.spacing.m,
    height: '70%'
  },

  container_clothing: {
    flex: 0.52,
    borderRadius: Theme.spacing.m,
  },

  container_section: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
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
    fontSize: Theme.fontSize.m_l,
    fontWeight: '200' 
  },

  add_item: {
    alignSelf: 'center',
    padding: Theme.spacing.xs,
    borderRadius: Theme.spacing.m
  },

  item_name: {
    
  }
})

export default HomeScreen

