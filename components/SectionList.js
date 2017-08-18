'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  NativeModules
} from 'react-native'

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

    console.log(ev.locationX, ev.locationY)
    if (this.sectionListContentArea && this.props.sections && this.props.sections.length) {
      const height = this.sectionListContentArea.height
      const itemHeight = height / this.props.sections.length
      const index = Math.floor(ev.locationY / itemHeight)
      if (this.lastSelectedIndex !== index) {
        this.lastSelectedIndex = index
        this.onSectionSelect(this.props.sections[index], true)
      }
    }
    // NativeModules.UIManager.measureViewsInRect(rect, e.target, noop, (frames) => {
    //   if (frames.length) {
    //     let index = frames[0].index
    //     if (this.lastSelectedIndex !== index) {
    //       this.lastSelectedIndex = index
    //       this.onSectionSelect(this.props.sections[index], true)
    //     }
    //   }
    // })
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
        <View
          key={index}
          pointerEvents='none'>
          {child}
        </View>
      )
    }) : <View />

    return (
      <View
        style={[
          styles.container,
          this.props.style
        ]}
      >
        <View
          onLayout={(e) => {
            if (!this.sectionListContentArea)  {
              this.sectionListContentArea = e.nativeEvent.layout
            }
          }}
          onStartShouldSetResponder={returnTrue}
          onMoveShouldSetResponder={returnTrue}
          onResponderGrant={this.detectAndScrollToSection}
          onResponderMove={(e) => {
            // e 不更新 的问题
            // https://github.com/facebook/react-native/pull/15123/commits/e22763f8c78d59d6ab04417690d25976671be6f0#diff-3f71f1808c93380dfbd5c044f9e6b4c7R122
            this.detectAndScrollToSection(e)
          }}
          onResponderRelease={this.resetSection} >
          {sections}
        </View>
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
