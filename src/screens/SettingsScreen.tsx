import { Alert, SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { DarkTheme, Theme } from '../defaults/ui';
import AnimatedGradient from '../components/AnimatedGradient';
import { Button } from 'react-native-paper';

const SettingsScreen = ({...props}) => {
  const fadeAnimation = props.fadeAnimation;

  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    text_header: {color: currentTheme.colors.tertiary},
  })

  
  // Force gradient update by updating its key
  const gradientKey = isDarkMode ? 'dark_update_gradient' : 'light_update_gradient';

  
  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>      
      <AnimatedGradient props={fadeAnimation} key={gradientKey}/>
      <View style={styles.header_container}>
        {/* Header title */}
        <Text style={[styles.header, dynamicStyle.text_header]}>
          Settings
        </Text>
      </View>
      
      {/* TODO: Testing different aesthetics */}
      <Text style={dynamicStyle.text_header}>No settings available at the moment :)</Text>
      <Button 
        onPress={() => Alert.alert('Nice')}
        labelStyle={{
          fontWeight: '100'
        }}
        rippleColor={currentTheme.colors.secondary}
        textColor={currentTheme.colors.secondary}
        style={{flex: 1, alignItems: 'flex-start', marginTop: Theme.spacing.s}}
        uppercase={false}
        children={<Text>This button is cool</Text>}
      />
    </SafeAreaView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
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

})