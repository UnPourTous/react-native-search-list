/**
 * Created by haywoodfu on 17/4/16.
 */

'use strict'
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Animated
} from 'react-native'

import React, { Component } from 'react'

const buttonWidth = 70

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
    if (this.state.isShowHolder) {
      this.setState({isShowHolder: false})
      this.searchingAnimation(true)
    }
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
      duration: 300,
      toValue: toVal
    }).start()

  }

  cancelSearch() {
    this.refs.input.clear()
    this.refs.input.blur()
    this.setState({isShowHolder: true})
    this.searchingAnimation(false)
    this.props.onClickCancel && this.props.onClickCancel()
  }

  render () {
    return (
      <TouchableWithoutFeedback onPress={() => this.refs.input.focus()}>
        <View
          style={[this.props.style, {flexDirection: 'row', padding: 8, height: 44, backgroundColor: '#171a23'}]}>
          <TextInput onFocus={this.onFocus.bind(this)}
                     onBlur={this.onBlur.bind(this)}
                     ref='input'
                     style={{
                       flex: 1,
                       color: '#979797',
                       padding: 0,
                       height: 28,
                       paddingLeft: 8,
                       paddingRight: 8,
                       borderRadius: 5,
                       backgroundColor: '#2f3139'
                     }}
                     onChangeText={this.onChange.bind(this)}
                     value={this.state.value}
                     underlineColorAndroid='transparent'
                     returnKeyType='search'/>
          {this.state.isShowHolder && !this.state.value ? <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 44,
            position: 'absolute',
            justifyContent: 'center',
            left: 0,
            right: 0
          }}>
            <Image style={{width: 12, height: 12, marginRight: 5}}
                   source={require('../images/icon-search.png')}/>
            <Text style={{
              color: '#979797',
              fontSize: 14,
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }}>{this.props.placeholder}</Text>
          </View> : null
          }
          <Animated.View style={{
            backgroundColor: '#171a23',
            width: this.state.animatedValue
          }}>
            <TouchableWithoutFeedback onPress={this.cancelSearch.bind(this)}>
              <View style={{
                flex: 1,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 5
              }}>
                <Text style={{color: this.props.textColor ? this.props.textColor : 'white'}} numberOfLines={1}>{this.props.cancelTitle ? this.props.cancelTitle : 'Cancel'}</Text>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    )
  };
}
