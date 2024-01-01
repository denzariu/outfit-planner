import { Animated, Easing, FlatList, Image, LayoutAnimation, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import AnimatedGradient from '../components/AnimatedGradient'
import { DarkTheme, Theme } from '../defaults/ui';
import { getDBConnection } from '../assets/database/db-service';
import { ClothingItem } from '../assets/database/models';
import { deleteClothingItem, getClothingItems } from '../assets/database/db-operations/db-operations-clothingitem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SvgXml } from 'react-native-svg';
import { svgPants } from '../defaults/custom-svgs';
import { ScrollView } from 'react-native-gesture-handler';

const WardrobeScreen = (...props: any) => {
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  const animate = props.props;

  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [shownItems, setShownItems] = useState<ClothingItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  const dynamicStyle = StyleSheet.create({
    background_style: {backgroundColor: currentTheme.colors.background},
    textHeader: {color: currentTheme.colors.tertiary},
  })

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Animation for item deletion
  const layoutAnimConfig = {
    duration: 500,
    update: {
      type: LayoutAnimation.Types.linear, 
    },
    delete: {
      duration: 200,
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.scaleXY,
    },
  };

  const deleteFromDatabase = async (id: number | null) => {
    if (!id) return;
    const db = await getDBConnection()
    await deleteClothingItem(db, id).then((res) => {
      const newItems = items.filter((item) => {return item.id != id})
      setItems(newItems)
    })
  }

  const filterItems = (type: string) => {
    setSelectedType(type)

    if (type == 'all') {
      LayoutAnimation.configureNext(layoutAnimConfig)
      setShownItems(items)
      return;
    }
    const newItems = items.filter((item) => {return item.type == type})
    console.log(newItems, type)
    
    LayoutAnimation.configureNext(layoutAnimConfig)
    setShownItems(newItems)
  }
  
  const loadItems = async () => {
    const db = await getDBConnection()
    await getClothingItems(db).then((res) => {
      setSelectedType(() => 'all'), setItems(res)
    })
  }

  useEffect (() => {
    loadItems()
  }, [refreshing])

  // Any time there is an update on items, 'shownitems' should also be updated.
  useEffect (() => {
    filterItems(selectedType)
  }, [items])

  return (
    <SafeAreaView style={[styles.page, dynamicStyle.background_style]}>
      <AnimatedGradient props={animate}/>
      <View style={styles.header_container}>
        <Text style={[styles.header, dynamicStyle.textHeader]}>
          Wardrobe
        </Text>
        <View style={{flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => filterItems('extra')}>
          <MaterialCommunityIcons name= {"hat-fedora"} color={selectedType == 'extra' ? currentTheme.colors.secondary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => filterItems('top')}>
          <MaterialCommunityIcons name= {"tshirt-crew"} color={selectedType == 'top' ? currentTheme.colors.secondary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => filterItems('bottom')}>
          <SvgXml xml={svgPants} fill={selectedType == 'bottom' ? currentTheme.colors.secondary : currentTheme.colors.tertiary} height={currentTheme.fontSize.m_m} width={currentTheme.fontSize.m_m}/>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => filterItems('feet')}>
          <MaterialCommunityIcons name= {"shoe-heel"} color={selectedType == 'feet' ? currentTheme.colors.secondary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => filterItems('all')}>
          <MaterialCommunityIcons name= {"all-inclusive"} color={selectedType == 'all' ? currentTheme.colors.secondary : currentTheme.colors.tertiary} size={currentTheme.fontSize.m_m} />
          </TouchableOpacity>
        </View>
        
      </View>
      
      <FlatList
        data={shownItems}
        contentContainerStyle={[styles.container_content]}
        columnWrapperStyle={[styles.container_wrapper]}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[currentTheme.colors.tertiary, currentTheme.colors.secondary]}/>
        }
        renderItem={(info) => {return <ItemShowcase item={info.item} index={info.index} deleteItem={() => deleteFromDatabase(info.item.id)} currentTheme={currentTheme}/>}}
        keyExtractor={(item) => item.id ? 'key_items_listed_' + item.id.toString() : 'key_items_listed_0'}
      >
      </FlatList>
      
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
    paddingHorizontal: Theme.spacing.m
  },

  container_wrapper: {
    justifyContent: 'space-around',
    gap: Theme.spacing.s, // Horizontal gap
  },

  article_container: {
    flex: 1/3, 
    aspectRatio: 1,
    padding: Theme.spacing.xs,
    borderWidth: Theme.spacing.xxs,
    borderRadius: Theme.spacing.s,
  },

  article: {
    flex: 1, 
    aspectRatio: 1,
  },

  article_image: {
    flex: 1,
    borderRadius: Theme.spacing.xs,
  },

  article_edit: {
    zIndex: 10,
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
    left: -2, right: -2,
    backgroundColor: 'transparent',
    paddingVertical: Theme.spacing.xs,
  },

  edit_top: {
    top: -2,
    borderTopLeftRadius: Theme.spacing.s,
    borderTopRightRadius: Theme.spacing.s
  },

  edit_bottom: {
    bottom: -2,
    borderBottomLeftRadius: Theme.spacing.s,
    borderBottomRightRadius: Theme.spacing.s
  },

  article_selected: {
    textAlign: 'center',
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    backgroundColor: 'transparent'
  }
})



