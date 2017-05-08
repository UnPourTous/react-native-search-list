/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  View,
  Text,
  PixelRatio
} from 'react-native'
import SearchList from 'react-native-search-list'

const cellheight = 40
export default class example extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [
        {'searchStr': 'A1'},
        {'searchStr': 'B1'},
        {'searchStr': 'A2'},
        {'searchStr': 'C1'},
        {'searchStr': 'B2'},
        {'searchStr': 'C2'},
        {'searchStr': 'D1'},
        {'searchStr': 'D2'}]
    }
  }

  renderRow (item: Object,
             sectionID: number | string,
             rowID: number | string,
             highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
             isSearching: bool) {
    return (
      <View key={rowID} style={{flex: 1, marginLeft: 40, height: cellheight, justifyContent: 'center'}}>
        <Text>{item.searchStr}</Text>
      </View>
    )
  }

  emptyContent (searchStr) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: 50
      }}>
        <Text style={{color: '#979797', fontSize: 18, paddingTop: 20}}> No Result For <Text
          style={{color: '#171a23', fontSize: 18}}>{searchStr}</Text></Text>
        <Text style={{color: '#979797', fontSize: 18, alignItems: 'center', paddingTop: 10}}>Please search again</Text>
      </View>
    )
  }

  renderSeparator (sectionID,
                   rowID,
                   adjacentRowHighlighted) {

    let style = {backgroundColor: '#fff', paddingLeft: 25}
    if (adjacentRowHighlighted) {
      style = [style, {opacity: 0.0}]
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID} style={style}>
        <View style={{
          height: 1 / PixelRatio.get(),
          backgroundColor: 'gray'
        }}/>
      </View>
    )
  }

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#efefef',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <SearchList
          data={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          emptyContent={this.emptyContent.bind(this)}
          renderSeparator={this.renderSeparator.bind(this)}
          cellHeight={cellheight}
          title='Search List'
          searchPlaceHolder='Search'
        />
      </View>
    )
  }
}
AppRegistry.registerComponent('example', () => example)
