import { Animated, Easing, FlatList, Image, LayoutAnimation, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import AnimatedGradient from '../components/AnimatedGradient'
import { DarkTheme, Theme } from '../defaults/ui';
import { getDBConnection } from '../assets/database/db-service';
import { ClothingItem } from '../assets/database/models';
import { deleteClothingItem, deleteClothingItems, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SvgXml } from 'react-native-svg';
import { icons } from '../defaults/custom-svgs';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

const WardrobeScreen = (...props: any) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const animate = props.props;

  const isFocused = useIsFocused();

  // Associative object
  const [filter] = useState<{[key: string]: number}>({
    'extra': 0,
    'top': 1,
    'bottom': 2,
    'feet': 3
  })
  const [avgAspectRatio, setAvgAspectRatio] = useState(0.71);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [shownItems, setShownItems] = useState<ClothingItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [itemsSelected, setItemsSelected] = useState<Array<number | null>>([]);
  const [timeToSelect, setTimeToSelect] = useState<number>(200)

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    text_header: {color: currentTheme.colors.tertiary},
    list_empty_text: {color: currentTheme.colors.tertiary}
  })

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Animation for item deletion
  const layoutAnimConfig = {
    duration: 250,
    update: {
      // type: LayoutAnimation.Types.spring,
      // springDamping: 1
      type: LayoutAnimation.Types.easeOut, 
      property: LayoutAnimation.Properties.scaleY,

    },
    delete: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.scaleY,
      duration: 100,
      // type: LayoutAnimation.Types.easeOut,
      // property: LayoutAnimation.Properties.scaleY,
    },
  };

  // TODO: Debug only
  const duplicateSelected = () => {
    if (!itemsSelected) return;
    
    const newItems = items.filter((item) => {
      return itemsSelected.indexOf(item.id) != -1 ? true : false
    })
    let lastId = items.reduce((acc, item) => item.id ? acc < item.id ? item.id : acc : acc, 0);
    
    newItems.forEach((item) => {
      if(item.id){
        item.id = (lastId) + 1; 
        lastId = lastId + 1;
      }
    })

    setItems([...items, ...newItems])
    setItemsSelected([])
  }
  
  const deleteSelected = () => {
    deleteMultipleFromDatabase(itemsSelected)
    setItemsSelected([])
  }

  const deleteMultipleFromDatabase = async (ids: Array<number | null>) => {
    if (!ids) return;
    const db = await getDBConnection()
    await deleteClothingItems(db, ids).then((res) => {
      const newItems = items.filter((item) => {
        return ids.indexOf(item.id) == -1 ? true : false
      })
      console.log('newit ', newItems)
      setItems(newItems)
    })                                      
  }

  const deleteIndividualFromDatabase = async (id: number | null) => {
    if (!id) return;
    const db = await getDBConnection()
    await deleteClothingItem(db, id).then((res) => {
      const newItems = items.filter((item) => {return item.id != id})
      setItems(newItems)
    })                                      
  }

  const filterItems = (type: string) => {
    setSelectedType(type)
    let filteredItems;

    // Group items by type: extra > top > bottom > feet
    if (type == 'all')
      filteredItems = items.sort((a, b) => filter[a.type] < filter[b.type] ? -1 : (filter[a.type] > filter[b.type] ? 1 : 0));      
    // Group items by given type
    else 
      filteredItems = items.filter((item) => {return item.type == type})
    
    // Get average aspect ratio of shown images
    const aspect_ratio = filteredItems.reduce((prev, current) => {
      return prev + current.aspect_ratio
    }, 0)
    setAvgAspectRatio(aspect_ratio / filteredItems.length)

    LayoutAnimation.configureNext(layoutAnimConfig)
    setShownItems(filteredItems)
  }
  
  const loadItems = async () => {
    console.log('load')
    const db = await getDBConnection()
    await getClothingItems(db).then((res) => {
      setSelectedType(() => 'all'), setItems(res)
    })
  }

  // Refresh everytime 'refreshing'
  useEffect (() => {
    if (refreshing || isFocused) {
      loadItems()
      setItemsSelected([])
    }
  }, [refreshing, isFocused])

  // Any time there is an update on items, 'shownitems' should also be updated.
  useEffect (() => {
    filterItems(selectedType)
  }, [items])

  // Fast-select items if there is already a selected item
  useEffect (() => {
    console.log({selected: itemsSelected})
    itemsSelected.length ? setTimeToSelect(1) : setTimeToSelect(200)
  }, [itemsSelected])

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={animate}/>
      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.text_header]}>
          Wardrobe
        </Text>
        
        <View style={{
          // TODO: move these to 'styles'
          flex: 0.7, 
          flexDirection: 'row', 
          justifyContent: 'flex-end', 
          alignItems: 'center'
        }}>
        { !itemsSelected.length ?
          // Filter categories
          <>
            <TouchableOpacity onPress={() => filterItems('extra')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.extra} color={selectedType == 'extra' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('top')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.top} color={selectedType == 'top' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('bottom')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <SvgXml xml={icons.bottom} fill={selectedType == 'bottom' ? currentTheme.colors.primary : currentTheme.colors.tertiary} height={currentTheme.fontSize.m_l} width={currentTheme.fontSize.m_l}/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => filterItems('feet')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.feet} color={selectedType == 'feet' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('all')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.all} color={selectedType == 'all' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
          </>

          :
          // Selected items actions (TODO)
          <>
            <TouchableOpacity onPress={() => duplicateSelected()} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons 
                name={icons.duplicate} 
                color={currentTheme.colors.tertiary} 
                size={currentTheme.fontSize.m_l} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterItems('all')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons 
                name={icons.favorite} 
                color={currentTheme.colors.tertiary} 
                size={currentTheme.fontSize.m_l} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => filterItems('all')} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons 
                name={icons.create_outfit} 
                color={currentTheme.colors.tertiary} 
                size={currentTheme.fontSize.m_l} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteSelected()} style={{paddingHorizontal: Theme.spacing.xs}}>
              <MaterialCommunityIcons 
                name={icons.delete} 
                color={currentTheme.colors.delete} 
                size={currentTheme.fontSize.m_l} 
              />
            </TouchableOpacity>
          </>
        }
        </View>
        
      </View>
      <View style={{maxHeight: '80%'}}>
        <FlatList
          data={shownItems}
          // TODO: Move this to 'styles'
          style={{ 
            borderRadius: Theme.spacing.m, 
            backgroundColor: currentTheme.colors.background, 
            elevation: 4
          }}
          contentContainerStyle={[styles.container_content]}
          columnWrapperStyle={[styles.container_wrapper]}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[currentTheme.colors.tertiary, currentTheme.colors.secondary]}
            />
          }
          keyExtractor={(item) => item.id ? 'key_items_listed_' + item.id.toString() : 'key_items_listed_0'}
          ListEmptyComponent={
            <View style={[styles.list_empty, {opacity: 0.7}]}>
              <MaterialCommunityIcons 
                name={icons.missing} 
                color={currentTheme.colors.tertiary} 
                size={currentTheme.fontSize.l_l * 2} 
              />
              <Text style={[styles.list_empty_text, dynamicStyle.list_empty_text]}>No items</Text>
            </View>
          }
          renderItem={(info) => 
            <ItemShowcase 
              item={info.item} 
              index={info.index} 
              currentTheme={currentTheme} 
              aspectRatio={avgAspectRatio} 
              setSelectedItems={setItemsSelected}
              longPressDelay={timeToSelect}
              selectedItems={itemsSelected}
            />
          }
        >
        </FlatList>
      </View>
    </SafeAreaView>
  )
}

