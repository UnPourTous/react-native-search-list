import {
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'

export default class WeTouchable extends Component {
  static defaultProps = {
    activeOpacity: 0.7
  }

  render () {
    return (
      <TouchableOpacity
        {...this.props}
        activeOpacity={WeTouchable.defaultProps.activeOpacity}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}