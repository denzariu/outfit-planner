import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import OutfitOrganizer from './OutfitOrganizer'
import { ClothingItem, Outfit } from '../assets/database/models'

type OutfitCreationProps = {
  outfit?: Outfit,
  items: ClothingItem[]
}

const OutfitCreation = ({outfit, items}: OutfitCreationProps) => {

  const [allItemsIds, setAllItemsIds] = useState<number[]>([]);

  useEffect(() => {
    console.log({items: items})
    // setAllItemsIds(items.map((i => i.id ?? -1)))
    
  }, [items])

  return (
    <OutfitOrganizer
      items={items}
      allItemsIds={allItemsIds}
      setAllItemsIds={setAllItemsIds}
      transparent={false}
    />
  )
}

export default OutfitCreation

const styles = StyleSheet.create({})