'use strict'

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions
} from 'react-native'

import CustomTouchable from './CustomTouchable'

import PropTypes from 'prop-types'

let statusBarSize = (Platform.OS === 'ios' ? 10 : 0)
let deviceWidth = Dimensions.get('window').width

export default class CustomToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      extra: null,
      rightBtnFunc: null,
      titleBackgroundColor: '#6794D7'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rightBtnFunc: nextProps.rightBtnClick
    })
  }

  componentDidMount() {
    if (this.props.rightBtnClick) {
      this.setState({
        rightBtnFunc: this.props.rightBtnClick
      })
    }

    if (this.props.backgroundColor) {
      this.setState({
        titleBackgroundColor: this.props.backgroundColor
      })
    }
  }

  _onPressBackButton() {
    if (this.props.onClickBack) {
      this.props.onClickBack()
    }
    if (this.props.navigator) {
      this.props.navigator.pop()
    }
  }

  _onPressRightButton() {
    if (this.state.rightBtnFunc) {
      this.state.rightBtnFunc()
    }
  }

  render() {
    let marginTopPx = 0
    if (Platform.OS === 'android') {
    } else {
      marginTopPx = 4
    }
    // 这里使用的是直接打到原生包里的图片，后续需要优化
    let rightContent = this.props.rightBtnIcon ? <Image style={styles.backIcon}
      source={{ uri: this.props.rightBtnIcon }}
      resizeMode='cover' />
      : <Text style={{ color: 'white', fontSize: 17, marginRight: 20 }}>{this.props.rightBtnTitle}</Text>
    let backBtn = this.props.hideBack ? <View style={styles.actionItem}>
      <View style={{ flex: 1 }} />
    </View>
      : <CustomTouchable onPress={this._onPressBackButton.bind(this)} underlayColor='rgba(0, 0, 0, 0.0)'>
        <View style={[styles.actionItem, this.props.leftButtonStyle, { marginTop: marginTopPx }]}>
          <Image
            style={[styles.backIcon, this.props.backIconStyle]}
            source={this.props.backIcon || require('../images/icon-back.png')}
            resizeMode='cover' />
        </View>
      </CustomTouchable>
    let rightBtn = this.state.rightBtnFunc
      ? <CustomTouchable onPress={this._onPressRightButton} underlayColor='rgba(0, 0, 0, 0.1)'>
        <View style={styles.actionItem}>
          {rightContent}
        </View>
      </CustomTouchable> : <View style={styles.actionItem} />
    let title = this.props.title ? <View style={[styles.titleView, { marginTop: marginTopPx + 10 }]}>
      <Text style={[styles.title, { color: this.props.textColor ? this.props.textColor : 'white' }]} numberOfLines={1}>
        {this.props.title}
      </Text>
    </View> : null
    return (
      <View {...this.props}>
        <View style={[styles.actionsContainer, { backgroundColor: this.state.titleBackgroundColor }]}>
          {backBtn}
          {title}
          {rightBtn}
        </View>

      </View>
    )
  }
}

CustomToolbar.propTypes = {
  backIcon: React.PropTypes.number
}

let styles = StyleSheet.create({
  actionsContainer: {
    flexGrow: 1,
    height: 56,
    width: deviceWidth,
    paddingTop: statusBarSize,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171a23'
  },
  backIcon: {
    width: 20,
    height: 20
  },

  actionItem: {
    height: 56,
    width: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8
  },
  actionIcon: {
    width: 32,
    height: 32
  },
  actionIconWithCount: {
    width: 32,
    height: 32,
    marginLeft: 5
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    height: 25
  },
  title: {
    flexGrow: 1,
    fontSize: 18
  },
  count: {
    fontSize: 16,
    color: 'white',
    marginRight: 5
  }
})
