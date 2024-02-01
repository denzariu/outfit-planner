import { FlatList, Image, LayoutAnimation, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ClothingItem, Outfit } from '../assets/database/models'
import { DarkTheme, Theme, swipeAnimation, swipeXAnimation, swipeYAnimation } from '../defaults/ui'
import { getDBConnection } from '../assets/database/db-service'
import { getItemsFromLatestCreatedOutfits } from '../assets/database/db-operations/db-operations-outfit'

//TODO: cleaning 

type RecommendedOutfitsProps = {
  outfit: Outfit
}

const RecommendedOutfits = ({outfit}: RecommendedOutfitsProps) => {

  const noRecommendations = 5;
  const isDarkMode = useColorScheme() == 'dark';
  const currentTheme = isDarkMode ? DarkTheme : Theme;
  
  const [recommended, setRecommended] = useState<any[]>()
  const [showRecommended, setShowRecommended] = useState<boolean>(false)

  const openList = () => {
    LayoutAnimation.configureNext(swipeAnimation)
    setShowRecommended(prev => !prev)
  }

  const loadRecommendations = async () => {
    const db = await getDBConnection()

    const items = await getItemsFromLatestCreatedOutfits(db, noRecommendations);
    
    let accumulator: {
      [key: string]: any;
    } = {}

    items.reduce((acc, i) => {
      const {outfit_id, outfit_name, ...clothingItem} = i
      acc[outfit_id] = {
        // id: outfit_id, 
        name: outfit_name,
        items: {
          // ...acc[outfit_id].items,
          extra: acc[outfit_id] ? clothingItem.type == 'extra'  ? [...acc[outfit_id].items.extra, {...clothingItem}] 
                                                                : [...acc[outfit_id].items.extra]
                                : clothingItem.type == 'extra'  ? [{...clothingItem}]
                                                                : [],

          top: acc[outfit_id] ? clothingItem.type == 'top' ? [...acc[outfit_id].items.top, {...clothingItem}] 
                                                           : [...acc[outfit_id].items.top]
                              : clothingItem.type == 'top' ? [{...clothingItem}]
                                                           : [],
                                                           
          bottom: acc[outfit_id]  ? clothingItem.type == 'bottom' ? [...acc[outfit_id].items.bottom, {...clothingItem}] 
                                                                  : [...acc[outfit_id].items.bottom]
                                  : clothingItem.type == 'bottom' ? [{...clothingItem}]
                                                                  : [],
                                                           
          footwear: acc[outfit_id]  ? clothingItem.type == 'footwear' ? [...acc[outfit_id].items.footwear, {...clothingItem}] 
                                                              : [...acc[outfit_id].items.footwear]
                                : clothingItem.type == 'footwear' ? [{...clothingItem}]
                                                              : []
                  
        }
      }
      return acc;
    }, accumulator)

    const recommendations: any = Object.entries(accumulator)
    setRecommended(recommendations)
  }

  useEffect(() => {
    if(!recommended) loadRecommendations()
  }, [outfit])


  const dynamicStyles = StyleSheet.create({
    container: { borderColor: currentTheme.colors.secondary },
    list: { backgroundColor: currentTheme.colors.secondary },
    outfit_square: { borderColor: currentTheme.colors.secondary, backgroundColor: currentTheme.colors.background },
    outfit_no_recommendation: { backgroundColor: currentTheme.colors.background, color: currentTheme.colors.secondary }
  })

  return (
    
    <View
      style={[styles.container, dynamicStyles.container]}>

      {/* Status Bar color change */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.secondary}
      />

      {/* Action Button */}
      <TouchableOpacity style={{
          backgroundColor: currentTheme.colors.secondary,
          paddingVertical: Theme.spacing.xs,
        }}
        activeOpacity={0.9}
        onPress={() => openList()}
      >
        <Text style={{
          color: currentTheme.colors.quaternary,
          fontWeight: '200',
          textAlign: 'center'
        }}>
          See Recommended Outfits
        </Text>
      </TouchableOpacity>
      
      {/* Items shown */}
      {showRecommended &&
        <FlatList
          centerContent
          style={dynamicStyles.list}
          contentContainerStyle={styles.list_content}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recommended}
          renderItem={o => 

            // The square-shaped recommendation (outfit)
            <TouchableOpacity 
              onPress={() => console.log("TODO: import outfit")}
              activeOpacity={0.8}
              style={[styles.outfit_square, dynamicStyles.outfit_square]}>
              
              {/* I've split the square in 2 flex halfs (4-quarters) 
                  in order to get the best preview */}
                  
              {/* The first half */}
              {(o.item[1].items.extra.length || o.item[1].items.top.length) ?
                <View 
                style={styles.outfit_square_half}>
                {/* Top-left */}
                <Quarter array={o.item[1].items.extra} category='extra' outfit_id={o.item[0]}/>
                {/* Top-right */}
                <Quarter array={o.item[1].items.top} category='top' outfit_id={o.item[0]}/>
              </View>
              : <></>
              }
              
              {/* The second half */}
              {(o.item[1].items.bottom.length || o.item[1].items.footwear.length) ?
              <View 
                style={styles.outfit_square_half}>
                {/* Bottom-left -> this one will row-flex (pants usually have height > width) */}
                <Quarter array={o.item[1].items.bottom} category='bottom' outfit_id={o.item[0]} direction='row'/>
                {/* Bottom-right */}
                <Quarter array={o.item[1].items.footwear} category='footwear' outfit_id={o.item[0]}/>
              </View>
              : <></>
              }
            </TouchableOpacity>
            
          }
          ListEmptyComponent={
            <Text style={[styles.outfit_no_recommendation, dynamicStyles.outfit_no_recommendation]}>
              Add more outfits in order to get recommendations.
            </Text>
          }
        />
      }
    </View>
  )
}

