/**
 * Created by erichua on 13/12/2017.
 */
import {
  Navigator,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native'

export default {
  color: {
    primary: '#171a23',
    textPrimary: '#171a23',

    primaryDark: '#171a23',
    primaryLight: '#171a23',

    // secondary: '',
    maskColor: 'rgba(0, 0, 0, 0.1)'
  },
  size: {
    sectionHeaderHeight: 24,

    toolbarHeight: 56,
    searchInputHeight: 44,

    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,

    // TODO 这里需要关注是否浸入式
    statusBarHeight: Platform.select({
      android: StatusBar.currentHeight,
      ios: Platform.OS === 'ios' && Dimensions.get('window').height === 812 ? 44 : Navigator.NavigationBar.Styles.General.StatusBarHeight
    })
  },
  duration: {
    toggleSearchBar: 300
  }
}
