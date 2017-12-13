/**
 * Created by haywoodfu on 17/4/16.
 */

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Animated
} from 'react-native'

import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Theme from './Theme'

// width for the cancel button area, should be a fix value at this moment
const buttonWidth = 70

// padding between the search input and the search bar
const searchBarHorizontalPadding = 8

// width for the left search icon
const searchIconWidth = 30
export default class CustomSearchBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      value: props.value,
      isShowHolder: true,
      animatedValue: new Animated.Value(0)
    }
  }

  onChange (str) {
    if (this.props.onChange) {
      this.props.onChange(str)
    }
    this.setState({str})
  }

  onBlur () {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  onFocus () {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
    this.searchingAnimation(true)
  }

  searchingAnimation (isSearching) {
    let toVal = 0

    if (isSearching) {
      this.state.animatedValue.setValue(0)
      toVal = buttonWidth
    } else {
      this.state.animatedValue.setValue(buttonWidth)
      toVal = 0
    }

    Animated.timing(this.state.animatedValue, {
      duration: Theme.duration.toggleSearchBar,
      toValue: toVal
    }).start(() => {
      this.setState({isShowHolder: !isSearching})
    })
  }

  cancelSearch () {
    this.refs.input.clear()
    this.refs.input.blur()
    this.searchingAnimation(false)
    this.props.onClickCancel && this.props.onClickCancel()
  }

  render () {
    return (
      <View
        style={[
          this.props.style,
          {
            flexDirection: 'row',
            padding: searchBarHorizontalPadding,
            height: Theme.size.searchInputHeight,
            backgroundColor: '#171a23'
          },
          {
            width: Theme.size.windowWidth + buttonWidth
          }
        ]}>
        <Animated.View style={{
          width: this.state.animatedValue.interpolate({
            inputRange: [0, buttonWidth],
            // TODO 这里要想办法做得更灵活一点
            outputRange: [Theme.size.windowWidth - searchBarHorizontalPadding * 2, Theme.size.windowWidth - buttonWidth - searchBarHorizontalPadding]
          }),
          backgroundColor: this.state.animatedValue.interpolate({
            inputRange: [0, buttonWidth],
            outputRange: ['#2f3139', this.props.activeSearchBarColor]
          }),
          height: 28,
          borderRadius: 5
        }}>
          <TextInput
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            ref='input'
            style={[{
              flex: 1,
              color: this.props.searchBarActiveColor && !this.state.isShowHolder ? this.props.searchBarActiveColor : '#979797',
              height: 28,
              padding: 0,
              paddingLeft: searchIconWidth,
              paddingRight: 8,
              borderRadius: 5
            }, this.props.customSearchBarStyle]}
            onChangeText={this.onChange.bind(this)}
            value={this.state.value}
            underlineColorAndroid='transparent'
            returnKeyType='search' />

          <Animated.View
            pointerEvents='none'
            style={{
              position: 'absolute',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              bottom: 0,
              width: searchIconWidth,
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, buttonWidth],
                outputRange: [0, 1]
              })
            }}>
            <Image
              style={{
                width: 12,
                height: 12,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                top: 0,
                bottom: 0
              }}
              source={require('../images/icon-search.png')} />
          </Animated.View>

          <Animated.View
            pointerEvents='none'
            style={{
              position: 'absolute',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignSelf: 'stretch',
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, 70],
                outputRange: [!this.state.value ? 1 : 0, 0]
              })
            }}>
            <Image
              style={{width: 12, height: 12, marginRight: 5}}
              source={require('../images/icon-search.png')} />
            <Text style={{
              color: '#979797',
              fontSize: 14,
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }}>{this.props.placeholder}</Text>
          </Animated.View>
        </Animated.View>
        <View style={{
          width: buttonWidth,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableWithoutFeedback onPress={this.cancelSearch.bind(this)}>
            <View
              style={{
                flex: 1,
                height: Theme.size.searchInputHeight,
                width: buttonWidth,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5
              }}
              shouldRasterizeIOS
              renderToHardwareTextureAndroid
            >
              <Text style={{color: this.props.textColor ? this.props.textColor : 'white'}} numberOfLines={1}>{this.props.cancelTitle ? this.props.cancelTitle : 'Cancel'}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  };
}

CustomSearchBar.propTypes = {
  showActiveSearchIcon: PropTypes.bool,
  isShowHolder: PropTypes.bool // 是否显示搜索图标
}
