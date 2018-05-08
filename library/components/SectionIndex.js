'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native'
import PropTypes from 'prop-types'

let returnTrue = () => true
const itemHeight = 20

export default class SectionIndex extends Component {
  static propTypes = {
    renderSectionItem: PropTypes.func
  }

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

    if (this.props.sections && this.props.sections.length) {
      const index = Math.floor(ev.locationY / itemHeight)
      if (this.lastSelectedIndex !== index) {
        this.lastSelectedIndex = index
        this.onSectionSelect(this.props.sections[index], true)
      }
    }
  }

  render () {
    const {renderSectionItem} = this.props
    const sections = this.props.sections && this.props.sections.length > 0 ? this.props.sections.map((section, index) => {
      let title = this.props.getSectionListTitle ? this.props.getSectionListTitle(section) : section

      return (
        <View
          key={index}
          pointerEvents='none'>
          {renderSectionItem ? renderSectionItem(section, title) : <View
            style={styles.item}>
            <Text style={styles.text}>{title}</Text>
          </View>}
        </View>
      )
    }) : <View />

    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style
        ]}>
        <View
          style={{
            width: 36
          }}
          onLayout={(e) => {
            if (!this.sectionListContentArea && e.nativeEvent.layout) {
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
          onResponderRelease={this.resetSection}>
          {sections}
        </View>
      </Animated.View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36
  },

  item: {
    padding: 0,
    height: itemHeight
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  }
})