export default RecommendedOutfits

type QuarterProps = {
  array: any, 
  outfit_id: string, 
  category: string,
  direction?: 'row' | 'column'
}
const Quarter = ({array, outfit_id, category, direction}: QuarterProps) => {

  if (!array.length) return

  return (
    <View 
      style={[
        styles.outfit_square_quarter,
        {flexDirection: direction ?? 'column'}
    ]}>

      {/* Quarter is also split in two, to maximize space */}
      <View style={styles.outfit_square_quarter_half}>
        {array.slice(0, array.length / 2).map((i: any) =>
            <Image 
              key={`preview_${category}_outfit_${outfit_id}_${i.item_id}`} 
              source={{uri: i.image}} 
              style={{
                flex: 1, 
                maxHeight: '100%',
                flexGrow: 1, 
                aspectRatio: i.aspect_ratio, 
                objectFit: 'contain'
              }}/>
        )}
        {array.slice(array.length / 2, array.length).map((i: any) =>
            <Image 
              key={`preview_${category}_outfit_${outfit_id}_${i.item_id}`} 
              source={{uri: i.image}} 
              style={{
                flex: 1, 
                maxHeight: '100%',
                flexGrow: 1, 
                aspectRatio: i.aspect_ratio, 
                objectFit: 'contain'
              }}/>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.s,

    borderWidth: Theme.spacing.xs,
    borderTopWidth: 0,

    marginHorizontal: -Theme.spacing.page - Theme.spacing.s,
    marginTop: -Theme.spacing.m - Theme.spacing.s,
  },

  list_content: {
    columnGap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.s,

    flex: 1,
  },

  outfit_square: {
    padding: Theme.spacing.xxs,
    borderWidth: Theme.spacing.xxs,
    borderRadius: Theme.spacing.s,
    height: 100,
    width: 100,
    
    alignItems: 'center',
    justifyContent: 'center',
  },

  outfit_square_half: {
    flexDirection: 'row',
    flexGrow: 1,
    flex: 0.5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  outfit_square_quarter: {
    flex: 1,
    flexGrow: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  outfit_square_quarter_half: {
    flexDirection: 'row',

    maxHeight: '100%',
    maxWidth: '100%',
  },

  outfit_no_recommendation: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',

    borderRadius: Theme.spacing.ms,
    fontWeight: '300',
    paddingVertical: Theme.spacing.m,
    marginHorizontal: Theme.spacing.m,
  },


  

})