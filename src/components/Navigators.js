import { createSwitchNavigator } from 'react-navigation'
import SideMenu from './SideMenu'

export default createSwitchNavigator(
  {
    App: SideMenu
  },
  {
    initialRouteName: 'App'
  }
)