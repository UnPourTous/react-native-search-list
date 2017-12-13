/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import SearchList from '@unpourtous/react-native-search-list/SearchList'
import demoList from './data'

const cellheight = 40
export default class example extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: demoList
    }
  }

  renderRow (item, sectionID, rowID, highlightRowFunc, isSearching) {
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

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#efefef',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <StatusBar backgroundColor='#F00' barStyle='light-content' />
        <SearchList
          data={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          emptyContent={this.emptyContent.bind(this)}
          cellHeight={cellheight}
          title='Search List'
          searchPlaceHolder='Search'
          customSearchBarStyle={{
            fontSize: 14
          }}
          onClickBack={() => {}}
          leftButtonStyle={{justifyContent: 'flex-start'}}
          backIconStyle={{width: 8.5, height: 17}}
          activeSearchBarColor='#fff'
          showActiveSearchIcon
          searchBarActiveColor='#171a23'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

AppRegistry.registerComponent('example', () => example)
