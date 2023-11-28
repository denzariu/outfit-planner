import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { DarkTheme, Theme } from '../defaults/ui';
import { Image } from 'react-native';

const HomeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const backgroundStyle = {backgroundColor: currentTheme.colors.background}

  return (
    
    <SafeAreaView style={[styles.page, backgroundStyle]}>
      <Text>hi</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.page,
  },
})

export default HomeScreen

