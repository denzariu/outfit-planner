import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { Animated, StyleSheet, LayoutAnimation, Easing, TouchableOpacity, Image, Text } from "react-native";
import { ClothingItem } from "../assets/database/models";
import { Theme } from "../defaults/ui";
import ItemSelector from "./ItemPicker";

// Responsible for each shown item on the Wardrobe page
type ItemShowcaseProps = {
  item: ClothingItem,
  index: number,
  currentTheme: any,
  aspectRatio: number,
  showCategory?: boolean,
  // Controls whether the item will be selectable or editable on normal press 
  selectOnly: boolean,  
  setSelectedItems: React.Dispatch<React.SetStateAction<(number | null)[]>>
  selectedItems: Array<any>,
}

// Item Component
const ItemShowcase = (props: ItemShowcaseProps) => {
  const navigator = useNavigation();

  const {item, index, currentTheme, aspectRatio, showCategory, selectOnly, setSelectedItems, selectedItems} = props || {}

  const [selected, setSelected] = useState<boolean>(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [animatedValuePress] = useState(new Animated.Value(0));

  const dynamicStyle = StyleSheet.create({
    article_container: selected ? {margin: 0, borderColor: currentTheme.colors.secondary, backgroundColor: currentTheme.colors.quaternary, borderWidth: Theme.spacing.xs}
                                : {margin: Theme.spacing.xs, backgroundColor: currentTheme.colors.background},
    article_title: selected ? {backgroundColor: currentTheme.colors.secondary, color: currentTheme.colors.quaternary}
                            : {backgroundColor: currentTheme.colors.tertiary, color: currentTheme.colors.quaternary, borderBottomLeftRadius: Theme.spacing.s, borderBottomRightRadius: Theme.spacing.s},
    article_image: {aspectRatio: aspectRatio},
    article_edit: {backgroundColor: currentTheme.colors.secondary}
  })

  useEffect(() => {
    setSelected(selectedItems.indexOf(item.id) != -1 ? true : false)
  }, [selectedItems])

  // Called every time the item is selected
  const selectItem = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(150, 'easeInEaseOut', 'opacity'));

    setSelected((prevValue) => {
      // If the item was previously selected, it will get deselected,
      // and thus removed from the selected-items array
      prevValue == true ?  
        setSelectedItems((prev: Array<number | null>) => prev.filter((current) => current != item.id))
        :
        setSelectedItems((prev: Array<number | null>) => [...prev, item.id]) 

      return !prevValue
    })
    // startShake()
  }

  // Animation for long item press - deprecated :D
  // const startShake = () => {
  //   animatedValue.setValue(0);
  //   Animated.timing(animatedValue,
  //       {
  //         toValue: 1, 
  //         duration: 200,
  //         easing: Easing.linear,
  //         useNativeDriver: true
  //       }
  //   ).start()
  // }

  const animateIn = () => {
    Animated.timing(animatedValuePress,
      {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
  }

  const animateOut = () => {
    Animated.timing(animatedValuePress,
      {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true
      }).start()
  }

  return (
    <Animated.View 
      style={[
        styles.article_container, {
          transform: [{ translateY: 
            animatedValuePress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 4]})
          }],
        }
      ]}
    >
      <TouchableOpacity 
        onPressIn={() => animateIn()}
        onPressOut={() => animateOut()}
        onLongPress={() => selectItem()}
        onPress={() => (selectOnly || selectedItems.length) ? selectItem() : navigator.navigate('AddItemScreen', {item: item})}
        delayLongPress={200}
        key={'wardrobe_image_container_' + index + item.image}
        style={[styles.article, dynamicStyle.article_container]}
        activeOpacity={0.7}
      >
        <Image source={{uri: item.image}} 
          key={'wardrobe_image_' + index + item.image}
          style={[styles.article_image, dynamicStyle.article_image]}
        />
        <Text style={[styles.article_title, dynamicStyle.article_title]}>{item.adjective + ' ' + item.subtype[0].toUpperCase() + item.subtype.slice(1)}</Text>
      </TouchableOpacity>
    </Animated.View>

  )
}

const styles = StyleSheet.create({
  article_container: {
    flex: 0.32, 
    borderRadius: Theme.spacing.s,
    // paddingHorizontal: Theme.spacing.xxxs
  },

  article: {
    flex: 1,
    elevation: Theme.spacing.elevation,
    borderRadius: Theme.spacing.s,
  },

  article_image: {
    resizeMode: 'contain'
  },

  article_title: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: Theme.fontSize.s_l,
    padding: Theme.spacing.xxs,
  }
})

export default ItemShowcase