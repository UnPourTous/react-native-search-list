/**
 * Created by erichua on 22/12/2017.
 */

import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet
} from 'react-native'
import Touchable from './../utils/Touchable'
import PropTypes from 'prop-types'

export default class extends Component {
  static propTypes = {
    icon: Image.propTypes.source,
    onPress: PropTypes.func
  }

  static defaultProps = {
    icon: require('../images/icon-back.png')
  }

  render () {
    const {
      icon,
      leftButtonStyle,
      backIconStyle,
      onPress
    } = this.props
    return (
      <Touchable onPress={onPress} underlayColor='rgba(0, 0, 0, 0.0)'>
        <View style={[styles.actionItem, leftButtonStyle]}>
          <Image
            style={[styles.backIcon, backIconStyle]}
            source={icon}
            resizeMode='cover' />
        </View>
      </Touchable>
    )
  }
}

const styles = StyleSheet.create({
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
  }

})
