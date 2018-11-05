import React from 'react'
import { StatusBar } from 'react-native'
import { createSwitchNavigator } from 'react-navigation'
import asyncStorage from './../storage/asyncStorage'
import LoginScreen from './Login'
import SideMenu from './SideMenu'

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this._getUserInfo()
    // StatusBar.setBackgroundColor(primaryColor)
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
    App: SideMenu,
    Auth: LoginScreen
  },
  {
    initialRouteName: 'AuthLoading'
  }
)