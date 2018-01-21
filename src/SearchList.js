/**
 * Created by haywoodfu on 17/4/16.
 */

import {
  View,
  Text,
  StyleSheet,
  ListView,
  PixelRatio,
  Animated
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

const defaultCellHeight = 0

export default class SearchList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    cellHeight: PropTypes.number.isRequired,

    hideSectionList: PropTypes.bool,
    sectionHeaderHeight: PropTypes.number,
    searchBarBgColor: PropTypes.string,
    title: PropTypes.string,
    textColor: PropTypes.string,
    cancelTitle: PropTypes.string,

    sortFunc: PropTypes.func,
    resultSortFunc: PropTypes.func,
    onScrollToSection: PropTypes.func,
    renderAlphaSection: PropTypes.func,
    showActiveSearchIcon: PropTypes.bool,
    leftButtonStyle: PropTypes.object,
    backIcon: PropTypes.number,
    backIconStyle: PropTypes.object,

    renderHeader: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderEmptyResult: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderFooter: PropTypes.func
  }

  static defaultProps = {
    sectionHeaderHeight: Theme.size.sectionHeaderHeight
  }

  constructor (props) {
    super(props)
    const listDataSource = new ListView.DataSource({
      getSectionData: SearchList.getSectionData,
      getRowData: SearchList.getRowData,
      rowHasChanged: (row1, row2) => {
        if (row1 !== row2) {
          return true
        } else return !!(row1 && row2 && row1.macher && row2.macher && row1.macher !== row1.macher)
      },
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.state = {
      isSearching: false,
      animatedValue: new Animated.Value(0),
      dataSource: listDataSource
    }

    this.searchStr = ''
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
    this.searchStr = input
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
          isSearching: true,
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

  renderSectionHeader (sectionData, sectionID) {
    if (!sectionID) {
      return (
        <View />)
    } else {
      return (
        <View style={[styles.sectionHeader, {height: this.props.sectionHeaderHeight}]}>
          <Text style={styles.sectionTitle}>{sectionID}</Text>
        </View>)
    }
  }

  renderAlphaSection (sectionData, sectionID) {
    return (<Text style={{color: '#171a23', fontSize: 11, width: 36, height: 14}}>{sectionID}</Text>)
  }

  renderSeparator (sectionID,
                   rowID,
                   adjacentRowHighlighted) {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted)
    } else {
      let style = styles.rowSeparator
      if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide]
      }
      return (
        <View key={'SEP_' + sectionID + '_' + rowID} style={style}>
          <View style={{
            height: 1 / PixelRatio.get(),
            backgroundColor: '#efefef'
          }} />
        </View>
      )
    }
  }

  renderFooter () {
    return <View style={styles.scrollSpinner} />
  }

  renderRow (item,
             sectionID,
             rowID,
             highlightRowFunc) {
    if (this.props.renderRow) {
      return this.props.renderRow(item, sectionID, rowID, highlightRowFunc, this.state.isSearching)
    } else {
      return <View style={{flex: 1, height: this.props.cellHeight || defaultCellHeight}}>
        <Text>{item && item.searchStr ? item.searchStr : ''}</Text>
      </View>
    }
  }

  enterSearchState () {
    this.setState({isSearching: true})
    Animated.timing(this.state.animatedValue, {
      duration: Theme.duration.toggleSearchBar,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
    })
  }

  exitSearchState () {
    Animated.timing(this.state.animatedValue, {
      duration: Theme.duration.toggleSearchBar,
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
  }

  onBlur () {
    // this.cancelSearch()
  }

  onClickCancel () {
    this.exitSearchState()
  }

  cancelSearch () {
    this.refs.searchBar && this.refs.searchBar.cancelSearch && this.refs.searchBar.cancelSearch()
  }

  scrollToSection (section) {
    if (!this.sectionIDs || this.sectionIDs.length === 0) {
      return
    }
    let y = this.props.headerHeight || 0

    let cellHeight = this.props.cellHeight || defaultCellHeight
    let sectionHeaderHeight = this.props.sectionHeaderHeight
    let index = this.sectionIDs.indexOf(section)

    let numcells = 0
    for (let i = 0; i < index && i < this.rowIds.length; i++) {
      numcells += this.rowIds[i].length
    }

    sectionHeaderHeight = index * sectionHeaderHeight
    y += numcells * cellHeight + sectionHeaderHeight

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
        <View style={{
          flex: 1,
          backgroundColor: Theme.color.primaryDark
        }}>
          <Toolbar
            animatedValue={this.state.animatedValue}

            style={[{
              opacity: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }, this.props.toolbarStyle]}
            title={this.props.title}
            textColor={this.props.textColor}
          />

          <SearchBar
            placeholder={this.props.searchPlaceHolder ? this.props.searchPlaceHolder : ''}

            onChange={this.search.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}

            onClickCancel={this.onClickCancel.bind(this)}
            cancelTitle={this.props.cancelTitle}
            textColor={this.props.textColor}
            customSearchBarStyle={this.props.customSearchBarStyle}
            activeSearchBarColor={this.props.activeSearchBarColor}
            showActiveSearchIcon={this.props.showActiveSearchIcon}
            searchBarActiveColor={this.props.searchBarActiveColor}
            ref='searchBar' />
          {this._renderStickHeader()}

          <View
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
            style={styles.listContainer}>
            {this._renderSearchBody.bind(this)()}
            {this._renderSecetionIndex.bind(this)()}
          </View>
        </View>
        {this._renderMask.bind(this)()}
      </Animated.View>
    )
  }

  _renderSearchBody () {
    const {isSearching} = this.state
    const {renderEmptyResult, renderEmpty, data} = this.props

    const isEmptyResult = this.state.dataSource.getRowCount() === 0
    if (isSearching && isEmptyResult && renderEmptyResult) {
      return renderEmptyResult(this.searchStr)
    } else {
      if (data && data.length > 0) {
        return (
          <ListView
            initialListSize={15}
            pageSize={10}
            onEndReachedThreshold={30}
            ref='searchListView'
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator
            renderSeparator={this.props.renderSeparator ? this.props.renderSeparator : this.renderSeparator.bind(this)}
            renderSectionHeader={this.props.renderSectionHeader ? this.props.renderSectionHeader : this.renderSectionHeader.bind(this)}
            renderFooter={this.props.renderFooter ? this.props.renderFooter : this.renderFooter.bind(this)}
            renderHeader={this.props.renderHeader && this.props.renderHeader}
            enableEmptySections />
        )
      } else {
        if (renderEmpty) {
          return renderEmpty()
        }
      }
    }
  }

  _renderStickHeader () {
    const {renderStickHeader} = this.props
    const {isSearching} = this.state
    if (!isSearching && renderStickHeader) {
      return renderStickHeader()
    }
  }

  _renderMask () {
    const {isSearching} = this.state
    if (isSearching && !this.searchStr) {
      return (
        <Touchable
          onPress={this.cancelSearch.bind(this)} underlayColor='rgba(0, 0, 0, 0.0)'
          style={[styles.maskStyle, {}]}>
          <Animated.View
            style={[styles.maskStyle]} />
        </Touchable>
      )
    }
  }

  _renderSecetionIndex () {
    // TODO
    const {hideSectionList} = this.props
    if (hideSectionList) {
      return null
    } else {
      return (
        <View style={{
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
            renderSection={this.props.renderAlphaSection ? this.props.renderAlphaSection : this.renderAlphaSection.bind(this)} />
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
    backgroundColor: '#efefef'
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.color.maskColor,
    zIndex: 999
  },
  scrollSpinner: {
    marginVertical: 40
  }
})
