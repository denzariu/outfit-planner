import { LayoutAnimation, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import { ClothingItem } from '../assets/database/models'
import { useIsFocused } from '@react-navigation/native'
import { Theme } from '../defaults/ui'


type ItemSelectorProps = {
  handleItemSelection:  React.Dispatch<React.SetStateAction<boolean>>
  handleItemsToBeAdded: React.Dispatch<React.SetStateAction<ClothingItem[] | undefined>>
  categoryToChooseFrom: 'extra' | 'top' | 'bottom' | 'feet'
}

const ItemSelector = ({handleItemSelection, handleItemsToBeAdded}: ItemSelectorProps) => {

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Gather data

    }
  }, [isFocused])


  const close = () => {
    console.log('closed')
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));
    handleItemSelection((prev) => !prev)
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => close()}
    >
      <View style={styles.absoluteView}>
        
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ItemSelector

const styles = StyleSheet.create({
  absoluteView: {
    zIndex: 25,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.background + '88',
  }
})