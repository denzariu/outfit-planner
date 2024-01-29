import React, { Component, PropsWithChildren, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager, useColorScheme } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Outfit } from '../assets/database/models';
import { DarkTheme, Theme } from '../defaults/ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { icons } from '../defaults/custom-svgs';

type rowProps = {
  outfit: Outfit;
  actionButton1: () => void,
  actionButton2: () => void,
}
export default class AppleStyleSwipeableRow extends Component<
  PropsWithChildren<rowProps>
> {
  

  private renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <RectButton style={[styles.leftAction, {
        backgroundColor: DarkTheme.colors.quaternary
      }]} 
        onPress={this.deleteAllItems}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
              color: DarkTheme.colors.background,
              fontSize: Theme.spacing.xl,
            },
          ]}>
          Remove
        </Animated.Text>
      </RectButton>
    );
  };

  private editItem = (() => {
    this.props.actionButton1()
    this.close()
  })

  private deleteAllItems = (() => {
    this.props.actionButton2()
    this.close();
  })

  
  private renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    icon?: string | undefined,
    textColor?: string | undefined
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {

      switch (text) {
        case 'edit':
          this.editItem();
          break;
        case 'delete':
          this.deleteAllItems();
          break;
      }
    };
    
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          {
            icon == 'delete' ? 
              <MaterialCommunityIcons 
                name= {icons.delete} 
                color={DarkTheme.colors.background} 
                size={Theme.fontSize.m_m} 
              />
              :
              <MaterialCommunityIcons 
                name= {icons.edit} 
                color={DarkTheme.colors.background} 
                size={Theme.fontSize.m_m} 
              />
          }
        </RectButton>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 140,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {this.renderRightAction('edit', DarkTheme.colors.primary, 140, progress, 'edit')}
      {this.renderRightAction('delete', DarkTheme.colors.delete, 70, progress, 'delete')}
    </View>
  );

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };
  private close = () => {
    this.swipeableRow?.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={20}
        rightThreshold={20}
        containerStyle={{
          paddingLeft: Theme.spacing.page
        }}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        // onSwipeableOpen={(direction) => {
        //   console.log(`Opening swipeable from the ${direction}`);
        // }}
        // onSwipeableClose={(direction) => {
        //   console.log(`Closing swipeable to the ${direction}`);
        // }}
        >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    backgroundColor: 'transparent',
    fontSize: Theme.fontSize.l_s,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});