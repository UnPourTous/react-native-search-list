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

    secondary: '',

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
    toggleSearchBar: 1000
  }
}

// /**
//  * 系统相关的一些值
//  */
// import {
//   Navigator,
//   StatusBar,
//   Platform,
//   Dimensions
// } from 'react-native'
// import Device from '../utils/Device'
//
// const {width, height} = Dimensions.get('window')
//
// const statusBarHeight = Platform.select({ // 导航栏 + 状态栏的高度
//   android: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
//   // iPhoneX要特殊处理
//   ios: Device.isPhoneX() ? 44 : Navigator.NavigationBar.Styles.General.StatusBarHeight
// })
// export default {
//   NAV_BAR_HEIGHT: Platform.select({ // 纯导航栏的高度
//     android: Navigator.NavigationBar.Styles.General.NavBarHeight,
//     ios: Navigator.NavigationBar.Styles.General.NavBarHeight
//   }),
//   TOTAL_NAV_BAR_HEIGHT: Navigator.NavigationBar.Styles.General.NavBarHeight + statusBarHeight,
//   STATUS_BAR_HEIGHT: statusBarHeight,
//   WINDOW_WIDTH: width, // 手机屏幕宽度
//   WINDOW_HEIGHT: height, // 手机屏幕高度
//
//   CONTENT_HEIGHT: Platform.select({ // 沉浸式页面中实际的可视内容高度
//     android: height - (Platform.Version >= 21 ? 0 : StatusBar.currentHeight),
//     ios: height
//   }),
//
//   PORTRAIT_UNSAFE_AREA_TOP_HEIGHT: Device.isPhoneX() ? 44 : 0, // 顶部安全非区域高度, Home indicator
//   PORTRAIT_UNSAFE_AREA_BOTTOM_HEIGHT: Device.isPhoneX() ? 34 : 0 // 底部安全非区域高度, Home indicator
// }

