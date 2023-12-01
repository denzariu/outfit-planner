import { ActivityIndicator, Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui';
import { Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableHighlight } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
    container_clothing: {backgroundColor: currentTheme.colors.tertiary},
    container_items: {backgroundColor: currentTheme.colors.quaternary},
    container_items_category: {backgroundColor: currentTheme.colors.secondary},
    category_text: {color: currentTheme.colors.quaternary},
    add_item: {backgroundColor: currentTheme.colors.background}
  })

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
        Today's Outfit
      </Text>

      <View style={styles.container}>
        <View style={[styles.container_clothing, dynamicStyle.container_clothing]}>
        </View>
        <View style={[styles.container_items, dynamicStyle.container_items]}>
          
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
          
          {/* <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <Text style={[styles.category_text, dynamicStyle.category_text]}>Tops</Text>
          </View>
          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <Text style={[styles.category_text, dynamicStyle.category_text]}>Bottoms</Text>
          </View>
          <View style={[styles.container_items_category, dynamicStyle.container_items_category]}>
            <Text style={[styles.category_text, dynamicStyle.category_text]}>Feet</Text>
          </View> */}
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
  }
})

export default HomeScreen

