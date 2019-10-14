/**
 * Created by haywoodfu on 17/4/16.
 */

import {
  View,
  Text,
  StyleSheet,
  ListView,
  PixelRatio,
  Animated,
  Image,
  Platform
} from 'react-native'

import React, { Component } from 'react'

import {
  sTrim
} from './utils/utils'

import SearchBar from './components/SearchBar'
import pinyin from 'js-pinyin'
import Toolbar from './components/Toolbar'
import Touchable from './utils/Touchable'
import SectionIndex from './components/SectionIndex'
import PropTypes from 'prop-types'
import Theme from './components/Theme'
import SearchService from './SearchService'
import HighlightableText from './components/HighlightableText'

export default class SearchList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    // use `renderRow` to get much more freedom
    rowHeight: PropTypes.number.isRequired,

    hideSectionList: PropTypes.bool,

    sectionHeaderHeight: PropTypes.number,

    searchListBackgroundColor: PropTypes.string,

    toolbarBackgroundColor: PropTypes.string,

    searchBarToggleDuration: PropTypes.number,
    searchBarBackgroundColor: PropTypes.string,

    searchInputBackgroundColor: PropTypes.string,
    searchInputBackgroundColorActive: PropTypes.string,
    // default state text color for the search input
    searchInputTextColor: PropTypes.string,
    // active state text color for the search input
    searchInputTextColorActive: PropTypes.string,
    searchInputPlaceholderColor: PropTypes.string,
    searchInputPlaceholder: PropTypes.string,

    title: PropTypes.string,
    titleTextColor: PropTypes.string,

    cancelTitle: PropTypes.string,
    cancelTextColor: PropTypes.string,

    // use `renderSectionIndexItem` to get much more freedom
    sectionIndexTextColor: PropTypes.string,
    renderSectionIndexItem: PropTypes.func,

    sortFunc: PropTypes.func,
    resultSortFunc: PropTypes.func,

    onScrollToSection: PropTypes.func,

    renderBackButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderEmptyResult: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    // custom render row
    renderRow: PropTypes.func.isRequired,

    onSearchStart: PropTypes.func,
    onSearchEnd: PropTypes.func
  }

  static defaultProps = {
    sectionHeaderHeight: Theme.size.sectionHeaderHeight,
    rowHeight: Theme.size.rowHeight,
    sectionIndexTextColor: '#171a23',
    searchListBackgroundColor: Theme.color.primaryDark,
    toolbarBackgroundColor: Theme.color.primaryDark,
  }

  constructor (props) {
    super(props)
    const listDataSource = new ListView.DataSource({
      getSectionData: SearchList.getSectionData,
      getRowData: SearchList.getRowData,
      rowHasChanged: (row1, row2) => {
        if (row1 !== row2) {
          return true
        } else return !!(row1 && row2 && row1.matcher && row2.matcher && row1.matcher !== row1.matcher)
      },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.state = {
      isSearching: false,
      searchStr: '',
      animatedValue: new Animated.Value(0),
      dataSource: listDataSource
    }

    this.sectionIDs = []
    this.copiedSource = []

    pinyin.setOptions({checkPolyphone: false, charCase: 2})
  }

  static getSectionData (dataBlob, sectionID) {
    return dataBlob[sectionID]
  }

  static getRowData (dataBlob, sectionID, rowID) {
    return dataBlob[sectionID + ':' + rowID]
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps && this.props.data !== nextProps.data) {
      this.initList(nextProps.data)
    }
  }

  componentDidMount () {
    this.initList(this.props.data)
  }

  initList (data = []) {
    this.copiedSource = Array.from(data)
    this.parseInitList(SearchService.sortList(SearchService.initList(this.copiedSource), this.props.sortFunc))
  }

  parseInitList (srcList) {
    const {rowsWithSection, sectionIDs, rowIds} = SearchService.parseList(srcList)
    this.sectionIDs = sectionIDs
    this.rowIds = rowIds
    this.setState({
      isSearching: false,
      dataSource: this.state.dataSource.cloneWithRowsAndSections(
        rowsWithSection,
        (!sectionIDs || sectionIDs.length === 0) ? [''] : sectionIDs,
        rowIds
      )
    })
  }

  search (input) {
    this.setState({searchStr: input})
    if (input) {
      input = sTrim(input)
      const tempResult = SearchService.search(this.copiedSource, input.toLowerCase())
      if (tempResult.length === 0) {
        this.setState({
          isSearching: true,
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            {},
            [],
            [])
        })
      } else {
        const {
          searchResultWithSection,
          rowIds
        } = SearchService.sortResultList(tempResult, this.props.resultSortFunc)
        this.rowIds = rowIds
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(
            searchResultWithSection,
            [''],
            rowIds)
        })
      }
    } else {
      this.parseInitList(this.copiedSource)
    }
  }

  /**
   * default section header in ListView
   * @param sectionData
   * @param sectionID
   * @returns {XML}
   * @private
   */
  _renderSectionHeader (sectionData, sectionID) {
    if (!sectionID) {
      return (<View />)
    } else {
      return (
        <View style={[styles.sectionHeader, {height: this.props.sectionHeaderHeight}]}>
          <View style={{
            justifyContent: 'center',
            height: this.props.sectionHeaderHeight
          }}>
            <Text style={styles.sectionTitle}>{sectionID}</Text>
          </View>
        </View>
      )
    }
  }

  /**
   * default section index item
   * @param sectionData
   * @param sectionID
   * @returns {XML}
   * @private
   */
  _renderSectionIndexItem (sectionData, sectionID) {
    return (
      <Text style={{textAlign: 'center', color: this.props.sectionIndexTextColor, fontSize: 14, height: 20}}>
        {sectionID}
      </Text>
    )
  }

  /**
   * default render Separator
   * @param sectionID
   * @param rowID
   * @param adjacentRowHighlighted
   * @returns {XML}
   */
  _renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
    let style = styles.rowSeparator
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide]
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID} style={style}>
        <View style={{
          height: 1 / PixelRatio.get(),
          backgroundColor: '#fafafa'
        }} />
      </View>
    )
  }

  /**
   * render default list view footer
   * @returns {XML}
   * @private
   */
  _renderFooter () {
    return <View style={styles.scrollSpinner} />
  }

  /**
   * render default list view header
   * @returns {null}
   * @private
   */
  _renderHeader () {
    return null
  }

  /**
   *
   * @param item
   * @param sectionID
   * @param rowID
   * @param highlightRowFunc
   * @returns {XML}
   * @private
   */
  _renderRow (item, sectionID, rowID, highlightRowFunc) {
    return <View style={{
      flex: 1,
      marginLeft: 20,
      height: this.props.rowHeight,
      justifyContent: 'center'
    }}>
      <HighlightableText text={item.searchStr} matcher={item.matcher} />
    </View>
  }

  enterSearchState () {
    this.setState({isSearching: true})
    Animated.timing(this.state.animatedValue, {
      duration: this.props.searchBarToggleDuration || Theme.duration.toggleSearchBar,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
    })
  }

  exitSearchState () {
    Animated.timing(this.state.animatedValue, {
      duration: this.props.searchBarToggleDuration || Theme.duration.toggleSearchBar,
      toValue: 0,
      useNativeDriver: true
    }).start(() => {
      this.search('')
      this.setState({isSearching: false})
    })
  }

  onFocus () {
    if (!this.state.isSearching) {
      this.enterSearchState()
    }
    this.props.onSearchStart && this.props.onSearchStart()
  }

  onBlur () {
    this.props.onSearchEnd && this.props.onSearchEnd()
  }

  onClickCancel () {
    this.exitSearchState()
    this.props.onSearchEnd && this.props.onSearchEnd()
  }

  cancelSearch () {
    this.refs.searchBar && this.refs.searchBar.cancelSearch && this.refs.searchBar.cancelSearch()
  }

  scrollToSection (section) {
    if (!this.sectionIDs || this.sectionIDs.length === 0) {
      return
    }
    let y = this.props.headerHeight || 0

    let rowHeight = this.props.rowHeight
    let sectionHeaderHeight = this.props.sectionHeaderHeight
    let index = this.sectionIDs.indexOf(section)

    let numcells = 0
    for (let i = 0; i < index && i < this.rowIds.length; i++) {
      numcells += this.rowIds[i].length
    }

    sectionHeaderHeight = index * sectionHeaderHeight
    y += numcells * rowHeight + sectionHeaderHeight

    this.refs.searchListView.scrollTo({x: 0, y: y, animated: false})

    this.props.onScrollToSection && this.props.onScrollToSection(section)
  }

  render () {
    return (
      <Animated.View
        ref='view'
        style={[{
          // 考虑上动画以后页面要向上移动，这里必须拉长
          height: Theme.size.windowHeight + Theme.size.toolbarHeight,
          width: Theme.size.windowWidth,
          transform: [
            {
              translateY: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -Theme.size.toolbarHeight]
              })
            }
          ]
        }, this.props.style]}>
        <View style={[{
          flex: 1,
          backgroundColor: this.props.searchListBackgroundColor
        }]}>
          <Toolbar
            animatedValue={this.state.animatedValue}

            style={[{
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              }),
              backgroundColor: this.props.toolbarBackgroundColor
            }]}
            title={this.props.title}
            textColor={this.props.titleTextColor}
            renderBackButton={this.props.renderBackButton || this._renderBackButton.bind(this)}
            renderRightButton={this.props.renderRightButton}
          />

          <SearchBar
            placeholder={this.props.searchInputPlaceholder ? this.props.searchInputPlaceholder : ''}

            onChange={this.search.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}

            onClickCancel={this.onClickCancel.bind(this)}
            cancelTitle={this.props.cancelTitle}
            cancelTextColor={this.props.cancelTextColor}

            searchBarBackgroundColor={this.props.searchBarBackgroundColor}

            searchInputBackgroundColor={this.props.searchInputBackgroundColor}
            searchInputBackgroundColorActive={this.props.searchInputBackgroundColorActive}
            searchInputPlaceholderColor={this.props.searchInputPlaceholderColor}
            searchInputTextColor={this.props.searchInputTextColor}
            searchInputTextColorActive={this.props.searchInputTextColorActive}
            ref='searchBar' />
          {this._renderStickHeader()}

          <View
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
            style={styles.listContainer}>
            {this._renderSearchBody.bind(this)()}
            {this._renderSectionIndex.bind(this)()}
          </View>
        </View>
        {this._renderMask.bind(this)()}
      </Animated.View>
    )
  }

  /**
   * render the main list view
   * @returns {*}
   * @private
   */
  _renderSearchBody () {
    const {isSearching, searchStr} = this.state
    const {renderEmptyResult, renderEmpty, data} = this.props

    const isEmptyResult = this.state.dataSource.getRowCount() === 0
    if (isSearching && isEmptyResult && renderEmptyResult) {
      return renderEmptyResult(searchStr)
    } else {
      if (data && data.length > 0) {
        return (
          <ListView
            initialListSize={15}
            pageSize={10}
            onEndReachedThreshold={30}
            ref='searchListView'
            dataSource={this.state.dataSource}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator

            renderRow={this.props.renderRow || this._renderRow.bind(this)}
            renderSeparator={this.props.renderSeparator || this._renderSeparator.bind(this)}
            renderSectionHeader={this.props.renderSectionHeader || this._renderSectionHeader.bind(this)}
            renderFooter={this.props.renderFooter || this._renderFooter.bind(this)}
            renderHeader={this.props.renderHeader || this._renderHeader.bind(this)}

            enableEmptySections />
        )
      } else {
        if (renderEmpty) {
          return renderEmpty()
        }
      }
    }
  }

  /**
   * render a custom stick header, isSearching is pass to renderStickHeader
   * @returns {*}
   * @private
   */
  _renderStickHeader () {
    const {renderStickHeader} = this.props
    const {isSearching} = this.state
    return renderStickHeader ? renderStickHeader(isSearching) : null
  }

  /**
   * render the modal mask when searching
   * @returns {XML}
   * @private
   */
  _renderMask () {
    const {isSearching, searchStr} = this.state
    if (isSearching && !searchStr) {
      return (
        <Touchable
          onPress={this.cancelSearch.bind(this)} underlayColor='rgba(0, 0, 0, 0.0)'
          style={[styles.maskStyle]}>
          <Animated.View />
        </Touchable>
      )
    }
  }

  /**
   * render back button on the Toolbar
   * @returns {XML}
   * @private
   */
  _renderBackButton () {
    return (
      <Touchable
        onPress={this.props.onPress}>
        <Image
          hitSlop={{top: 10, left: 20, bottom: 10, right: 20}}
          style={[{
            width: 20,
            height: 20,
            paddingLeft: 15,
            paddingRight: 15
          }]}
          source={require('./images/icon-back.png')} />
      </Touchable>
    )
  }

  /**
   * render the alphabetical index
   * @returns {*}
   * @private
   */
  _renderSectionIndex () {
    const {hideSectionList} = this.props
    if (hideSectionList) {
      return null
    } else {
      return (
        <View pointerEvents={'box-none'} style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: Theme.size.toolbarHeight,
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <SectionIndex
            style={{
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }}
            onSectionSelect={this.scrollToSection.bind(this)}
            sections={this.sectionIDs}
            renderSectionItem={this.props.renderSectionIndexItem || this._renderSectionIndexItem.bind(this)} />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  rowSeparator: {
    backgroundColor: '#fff',
    paddingLeft: 25
  },
  rowSeparatorHide: {
    opacity: 0.0
  },
  sectionHeader: {
    flex: 1,
    height: Theme.size.sectionHeaderHeight,
    justifyContent: 'center',
    paddingLeft: 25,
    backgroundColor: '#fafafa'
  },
  sectionTitle: {
    color: '#979797',
    fontSize: 14
  },
  separator2: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 1
  },
  maskStyle: {
    position: 'absolute',
    top: Theme.size.headerHeight + Theme.size.searchInputHeight,
    // top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.color.maskColor,
    zIndex: 999
  },
  scrollSpinner: {
    ...Platform.select({
      android: {
        height: Theme.size.searchInputHeight
      },
      ios: {
        marginVertical: 40
      }
    }),
  }
})
