/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry
} from 'react-native'
import Entry from './entry'

export default class example extends Component {
  render () {
    return (
      <Entry />
    )
  }
}
AppRegistry.registerComponent('example', () => example)
