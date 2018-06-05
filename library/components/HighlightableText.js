/**
 * Created by erichua on 24/02/2018.
 */

import React, { Component } from 'react'
import {
  Text
} from 'react-native'
import PropTypes from 'prop-types'

export default class HighlightableText extends Component {
  static propTypes = {
    matcher: PropTypes.object,
    text: PropTypes.string.isRequired,
    textColor: PropTypes.string,
    hightlightTextColor: PropTypes.string
  }

  static defaultProps = {
    textColor: '#171a23',
    hightlightTextColor: '#dcb35f'
  }


  render () {
    const {textColor, hightlightTextColor} = this.props
    let startIndex = 0
    let titleContents = []

    const key = 'key'
    const {text = '', matcher: {matches = []} = {}} = this.props

    for (let match of matches) {
      if (match && match.start > startIndex) {
        let endIndex = match.end > text.length ? text.length : match.end
        // 当前位置和匹配起始位置之间的文字
        let str = text.slice(startIndex, match.start)
        titleContents.push(<Text key={key + startIndex} style={{
          fontSize: 15,
          color: textColor
        }}>{str}</Text>)

        // 被选中的文字
        let selStr = text.slice(match.start, endIndex)
        titleContents.push(<Text key={key + match.start} style={{
          fontSize: 15,
          color: hightlightTextColor
        }}>{selStr}</Text>)

        startIndex = endIndex
      } else if (match) {
        let endIndex = match.end > text.length ? text.length : match.end
        // 被选中的文字
        let selStr = text.slice(startIndex, endIndex)
        titleContents.push(<Text key={key + startIndex} style={{
          fontSize: 15,
          color: hightlightTextColor
        }}>{selStr}</Text>)

        startIndex = endIndex
      }
    }
    // 剩余的文字
    if (startIndex < text.length) {
      let str = text.slice(startIndex, text.length)
      titleContents.push(<Text key={key + startIndex} style={{
        fontSize: 15,
        color: textColor
      }} numberOfLines={1}>{str}</Text>)
    }

    return (
      <Text style={{flexDirection: 'row'}}>
        {titleContents}
      </Text>
    )
  }
}
