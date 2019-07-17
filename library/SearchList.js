'use strict';
import {
  View,
  Text,
  StyleSheet,
  PixelRatio,
  Animated,
  Image,
  Platform,
  SectionList
} from 'react-native';

import React, { Component } from 'react';

import {
  sTrim
} from './utils/utils';

import SearchBar from './components/SearchBar';
import pinyin from 'js-pinyin';
import Toolbar from './components/Toolbar';
import Touchable from './utils/Touchable';
import SectionIndex from './components/SectionIndex';
import PropTypes from 'prop-types';
import Theme from './components/Theme';
import SearchService from './SearchService';
import HighlightableText from './components/HighlightableText';

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
    searchInputDefaultValue: PropTypes.string,

    searchInputStyle: PropTypes.object,
    listContainerStyle: PropTypes.object,

    title: PropTypes.string,
    titleTextColor: PropTypes.string,

    cancelTitle: PropTypes.string,
    cancelTextColor: PropTypes.string,

    // use `renderSectionIndexItem` to get much more freedom
    sectionIndexTextColor: PropTypes.string,
    renderSectionIndexItem: PropTypes.func,
    sectionIndexContainerStyle: PropTypes.object,

    sortFunc: PropTypes.func,
    resultSortFunc: PropTypes.func,

    onScrollToSection: PropTypes.func,

    statusBarHeight: PropTypes.number,
    toolbarHeight: PropTypes.number,
    renderToolbar: PropTypes.func,
    renderCancel: PropTypes.func,
    renderCancelWhileSearching: PropTypes.func,
    cancelContainerStyle: PropTypes.object,
    staticCancelButton: PropTypes.bool,
    showSearchIcon: PropTypes.bool,
    searchBarStyle: PropTypes.object,
    searchBarContainerStyle: PropTypes.object,

    displayMask: PropTypes.bool,
    searchOnDefaultValue: PropTypes.bool,

    renderBackButton: PropTypes.func,
    renderRightButton: PropTypes.func,
    renderEmpty: PropTypes.func,
    renderEmptyResult: PropTypes.func,
    renderItemSeparator: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    // custom render row
    renderRow: PropTypes.func.isRequired,

    onSearchStart: PropTypes.func,
    onSearchEnd: PropTypes.func
  }

  static defaultProps = {
    toolbarHeight: Theme.size.toolbarHeight,
    statusBarHeight: Theme.size.statusBarHeight,
    sectionHeaderHeight: Theme.size.sectionHeaderHeight,
    rowHeight: Theme.size.rowHeight,
    sectionIndexTextColor: '#171a23',
    searchListBackgroundColor: Theme.color.primaryDark,
    toolbarBackgroundColor: Theme.color.primaryDark,
    searchBarContainerStyle: {},
    displayMask: true,
    searchOnDefaultValue: false
  }

  constructor (props) {
    super(props);
    this.state = {
      isReady: false,
      isSearching: false,
      searchStr: '',
      originalListData: [],
      sectionListData: [],
      sectionIds: [],
      animatedValue: new Animated.Value(0)
    };

    pinyin.setOptions({checkPolyphone: false, charCase: 2});
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps && this.props.data !== nextProps.data) {
      this.initList(nextProps.data);
    }
  }

  componentDidMount () {
    this.initList(this.props.data);

    if (this.props.searchOnDefaultValue && this.props.searchInputDefaultValue != '') {
      this.search(this.props.searchInputDefaultValue);
      this.enterSearchState();
    }
  }

  initList (data = []) {
    const copiedSource = Array.from(data);
    this.setState({ originalListData: copiedSource });
    this.parseInitList(SearchService.sortList(SearchService.initList(copiedSource), this.props.sortFunc));
  }

  parseInitList (srcList) {
    const {formattedData, sectionIds} = SearchService.parseList(srcList);
    this.setState({
      isReady: true,
      isSearching: false,
      sectionListData: formattedData,
      sectionIds
    });
  }

  search (input) {
    this.setState({searchStr: input});

    const { originalListData } = this.state;

    if (input) {
      input = sTrim(input);
      const tempResult = SearchService.search(originalListData, input.toLowerCase());

      if (tempResult.length === 0) {
        this.setState({
          isSearching: true,
          sectionListData: Array.from(this.state.sectionListData)
        });
      } else {
        const { searchResultData } = SearchService.sortResultList(tempResult, this.props.resultSortFunc);
        this.setState({
          isSearching: false,
          sectionListData: searchResultData
        });
      }
    } else {
      this.parseInitList(originalListData);
    }
  }

  /**
   * default section header in ListView
   * @param sectionData
   * @param sectionID
   * @returns {XML}
   * @private
   */
  _renderSectionHeader ({ section: { title } }) {
    const { sectionHeaderHeight } = this.props;

    return (
      <View style={[styles.sectionHeader, { height: sectionHeaderHeight }]}>
        <View style={{
          justifyContent: 'center',
          height: sectionHeaderHeight
        }}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      </View>
    );
  }

  /**
   * default section index item
   * @param sectionData
   * @param sectionID
   * @returns {XML}
   * @private
   */
  _renderSectionIndexItem (section) {
    return (
      <Text style={{textAlign: 'center', color: this.props.sectionIndexTextColor, fontSize: 14, height: 20}}>
        {section}
      </Text>
    );
  }

  /**
   * default render Separator
   * @param sectionID
   * @param rowID
   * @param adjacentRowHighlighted
   * @returns {XML}
   */
  _renderItemSeparator ({ section: { title }, highlighted, leadingSection, trailingSection }) {
    let style = styles.rowSeparator;
    if (highlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    const randomKey = Math.random().toString(36).substring(2, 15);

    return (
      <View key={randomKey} style={style}>
        <View style={{
          height: 1 / PixelRatio.get(),
          backgroundColor: '#efefef'
        }} />
      </View>
    );
  }

  /**
   * render default list view footer
   * @returns {XML}
   * @private
   */
  _renderFooter () {
    return <View style={styles.scrollSpinner} />;
  }

  /**
   * render default list view header
   * @returns {null}
   * @private
   */
  _renderHeader () {
    return null;
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
  _renderRow ({ index, item, section }) {
    return <View style={{
      flex: 1,
      marginLeft: 20,
      height: this.props.rowHeight,
      justifyContent: 'center'
    }}>
      <HighlightableText text={item.searchStr} matcher={item.matcher} />
    </View>;
  }

  enterSearchState () {
    this.setState({isSearching: true});
    Animated.timing(this.state.animatedValue, {
      duration: this.props.searchBarToggleDuration || Theme.duration.toggleSearchBar,
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
    });
  }

  exitSearchState () {
    Animated.timing(this.state.animatedValue, {
      duration: this.props.searchBarToggleDuration || Theme.duration.toggleSearchBar,
      toValue: 0,
      useNativeDriver: true
    }).start(() => {
      this.search('');
      this.setState({isSearching: false});
    });
  }

  onFocus () {
    if (!this.state.isSearching) {
      this.enterSearchState();
    }
    this.props.onSearchStart && this.props.onSearchStart();
  }

  onBlur () {
    this.props.onSearchEnd && this.props.onSearchEnd();
  }

  onClickCancel () {
    this.exitSearchState();
    this.props.onSearchEnd && this.props.onSearchEnd();
  }

  cancelSearch () {
    this.refs.searchBar && this.refs.searchBar.cancelSearch && this.refs.searchBar.cancelSearch();
  }

  scrollToSection (sectionIndex) {
    const { sectionIds } = this.state;

    if (!sectionIds || sectionIds.length === 0) {
      return;
    }

    this.refs.searchListView.scrollToLocation({
      itemIndex: 0,
      sectionIndex,
      animated: false
    });

    this.props.onScrollToSection && this.props.onScrollToSection(sectionIndex);
  }

  render () {
    return (
      <Animated.View
        ref='view'
        style={[{
          // 考虑上动画以后页面要向上移动，这里必须拉长
          height: Theme.size.windowHeight + this.props.toolbarHeight,
          width: Theme.size.windowWidth,
          transform: [
            {
              translateY: this.state.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -this.props.toolbarHeight]
              })
            }
          ]
        }, this.props.style]}>
        <View style={[{
          flex: 1,
          backgroundColor: this.props.searchListBackgroundColor
        }]}>

          {this._renderToolbar()}

          <View style={this.props.searchBarContainerStyle}>
            <SearchBar
              placeholder={this.props.searchInputPlaceholder ? this.props.searchInputPlaceholder : ''}
              defaultValue={this.props.searchInputDefaultValue ? this.props.searchInputDefaultValue : ''}

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
              searchInputStyle={this.props.searchInputStyle}

              renderCancel={this.props.renderCancel}
              renderCancelWhileSearching={this.props.renderCancelWhileSearching}
              cancelContainerStyle={this.props.cancelContainerStyle}
              staticCancelButton={this.props.staticCancelButton}
              showSearchIcon={this.props.showSearchIcon}
              searchBarStyle={this.props.searchBarStyle}

              ref='searchBar' />
          </View>
          {this._renderStickHeader()}

          <View
            shouldRasterizeIOS
            renderToHardwareTextureAndroid
            style={[styles.listContainer, this.props.listContainerStyle]}>
            {this._renderSearchBody.bind(this)()}
            {this._renderSectionIndex.bind(this)()}
          </View>
        </View>

        {this.props.displayMask ? this._renderMask.bind(this)() : null}
      </Animated.View>
    );
  }

  /**
   * render the main list view
   * @returns {*}
   * @private
   */
  _renderSearchBody () {
    const { isReady, isSearching, searchStr, sectionListData } = this.state;
    const { renderEmptyResult, renderEmpty, data, rowHeight } = this.props;

    if (isSearching && renderEmptyResult && searchStr !== '') {
      return renderEmptyResult(searchStr);
    } else {
      if (data && data.length > 0 && isReady) {
        return (
          <SectionList
            ref='searchListView'
            keyExtractor={(item, index) => item.searchStr + index + Math.random().toString(36).substring(2, 15)}
            sections={sectionListData}

            initialNumToRender={15}
            onEndReachedThreshold={30}
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator

            renderItem={this.props.renderRow || this._renderRow.bind(this)}
            ItemSeparatorComponent={this.props.renderItemSeparator || this._renderItemSeparator.bind(this)}
            renderSectionHeader={this.props.renderSectionHeader || this._renderSectionHeader.bind(this)}
            ListFooterComponent={this.props.renderFooter || this._renderFooter.bind(this)}
            ListHeaderComponent={this.props.renderHeader || this._renderHeader.bind(this)}

            onScrollToIndexFailed={()=>{}}
          />
        );
      } else {
        if (renderEmpty) {
          return renderEmpty();
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
    const { renderStickHeader } = this.props;
    const { isSearching } = this.state;
    return renderStickHeader ? renderStickHeader(isSearching) : null;
  }

  /**
   * render the modal mask when searching
   * @returns {XML}
   * @private
   */
  _renderMask () {
    const { isSearching, searchStr } = this.state;
    if (isSearching && !searchStr) {
      return (
        <Touchable
          onPress={this.cancelSearch.bind(this)} underlayColor='rgba(0, 0, 0, 0.0)'
          style={[{top: this.props.toolbarHeight + Theme.size.searchInputHeight}, styles.maskStyle]}>
          <Animated.View />
        </Touchable>
      );
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
    );
  }

  /**
   * render Toolbar
   * @returns {XML}
   * @private
   */
  _renderToolbar () {
    const {
      title,
      titleTextColor,
      renderBackButton,
      renderRightButton,
      renderToolbar,
      toolbarHeight,
      toolbarBackgroundColor,
      statusBarHeight } = this.props;
    const { animatedValue } = this.state;

    return renderToolbar ? renderToolbar() : (
      <Toolbar
        animatedValue={animatedValue}
        style={[{
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          backgroundColor: toolbarBackgroundColor,
          height: toolbarHeight,
          paddingTop: statusBarHeight
        }]}
        title={title}
        textColor={titleTextColor}
        renderBackButton={renderBackButton || this._renderBackButton.bind(this)}
        renderRightButton={renderRightButton}
      />
    );
  }

  /**
   * render the alphabetical index
   * @returns {*}
   * @private
   */
  _renderSectionIndex () {
    const { hideSectionList, toolbarHeight, sectionIndexContainerStyle, renderSectionIndexItem } = this.props;
    const { isSearching, sectionIds, animatedValue } = this.state;

    if (isSearching) {
      return null;
    }

    if (hideSectionList) {
      return null;
    } else {
      return (
        <View pointerEvents={'box-none'} style={[{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: toolbarHeight,
          flexDirection: 'column',
          justifyContent: 'center'
        }, sectionIndexContainerStyle]}>
          <SectionIndex
            style={{
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }}
            onSectionSelect={this.scrollToSection.bind(this)}
            sections={sectionIds}
            renderSectionItem={renderSectionIndexItem || this._renderSectionIndexItem.bind(this)} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  rowSeparator: {
    backgroundColor: '#ffffff',
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
    })
  }
});