export default WardrobeScreen



// Responsible for each shown item on the Wardrobe page
type ItemShowcaseProps = {
  item: ClothingItem,
  index: number,
  currentTheme: any,
  aspectRatio: number,
  showCategory?: boolean,
  setSelectedItems: React.Dispatch<React.SetStateAction<(number | null)[]>>
  longPressDelay: number,
  selectedItems: Array<any>,
}

// Item Component
const ItemShowcase = (props: ItemShowcaseProps) => {
  const {item, index, currentTheme, aspectRatio, showCategory, setSelectedItems, longPressDelay, selectedItems} = props || {}

  const [selected, setSelected] = useState<boolean>(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const dynamicStyle = StyleSheet.create({
    article_container: selected ? {margin: 0, borderColor: currentTheme.colors.secondary, backgroundColor: currentTheme.colors.quaternary, borderWidth: Theme.spacing.xs}
                                : {margin: Theme.spacing.xs, backgroundColor: currentTheme.colors.background},
    article_image: {aspectRatio: aspectRatio},
    article_title: selected ? {backgroundColor: currentTheme.colors.secondary, color: currentTheme.colors.quaternary}
                            : {backgroundColor: currentTheme.colors.tertiary, color: currentTheme.colors.quaternary, borderBottomLeftRadius: Theme.spacing.s, borderBottomRightRadius: Theme.spacing.s},
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
  const startShake = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue,
        {
            toValue: 1, 
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true
        }
    ).start()
  }

  return (
    <Animated.View 
      style={[
        styles.article_container, {
          transform: [{ translateX: 
            animatedValue.interpolate({
            inputRange: [0, 0.25, 0.50, 0.75, 1],
            outputRange: [0, 10, 0, 10, 0]})
          }]}
      ]}
    >
      <TouchableOpacity 
        onLongPress={() => selectItem()}
        onPress={() => console.log('hi')}
        delayLongPress={longPressDelay}
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
    fontWeight: '200',
  },


  container_content: {
    gap: Theme.spacing.s, // Vertical gap
    paddingVertical: Theme.spacing.s,
  },

  container_wrapper: {
    justifyContent: 'space-evenly',
    // gap: Theme.spacing.xxs, // Horizontal gap,
  },

  list_empty: {
    alignItems: 'center',
    gap: Theme.spacing.s
  },

  list_empty_text: {
    fontSize: Theme.fontSize.m_m
  },

  article_container: {
    flex: 0.32, 
    borderRadius: Theme.spacing.s,
    // paddingHorizontal: Theme.spacing.xxxs
    
  },

  article: {
    flex: 1,
    elevation: Theme.spacing.xs,
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
  },
})