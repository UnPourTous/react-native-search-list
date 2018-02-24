# A searchable ListView which supports Chinese PinYin and alphabetical index.
[![npm version](https://badge.fury.io/js/%40unpourtous%2Freact-native-search-list.svg)](https://badge.fury.io/js/%40unpourtous%2Freact-native-search-list)
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### React Native Search List

A searchable ListView which supports Chinese PinYin and alphabetical index.

<img src='https://github.com/UnPourTous/react-native-search-list/blob/master/screenshots/react-native-search-list-demo.gif?raw=true' />

## Installation

`$ npm install @unpourtous/react-native-search-list --save`

## Usage

To Use SearchList, need a array of object as data source,and each object has searchStr property:

```js
import React, { Component } from 'react'
import {
  AppRegistry,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native'
import SearchList from '@unpourtous/react-native-search-list'
import demoList from './data'
import { HighlightableText } from '@unpourtous/react-native-search-list'
import Touchable from '../src/utils/Touchable'

const cellheight = 40
export default class example extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: demoList
    }
  }

  // custom render row
  renderRow (item, sectionID, rowID, highlightRowFunc, isSearching) {
    return (
      <Touchable onPress={() => {
        Alert.alert('Clicked!', `sectionID: ${sectionID}; item: ${item.searchStr}`,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: true})
      }}>
        <View key={rowID} style={{flex: 1, marginLeft: 20, height: cellheight, justifyContent: 'center'}}>
          {/*use `HighlightableText` to highlight the search result*/}
          <HighlightableText
            matcher={item.matcher}
            text={item.searchStr}
            textColor={'#000'}
            hightlightTextColor={'#0069c0'}
          />
        </View>
      </Touchable>
    )
  }

  // render empty view when datasource is empty
  renderEmpty () {
    return (
      <View style={styles.emptyDataSource}>
        <Text style={{color: '#979797', fontSize: 18, paddingTop: 20}}> No Content </Text>
      </View>
    )
  }

  // render empty result view when search result is empty
  renderEmptyResult (searchStr) {
    return (
      <View style={styles.emptySearchResult}>
        <Text style={{color: '#979797', fontSize: 18, paddingTop: 20}}> No Result For <Text
          style={{color: '#171a23', fontSize: 18}}>{searchStr}</Text></Text>
        <Text style={{color: '#979797', fontSize: 18, alignItems: 'center', paddingTop: 10}}>Please search again</Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#F00' barStyle='light-content' />
        <SearchList
          data={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderEmptyResult={this.renderEmptyResult.bind(this)}
          renderBackButton={() => null}
          renderEmpty={this.renderEmpty.bind(this)}
          cellHeight={cellheight}
          title='Search List Demo'
          cancelTitle='取消'
          searchPlaceHolder='Search'
          customSearchBarStyle={{
            fontSize: 14
          }}
          onClickBack={() => {}}
          searchListBackgroundColor={'#2196f3'}
          toolbarBackgroundColor={'#2196f3'}

          searchBarToggleDuration={300}

          searchInputBackgroundColor={'#0069c0'}
          searchInputBackgroundColorActive={'#6ec6ff'}
          searchInputPlaceholderColor={'#FFF'}
          searchInputTextColor={'#FFF'}
          searchInputTextColorActive={'#000'}
          searchBarBackgroundColor={'#2196f3'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
    flexDirection: 'column',
    justifyContent: 'flex-start'
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
  },
  emptyDataSource: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  },
  emptySearchResult: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 50
  }
})

AppRegistry.registerComponent('example', () => example)
```
## API

Props
-----

### `data`
the rows of list view.each object should contain `searchStr`,it will be used for search source.
If you have custom row id,you should set `searchKey` for each object

type: `Array`
defaultValue: `[]`

### `renderRow`
the row content

type: `function`

### `cellHeight`
the height of row content,it will be used for scroll calculate

type: `number`
defaultValue: `0`

### `sectionHeaderHeight`
the height of section header content,it will be used for scroll calculate

type: `number`
defaultValue: `24`

### `hideSectionList`
Whether to hide the alphabetical section listing view or not 

type: `bool`
defaultValue: `false`

### `topOffset`
the top offset for list view and alphabetical section view

type: `number`
defaultValue: `0`

### `searchBarBgColor`
the background color of search bar and nav bar,please use hex color string

type: `string`
defaultValue: `#171a23`

### `title`
the title of nav bar

type: `string`

### `textColor`
the color of nav bar title and search bar text color

type: `string`
defaultValue: `white`

### `cancelTitle`
the title of search bar cancel button

type: `string`
defaultValue: `Cancel`

### `sortFunc`
the sort function for the list view data source,sorting alphabetical by default 

type: `func`

### `resultSortFunc`
the sort function for the search result,sorting first match position by default 

type: `func`

### `renderSeparator`
row separator

type: `function`

### `renderSectionHeader`
the section header content

type: `function`

### `onClickBack`
the callback of left button.if set, left button will shown 

type: `function`

### `onScrollToSection`
the callback of alphabetical section view be clicked or touch.

type: `function`

### `renderAlphaSection`
the alphabetical section view content

type: `function`

### `renderHeader`
renderHeader for the internal ListView

type: `function`


### `renderStickHeader`
render a stickHeader above the body.

type: `function`


### `renderEmpty`
Render a view when data is empty.

type: `function`

### `renderEmptyResult`
Render a view when the search result is empty.

type: `function`

### `toolbarStyle`


## Thanks
* [js-pinyin](https://github.com/waterchestnut/pinyin)
* [md5](https://github.com/pvorb/node-md5)
* [react-native-selectablesectionlistview](https://github.com/johanneslumpe/react-native-selectablesectionlistview)

## TODO 
1. add hightlight demo
1. test ios & android & android with status bar and without

## License
This library is distributed under MIT Licence.
