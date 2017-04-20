'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

let UIManager = require('NativeModules').UIManager

let noop = () => {}
let returnTrue = () => true

export default class SectionList extends Component {

  constructor (props, context) {
    super(props, context)

    this.onSectionSelect = this.onSectionSelect.bind(this)
    this.resetSection = this.resetSection.bind(this)
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this)
    this.lastSelectedIndex = null
  }

  onSectionSelect (sectionId, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(sectionId)

    if (!fromTouch) {
      this.lastSelectedIndex = null
    }
  }

  resetSection () {
    this.lastSelectedIndex = null
  }

  detectAndScrollToSection (e) {
    let ev = e.nativeEvent
    let rect = {width: 1, height: 1, x: ev.locationX, y: ev.locationY}

    UIManager.measureViewsInRect(rect, e.target, noop, (frames) => {
      if (frames.length) {
        let index = frames[0].index
        if (this.lastSelectedIndex !== index) {
          this.lastSelectedIndex = index
          this.onSectionSelect(this.props.sections[index], true)
        }
      }
    })
  }

  render () {
    let renderSection = this.props.renderSection
    let sections = this.props.sections && this.props.sections.length > 0 ? this.props.sections.map((section, index) => {
      let title = this.props.getSectionListTitle ? this.props.getSectionListTitle(section) : section

      let child = renderSection ? renderSection(section, title) : <View
        style={styles.item}>
        <Text style={styles.text}>{title}</Text>
      </View>

      return (
        <View key={index} pointerEvents='none'>
          {child}
        </View>
      )
    }) : <View />

    return (
      <View style={[styles.container, this.props.style]}
        onStartShouldSetResponder={returnTrue}
        onMoveShouldSetResponder={returnTrue}
        onResponderGrant={this.detectAndScrollToSection}
        onResponderMove={this.detectAndScrollToSection}
        onResponderRelease={this.resetSection}
      >
        {sections}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
    width: 15
  },

  item: {
    padding: 0
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  }
})
