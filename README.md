# React Native Search List

<p align="center">
<a href="https://www.npmjs.com/package/@zanechua/react-native-search-list"><img src="https://img.shields.io/npm/v/@zanechua/react-native-search-list.svg?style=flat-square" alt="Release"></a>
<a href="https://www.npmjs.com/package/@zanechua/react-native-search-list"><img src="https://img.shields.io/npm/dm/@zanechua/react-native-search-list.svg?style=flat-square" alt="Release"></a>
<a href="https://github.com/zanechua/react-native-search-list/releases"><img src="https://img.shields.io/github/release/zanechua/react-native-search-list.svg?style=flat-square" alt="Release"></a>
<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-semistandard-brightgreen.svg?style=flat-square" alt="Standard - JavaScript Style Guide"></a>
<a href="https://github.com/zanechua/react-native-search-list/blob/master/LICENSE"><img src="https://img.shields.io/github/license/zanechua/react-native-search-list.svg?style=flat-square" alt="License"></a>
</p>


A searchable ListView which supports Chinese PinYin and alphabetical index.

The original library was missing some commonly used features that are now implemented and the deprecated ListView was replaced with a SectionList to be compatible with future releases of React Native.

<p align="center">
  <img src='https://raw.githubusercontent.com/zanechua/react-native-search-list/master/screenshots/search-list-demo-v2.gif' />
</p>

The following picture may be helpful to understand the structure and APIs: 

<p align="center">
<img src='https://raw.githubusercontent.com/zanechua/react-native-search-list/master/screenshots/structure.jpg' />
</p>

## Installation

`$ npm install @zanechua/react-native-search-list --save`

## Usage

To Use SearchList, need a array of object as data source,and each object has searchStr property, eample code are put in `./entry.js`.

```js
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
        <View key={rowID} style={{flex: 1, marginLeft: 20, height: rowHeight, justifyContent: 'center'}}>
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

          rowHeight={rowHeight}

          toolbarBackgroundColor={'#2196f3'}
          title='Search List Demo'
          cancelTitle='取消'
          onClickBack={() => {}}

          searchListBackgroundColor={'#2196f3'}

          searchBarToggleDuration={300}

          searchInputBackgroundColor={'#0069c0'}
          searchInputBackgroundColorActive={'#6ec6ff'}
          searchInputPlaceholderColor={'#FFF'}
          searchInputTextColor={'#FFF'}
          searchInputTextColorActive={'#000'}
          searchInputPlaceholder='Search'
          sectionIndexTextColor={'#6ec6ff'}
          searchBarBackgroundColor={'#2196f3'}
        />
      </View>
    )
  }
}
```
## APIs

prop name | type | description | default value
--- | --- | --- | --- 
data | array | The rows of list view.each object should contain `searchStr`, it will be used for search source. 
renderRow | number | Render your custom row content | 
rowHeight | number | The height of the default row content, it will be used for scroll calculate | `40`
sectionHeaderHeight | number | The height of section header content | `24`
listContainerStyle | object | Style properties for the internal TextInput Component | 
searchListBackgroundColor | string | BackgroundColor for searchList | `#171a23`
toolbarBackgroundColor | string | Toolbar background color | `#171a23`
searchBarToggleDuration | number | Custom search bar animation duration | `300`
searchBarBackgroundColor | string | Custom search bar background color | `#171a23`
searchBarContainerStyle | object | Style properties for the SearchBar Container Component | 
searchBarStyle | object | Style properties for the SearchBar Component | 
searchOnDefaultValue | bool | Enable filtered results based on default value | 
searchInputBackgroundColor | string | Custom search input default state background color | `#ffffff`
searchInputBackgroundColorActive | string | Custom search input searching state background color | 
searchInputPlaceholder | string | Custom search input placeholder text | 
searchInputDefaultValue | string | Custom search input default value text | 
searchInputPlaceholderColor | string | Custom search input placeholder text color | `#979797`
searchInputTextColor | string | Custom search input default state text color | `#171a23`
searchInputTextColorActive | string | Custom search input searching state text color | `#ffffff`
searchInputStyle | object | Style properties for the internal TextInput Component | 
statusBarHeight | number | The height of the status bar | 
toolbarHeight | number | The height of the tool bar | `44`
searchBarBackgroundColor | string | Custom search bar background color | 
staticCancelButton | bool | Enable/Disable a static cancel button with no slide in animation | `false`
showSearchIcon | bool | Show/Hide the search icon | `true`
displayMask | bool | Show/Hide the mask during searching | `true`
title | string | Toolbar title | 
titleTextColor | string | Toolbar title text color | 
cancelTitle | string | Search bar cancel text color | `Cancel`
cancelTextColor | string | Search bar cancel text color | `#ffffff`
cancelContainerStyle | object | Style properties for the cancel button container |
hideSectionList | bool | Whether to hide the alphabetical section listing view or not. |
sortFunc | func | The sort function for the list view data source,sorting alphabetical by default |
resultSortFunc | func | The sort function for the search result,sorting first match position by default |
onScrollToSection | func | The callback of alphabetical section view be clicked or touch |
sectionIndexTextColor | string | Section index text color | 
sectionIndexContainerStyle | object | Style properties for the Section Index Container Component | 
renderSectionIndexItem | func | Custom render SectionIndexItem. |
renderBackButton | func | Render a custom back buttom on Toolbar. |
renderEmpty | func | Render a view when data is empty. |
renderEmptyResult | func | Render a view when search result is empty. |
renderItemSeparator | func | Render row separator. |
renderSectionHeader | func | `renderSectionHeader` for the internal ListView |
renderHeader | func | `renderHeader` for the internal ListView |
renderFooter | func | `renderFooter` for the internal ListView |
renderRow | func | `renderRow` for the internal ListView |
renderToolbar | func | `renderToolbar` for the Toolbar |
renderCancel | func | `renderCancel` for custom rendering of the cancel button |
renderCancelWhileSearching | func | `renderCancelWhileSearching` for custom rendering of the cancel button during search |
renderToolbar | func | `renderToolbar` for the Toolbar |
onSearchStart | func | Callback when searching start. |
onSearchEnd | func | Callback when searching end. |


## Contributions
* [js-pinyin](https://github.com/waterchestnut/pinyin)
* [@unpourtous/react-native-search-list](https://github.com/unpourtous/react-native-search-list)
* [react-native-selectablesectionlistview](https://github.com/johanneslumpe/react-native-selectablesectionlistview)
