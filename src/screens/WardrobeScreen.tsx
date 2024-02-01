import { Alert, Animated, BackHandler, Easing, FlatList, Image, LayoutAnimation, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AnimatedGradient from '../components/AnimatedGradient'
import { DarkTheme, Theme, mainAnimation, swipeAnimation } from '../defaults/ui';
import { getDBConnection } from '../assets/database/db-service';
import { ClothingItem } from '../assets/database/models';
import { deleteClothingItem, deleteClothingItems, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SvgXml } from 'react-native-svg';
import { icons } from '../defaults/custom-svgs';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import ItemShowcase from '../components/ItemShowcase';
import DropDownPicker from 'react-native-dropdown-picker';
 

const WardrobeScreen = ({...props}) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const fadeAnimation = props.fadeAnimation;

  const navigator = useNavigation();
  const isFocused = useIsFocused();

  // Associative object
  const [filter] = useState<{[key: string]: number}>({
    'extra': 0,
    'top': 1,
    'bottom': 2,
    'footwear': 3
  })
  const [avgAspectRatio, setAvgAspectRatio] = useState(0.71);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [shownItems, setShownItems] = useState<ClothingItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [itemsSelected, setItemsSelected] = useState<Array<number | null>>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // TODO: Debug only! Duplicate selected elements (inefficiently)
  const duplicateSelected = () => {
    if (!itemsSelected) return;
    
    const newItems = items.filter((item) => {
      return itemsSelected.indexOf(item.id) != -1 ? true : false
    })
    let lastId = [...items].reduce((acc, item) => item.id ? acc < item.id ? item.id : acc : acc, 0);
    
    let newNewItems = new Array<any>;
    newItems.forEach((item) => {
      lastId = lastId + 1
      newNewItems.push({...item, id: lastId})
    })
    setItems([...items, ...newNewItems])
  }
  
  const deleteSelected = () => {
    deleteMultipleFromDatabase(itemsSelected)
  }

  const deleteMultipleFromDatabase = async (ids: Array<number | null>) => {
    if (!ids) return;
    
    const db = await getDBConnection()
    try {
    await deleteClothingItems(db, ids)
    .then((res) => {
      setItemsSelected([])
      setRefreshing(true)
    })} catch (e) {console.log(e)}                                 
  }

  const filterItems = (type: string) => {
    setSelectedType(type)
    let filteredItems;

    // Group items by type: extra > top > bottom > footwear
    if (type == 'all')
      filteredItems = items.sort((a, b) => 
        filter[a.type] < filter[b.type] ? -1 : (filter[a.type] > filter[b.type] ? 1 : 0)
      )
    // Group items by given type
    else 
      filteredItems = items.filter((item) => {return item.type == type})
    
    // Get average aspect ratio of shown images
    const aspect_ratio = filteredItems.reduce((prev, current) => {
      return prev + current.aspect_ratio
    }, 0)
    setAvgAspectRatio(aspect_ratio / filteredItems.length)

    LayoutAnimation.configureNext(swipeAnimation)
    setShownItems(filteredItems)
  }
  
  const loadItems = async () => {
    const db = await getDBConnection()
    await getClothingItems(db).then((res) => {
      setSelectedType(() => 'all'), 
      setItems(res),
      setRefreshing(false)
    })
  }

  // Refresh everytime 'refreshing' or the screen is in focus
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

  // Unselect (selected items) handle for back button behavior 
  useFocusEffect(
    React.useCallback(() => {

      const onBackPress = () => {
        if (itemsSelected.length > 0) {
          setItemsSelected([]);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [itemsSelected.length])
  );

  // Dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('clothes');
  const [options, setOptions] = useState([
    {label: 'Clothes', value: 'clothes'},
    {label: 'Outfits', value: 'outfits'}
  ]);

  // Force gradient update by updating its key
  const gradientKey = isDarkMode ? 'dark_update_gradient' : 'light_update_gradient';

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    header: {backgroundColor: currentTheme.colors.background},
    header_dropdown_container: {backgroundColor: currentTheme.colors.secondary, borderColor: currentTheme.colors.background},
    header_label: {color: currentTheme.colors.tertiary},
    header_text: {color: currentTheme.colors.background},
    separator: {backgroundColor: currentTheme.colors.background},
    list_empty_text: {color: currentTheme.colors.tertiary},
    list: {backgroundColor: currentTheme.colors.background}
  })

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={fadeAnimation} key={gradientKey}/>
      <View style={styles.header_container}>
        
        <DropDownPicker 
          style={[styles.header, dynamicStyle.header]}
          textStyle={[styles.header_text, dynamicStyle.header_text]}
          dropDownContainerStyle={[styles.header_dropdown_container, dynamicStyle.header_dropdown_container]}
          containerStyle={styles.header_dropdown}
          labelStyle={[styles.header_label, dynamicStyle.header_label]}
          itemSeparatorStyle={[styles.separator, dynamicStyle.separator]}
          itemSeparator={true}
          items={options}
          open={open}
          value={value} 
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          showTickIcon={false}
          onOpen={() => LayoutAnimation.configureNext(swipeAnimation)}
          onClose={() => LayoutAnimation.configureNext(swipeAnimation)}
        />
        
        <View style={styles.button_container}>
        { !itemsSelected.length ?
          // Filter categories
          <>
            <TouchableOpacity onPress={() => filterItems('extra')} style={{padding: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.extra} color={selectedType == 'extra' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('top')} style={{padding: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.top} color={selectedType == 'top' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('bottom')} style={{padding: Theme.spacing.xs}}>
              <SvgXml xml={icons.bottom} fill={selectedType == 'bottom' ? currentTheme.colors.primary : currentTheme.colors.tertiary} height={currentTheme.fontSize.m_l} width={currentTheme.fontSize.m_l}/>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => filterItems('footwear')} style={{padding: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.footwear} color={selectedType == 'footwear' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => filterItems('all')} style={{padding: Theme.spacing.xs}}>
              <MaterialCommunityIcons name={icons.all} color={selectedType == 'all' ? currentTheme.colors.primary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_l} />
            </TouchableOpacity>
          </>

          :
          // Selected items actions (TODO)
          <>
            <TouchableOpacity 
              onPress={() => navigator.navigate('AddOutfitScreen', {items_ids: itemsSelected})} 
              style={{padding: Theme.spacing.xs}}
            >
              <MaterialCommunityIcons 
                name={icons.create_outfit} 
                color={currentTheme.colors.tertiary} 
                size={Theme.fontSize.m_l} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Alert.alert('Feature not implemented yet.')} 
              style={{padding: Theme.spacing.xs}}
            >
              <MaterialCommunityIcons 
                name={icons.favorite} 
                color={currentTheme.colors.tertiary} 
                size={Theme.fontSize.m_l} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => deleteSelected()} 
              style={{padding: Theme.spacing.xs}}
            >
              <MaterialCommunityIcons 
                name={icons.delete} 
                color={currentTheme.colors.delete} 
                size={Theme.fontSize.m_l} 
              />
            </TouchableOpacity>
          </>
        }
        </View>
        
      </View>
      <View style={{maxHeight: '85%'}}>
        <FlatList
          data={shownItems}
          // TODO: Move this to 'styles'
          style={[styles.list, dynamicStyle.list]}
          contentContainerStyle={[styles.container_content]}
          columnWrapperStyle={[styles.container_wrapper]}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              progressBackgroundColor={currentTheme.colors.secondary}
              colors={[currentTheme.colors.background, currentTheme.colors.quaternary]}
            />
          }
          keyExtractor={(item) => 'key_items_listed_' + item.id?.toString() ?? '0'}
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
              selectOnly={false}
              setSelectedItems={setItemsSelected}
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




const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: Theme.spacing.page,
  },
  
  header_container: {
    marginVertical: Theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  //TODO: fix internal 
  header: {
    borderWidth: 0,
    paddingLeft: 0,
    paddingVertical: 0,
  },

  header_dropdown_container: {    
    borderWidth: Theme.spacing.xxs,
    paddingVertical: Theme.spacing.xs,
  },
  
  header_dropdown: {    
    maxWidth: '46%',
    paddingTop: 8,
  },

  header_text: {
    fontSize: Theme.fontSize.m_l,
    fontWeight: '200',
  },

  header_label: {
    alignSelf: 'flex-start',
    fontSize: Theme.fontSize.l_s,
    fontWeight: '200',
  },

  separator: {
    height: 0.7, 
  },

  button_container: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },

  container_content: {
    gap: Theme.spacing.s, // Vertical gap
    paddingVertical: Theme.spacing.s,
  },

  container_wrapper: {
    justifyContent: 'space-evenly',
    // gap: Theme.spacing.xxs, // Horizontal gap,
  },
  
  list: { 
    paddingHorizontal: Theme.spacing.s,
    borderRadius: Theme.spacing.m, 
    elevation: Theme.spacing.elevation
  },

  list_empty: {
    alignItems: 'center',
    gap: Theme.spacing.s
  },

  list_empty_text: {
    fontSize: Theme.fontSize.m_m
  },

})