// Responsible for each shown item on the Wardrobe page
type ItemShowcaseProps = {
  item: ClothingItem,
  index: number,
  deleteItem: any,
  currentTheme: any
}

// Item Component
const ItemShowcase = (props: ItemShowcaseProps) => {
  const {item, index, currentTheme, deleteItem} = props || {}

  const [selected, setSelected] = useState<boolean>(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const dynamicStyle = StyleSheet.create({
    article: {borderColor: selected ? currentTheme.colors.secondary : currentTheme.colors.tertiary, backgroundColor: currentTheme.colors.background},
    article_edit: {backgroundColor: currentTheme.colors.secondary},
    article_delete: {backgroundColor: currentTheme.colors.delete}
  })

  // Animation for long item press
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
        styles.article_container, dynamicStyle.article, 
        {
          transform: [{ translateX: 
            animatedValue.interpolate({
            inputRange: [0, 0.25, 0.50, 0.75, 1],
            outputRange: [0, 10, 0, 10, 0]})
          }]
        }
      ]}
    >
      {selected &&
        <TouchableHighlight style={[styles.article_edit, styles.edit_top, dynamicStyle.article_edit]}
          onPress={() => console.log('press')}
          underlayColor={currentTheme.colors.tertiary}
        >
          <View style={{flexDirection: 'row', gap: Theme.spacing.xs}}>
            <MaterialCommunityIcons name={"square-edit-outline"} color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_s} />
            <Text style={[]}>Edit</Text>
          </View>
        </TouchableHighlight>
      }
      <TouchableOpacity 
        onLongPress={() => {setSelected((prevValue) => !prevValue), startShake()}}
        onPress={() => console.log('hi')}
        key={'wardrobe_image_container_' + index + item.image}
        style={[styles.article, dynamicStyle.article]}
        activeOpacity={0.7}
      >
        
        <Image source={{uri: item.image}} 
          key={'wardrobe_image_' + index + item.image}
          style={styles.article_image}
        />
      </TouchableOpacity>
      {selected &&
        <TouchableHighlight style={[styles.article_edit, styles.edit_bottom, dynamicStyle.article_delete]}
          onPress={() => deleteItem()}
          underlayColor={currentTheme.colors.tertiary}
        >
          <View style={{flexDirection: 'row', gap: Theme.spacing.xs}}>
            <MaterialCommunityIcons name={"trash-can-outline"} color={currentTheme.colors.quaternary} size={currentTheme.fontSize.m_s} />
            <Text>Delete</Text>
          </View>
        </TouchableHighlight>
      }
    </Animated.View>

  )
}