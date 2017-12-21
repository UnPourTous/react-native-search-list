import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native'

let statusBarSize = (Platform.OS === 'ios' ? 20 : 0)

export default class Toolbar extends Component {
  render () {
    const {toolbarStyle} = this.props
    return (
      <Animated.View
        {...this.props}
        shouldRasterizeIOS
        renderToHardwareTextureAndroid>
        <View style={[styles.container, toolbarStyle]}>
          {this._renderBackButton()}
          {this._renderTitle()}
          {this._renderRightButton()}
        </View>
      </Animated.View>
    )
  }

  _renderBackButton () {
    const {renderBackButton = false} = this.props
    if (renderBackButton) {
      return renderBackButton()
    }

    return null
  }

  _renderTitle () {
    const {renderTitle, title} = this.props
    if (renderTitle) {
      return renderTitle()
    } else {
      return (
        <View style={[styles.titleStyle]}>
          <Text style={[styles.titleTextStyle, {color: this.props.textColor ? this.props.textColor : 'white'}]}
            numberOfLines={1}>
            {title}
          </Text>
        </View>
      )
    }
  }

  _renderRightButton () {
    const {renderRightButton = false} = this.props
    if (renderRightButton) {
      return renderRightButton()
    }

    return null
  }
}

let styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: 56,
    paddingTop: statusBarSize,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171a23'
  },
  titleStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    height: 25
  },
  titleTextStyle: {
    flexGrow: 1,
    fontSize: 18
  }
})
