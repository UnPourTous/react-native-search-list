# A searchable ListView which supports Chinese PinYin and alphabetical index.

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### React Native Search List

A searchable ListView which supports Chinese PinYin and alphabetical index.

<img src='https://github.com/UnPourTous/react-native-search-list/blob/master/screenshots/react-native-search-list-demo.gif?raw=true' />

## Installation

`$ npm install @unpourtous/react-native-search-list --save`

## Usage

To Use SearchList, need a array of object as data source,and each object has searchStr property:

```js
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  View,
  Text
} from 'react-native'
import SearchList from '@unpourtous/react-native-search-list'

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
        {'searchStr': 'Linder'},
        {'searchStr': '林林'},
        {'searchStr': '王五'},
        {'searchStr': '张三'},
        {'searchStr': '张二'},
        {'searchStr': '李四'}]
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


## Thanks
* [js-pinyin](https://github.com/waterchestnut/pinyin)
* [md5](https://github.com/pvorb/node-md5)
* [react-native-selectablesectionlistview](https://github.com/johanneslumpe/react-native-selectablesectionlistview)

## License
This library is distributed under MIT Licence.
