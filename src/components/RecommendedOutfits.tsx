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
    const howMany = 5

    const items = await getItemsFromLatestCreatedOutfits(db, howMany);
    
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
                                                           
          feet: acc[outfit_id]  ? clothingItem.type == 'feet' ? [...acc[outfit_id].items.feet, {...clothingItem}] 
                                                              : [...acc[outfit_id].items.feet]
                                : clothingItem.type == 'feet' ? [{...clothingItem}]
                                                              : []
                  
        }
      }
      return acc;
    }, accumulator)

    const recommendations: any = Object.entries(accumulator)

    console.log({RESULT: recommendations})
    setRecommended(recommendations)
  }

  useEffect(() => {
    if(!recommended) loadRecommendations()
  }, [outfit])

  return (
    
    <View
      style={{
      marginBottom: Theme.spacing.s,
      borderWidth: Theme.spacing.xs,

      marginHorizontal: -Theme.spacing.page - Theme.spacing.s,
      marginTop: -Theme.spacing.m - Theme.spacing.s,

      borderTopWidth: 0,
      borderColor: currentTheme.colors.secondary,

    }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.secondary}
      />
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
          Recommended Outfits
        </Text>
      </TouchableOpacity>
      
      {showRecommended &&
        <FlatList
          centerContent
          style={{
            backgroundColor: currentTheme.colors.secondary,
          }}
          contentContainerStyle={{
            columnGap: Theme.spacing.xs,
            paddingHorizontal: Theme.spacing.s
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recommended}
          renderItem={o => 

            // The square-shaped recommendation (outfit)
            <TouchableOpacity 
              onPress={() => console.log("TODO: import outfit")}
              activeOpacity={0.8}
              style={{
                padding: Theme.spacing.xxs,
                borderWidth: Theme.spacing.xxs,
                borderRadius: Theme.spacing.s,
                borderColor: currentTheme.colors.secondary,
                backgroundColor: currentTheme.colors.background,
                height: 100,
                width: 100,
                
                alignItems: 'center',
                justifyContent: 'center',
                
            }}>
              {/* The first half */}
              {(o.item[1].items.extra.length || o.item[1].items.top.length) ?
                <View 
                style={{
                  flexDirection: 'row',
                  flexGrow: 1,
                  flex: 0.5,
                  // width: '100%',

                  // Test flexbox
                  // borderColor: 'red',
                  // borderWidth: 1,
                  
                  alignItems: 'center',
                  justifyContent: 'center',
              }}>
                {/* Top-left */}
                <Quarter array={o.item[1].items.extra} category='extra' outfit_id={o.item[0]}/>
                {/* Top-right */}
                <Quarter array={o.item[1].items.top} category='top' outfit_id={o.item[0]}/>
              </View>
              : <></>
              }
              
              {/* The second half */}
              {(o.item[1].items.bottom.length || o.item[1].items.feet.length) ?
              <View 
                style={{
                  flexDirection: 'row',
                  flexGrow: 1,
                  flex: 0.5,
                  // width: '100%',

                  // Test flexbox
                  // borderColor: 'blue',
                  // borderWidth: 1,
                  
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
              }}>
                {/* Bottom-left */}
                <Quarter array={o.item[1].items.bottom} category='bottom' outfit_id={o.item[0]} direction='row'/>
                {/* Bottom-right */}
                <Quarter array={o.item[1].items.feet} category='feet' outfit_id={o.item[0]}/>
              </View>
              : <></>
              }
            </TouchableOpacity>
            
          }
          ListEmptyComponent={
            <Text style={{
              color: currentTheme.colors.secondary
              // paddingVertical: Theme.spacing.m,
              // paddingLeft: Theme.spacing.m,
            }}>
              No recommendations available.
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

  console.log(array.length)
  return (
    <View 
      style={{
        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: direction ?? 'column',
        flex: 1,
        flexGrow: 1,
    }}>
      <View 
        style={{
          flexDirection: 'row',
          
          // borderWidth: 1, 
          // borderColor: 'purple',

          maxHeight: '100%',
          maxWidth: '100%',
      }}>
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
      {/* </View>
      <View 
        style={{
          flexDirection: 'row',
      }}> */}
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

const styles = StyleSheet.create({})