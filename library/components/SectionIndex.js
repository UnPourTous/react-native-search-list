'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import PropTypes from 'prop-types';

let returnTrue = () => true;
const itemHeight = 20;

export default class SectionIndex extends Component {
  static propTypes = {
    renderSectionItem: PropTypes.func
  }

  constructor (props, context) {
    super(props, context);

    this.onSectionSelect = this.onSectionSelect.bind(this);
    this.resetSection = this.resetSection.bind(this);
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this);
    this.lastSelectedIndex = null;
  }

  onSectionSelect (sectionId, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(sectionId);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  resetSection () {
    this.lastSelectedIndex = null;
  }

  detectAndScrollToSection (e) {
    let ev = e.nativeEvent;
    const { sections } = this.props;

    if (sections && sections.length) {
      const index = Math.floor(ev.locationY / itemHeight);
      if (this.lastSelectedIndex !== index) {
        this.lastSelectedIndex = index;
        const sectionIndex = typeof sections[index] === 'undefined' ? null : index;
        if (sectionIndex !== null) this.onSectionSelect(sectionIndex, true);
      }
    }
  }

  render () {
    const { renderSectionItem, sections } = this.props;
    const renderedSections = sections && sections.length > 0 ? sections.map((section, index) => {
      return (
        <View
          key={index}
          pointerEvents='none'>
          {renderSectionItem ? renderSectionItem(section) : <View
            style={styles.item}>
            <Text style={styles.text}>{section}</Text>
          </View>}
        </View>
      );
    }) : <View />;

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
              this.sectionListContentArea = e.nativeEvent.layout;
            }
          }}
          onStartShouldSetResponder={returnTrue}
          onMoveShouldSetResponder={returnTrue}
          onResponderGrant={this.detectAndScrollToSection}
          onResponderMove={(e) => {
            // e 不更新 的问题
            // https://github.com/facebook/react-native/pull/15123/commits/e22763f8c78d59d6ab04417690d25976671be6f0#diff-3f71f1808c93380dfbd5c044f9e6b4c7R122
            this.detectAndScrollToSection(e);
          }}
          onResponderRelease={this.resetSection}>
          {renderedSections}
        </View>
      </Animated.View>
    );
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
});
