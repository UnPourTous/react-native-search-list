import {
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'

export default class Touchable extends Component {
  static defaultProps = {
    activeOpacity: 0.7
  }

  render () {
    return (
      <TouchableOpacity
        {...this.props}
        activeOpacity={Touchable.defaultProps.activeOpacity}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}
