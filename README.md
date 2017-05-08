# seed project for UnPourTous rn component

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### React Native Search List

A component for ListView can search items, support chinese alphabetical<br>

<img src='https://github.com/UnPourTous/react-native-search-list/blob/master/screenshots/react-native-search-list-demo.gif?raw=true' />

## Installation

`$ npm install react-native-search-list --save`

## Usage

To Use SearchList, need a array of object as data source,and each object has searchStr property:

```js
import SearchList from 'react-native-search-list';
const cellHeight=40

  renderRow (item: Object,
             sectionID: number | string,
             rowID: number | string,
             highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
             isSearching: bool) {
    return (
      <View key={rowID} style={{flex: 1, marginLeft: 40, height: cellHeight, justifyContent: 'center'}}>
        <Text>{item.searchStr}</Text>
      </View>
    )
  }
  
  render () {
    let dataSource = [
        {'searchStr': 'Alpha_one'},
        {'searchStr': 'Beta_one'},
        {'searchStr': 'Alpha_second'},
        {'searchStr': 'Charles_one'},
        {'searchStr': 'Bob_second'},
        {'searchStr': 'Charles_second'},
        {'searchStr': 'Dog_one'},
        {'searchStr': 'Dog_second'}]
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#efefef',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <SearchList
          data={dataSource}
          renderRow={this.renderRow.bind(this)}
          cellHeight={cellheight}
          title='Search List'
          searchPlaceHolder='Search'
        />
      </View>
    )
  }
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

## License
This library is distributed under MIT Licence.
