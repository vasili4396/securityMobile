import {
	View,
	ScrollView,
	Text,
	Image,
	StyleSheet
} from 'react-native'
import React, {Component} from 'react'
import { createDrawerNavigator, NavigationActions } from 'react-navigation'
import asyncStorage from '../storage/asyncStorage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ProfileScreen from './Profile'
import SettingsScreen from './Settings'
import PreferencesScreen from './Preferences'
import TimetableScreen from './Timetable'
import LogoutScreen from './Logout'

class SideMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: ''
		}
		this._getUserInfo()	
	}

	_getUserInfo () {
    asyncStorage.getItem('user').then(userInfo => {
      this.setState({firstName: userInfo.first_name, lastName: userInfo.last_name})
    })
  }

	navigateToScreen = (route) => () => {
	  const navigateAction = NavigationActions.navigate({
			routeName: route
	  })
	  this.props.navigation.dispatch(navigateAction)
	}
  
	render () {
		const state = this.state
	  return (
		<View style={styles.mainContainer}>
			<View style={styles.userContainer}>
				<Image
					source={require('../../assets/userIcon.png')}
					style={styles.userAvatar}
				>
				</Image>
				<Text style={styles.userFullName}>
					{state.firstName + ' ' + state.lastName}
				</Text>
			</View>
			<View style={styles.navigationMenuContainer}>
				<Text style={styles.sectionHeadingStyle}>
					Section 2
				</Text>
				<View style={styles.navSectionStyle}>
					<Text style={styles.navItemStyle} onPress={this.navigateToScreen('Preferences')}>
						Page2
					</Text>
					<Text style={styles.navItemStyle} onPress={this.navigateToScreen('Timetable')}>
						Page3
					</Text>
				</View>
			</View>
		  <View style={styles.footerContainer}>
				<Text>This is my fixed footer</Text>
		  </View>
		</View>
	  )
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		marginTop: 30,
		flex: 1
	},
	userContainer: {
		flex: 2,
		flexDirection: 'row',
		margin: 15,
		alignItems: 'center'
	},
	userAvatar: {
		height: 40,
		width: 40
	},
	userFullName: {
		fontSize: 20,
		marginLeft: 10
	},
	navigationMenuContainer: {
		flex: 10
	},
	footerContainer: {
		flex: 2
	}
})

export default createDrawerNavigator(
	{
		Timetable: {
			screen: SideMenu
		},
		// Preferences: {
		// 	screen: PreferencesScreen
		// },
		// Profile: {
		// 	screen: ProfileScreen
		// },
		// Settings: {
		// 	screen: SettingsScreen
		// },
		// Logout: {
		// 	screen: LogoutScreen
		// }
	},
	{
		contentComponent: SideMenu
	}
)