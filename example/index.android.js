import React, { Component } from 'react'
import {
  AppRegistry
} from 'react-native'
import Entry from './entry'

AppRegistry.registerComponent('example', () => class extends Component {
  render () {
    return (
      <Entry />
    )
  }
})
