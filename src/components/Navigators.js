import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import asyncStorage from './../storage/asyncStorage'
import { createDrawerNavigator } from 'react-navigation'
import Profile from './Profile'
import LoginScreen from './Login'
import Settings from './Settings'
import Preferences from './Preferences'
import Timetable from './Timetable'
import Logout from './Logout';

const AppDrawerNavigator = createDrawerNavigator({
  Расписание: Timetable,
  Пожелания: Preferences,
  Профиль: Profile,
  Настройки: Settings,
  Выйти: Logout
})

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this._getUserInfo()
  }

  _getUserInfo () {
    asyncStorage.getItem('user').then(userInfo => {
      this.props.navigation.navigate(userInfo ? 'App' : 'Auth')
    })
  }

  render () {
    return null
  }
}

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppDrawerNavigator,
    Auth: LoginScreen
  },
  {
    initialRouteName: 'AuthLoading'
  }
)