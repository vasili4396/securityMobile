import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import React, {Component} from 'react'
import { createDrawerNavigator, NavigationActions } from 'react-navigation'
import asyncStorage from '../storage/asyncStorage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NotificationsScreen from './Notifications'
import SettingsScreen from './Settings'
import PreferencesScreen from './Preferences'
import TimetableScreen from './Timetable'
import LogoutScreen from './Logout'

const iconSize = 35
const screenWidth = 0.8 * Dimensions.get('screen').width

class SideMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: '',
			group: ''
		}
		this._getUserInfo()	
	}

	_getUserInfo () {
    asyncStorage.getItem('user').then(userInfo => {
      this.setState({firstName: userInfo.first_name, lastName: userInfo.last_name, group: userInfo.group})
    })
  }

	navigateToScreen = (route) => () => {
	  const navigateAction = NavigationActions.navigate({
			routeName: route
	  })
	  this.props.navigation.dispatch(navigateAction)
	}

	renderMenuItem (routeName, icon, itemName) {
		return (
			<TouchableOpacity onPress={this.navigateToScreen(routeName)} style={styles.menuItem}>
				<View style={styles.iconContainer}>
					<Icon name={icon} size={iconSize} color={primaryColor}></Icon>
				</View>
				<Text style={styles.menuItemText}>
					{itemName}
				</Text>
			</TouchableOpacity>
		)
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
				<View>
					<Text style={styles.userFullName}>{state.firstName + ' ' + state.lastName}</Text>
					<Text style={styles.userGroup}>{userGroups[state.group]}</Text>
				</View>
				
			</View>

			<View style={styles.navigationMenuContainer}>				
				{this.renderMenuItem('Timetable', 'perm-contact-calendar', 'Расписание')}
				{this.renderMenuItem('Preferences', 'view-week', 'Пожелания на день')}
				{this.renderMenuItem('Notifications', 'notifications', 'Уведомления')}
				{this.renderMenuItem('Settings', 'settings', 'Настройки')}
			</View>

			<View style={styles.footerContainer}>
				{this.renderMenuItem('Logout', 'exit-to-app', 'Выйти')}
			</View>

		</View>
	  )
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: '#888888'
	},
	userContainer: {
		flex: 2,
		flexDirection: 'row',
		margin: 15,
		alignItems: 'center'
	},
	userAvatar: {
		height: 50,
		width: 50
	},
	userFullName: {
		fontSize: 20,
		marginLeft: 10
	},
	userGroup: {
		fontSize: 16,
		marginLeft: 10
	},
	navigationMenuContainer: {
		flex: 10
	},
	menuItem: {
		flexDirection: 'row',
		paddingVertical: 15
	},
	iconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		width: 60,
		paddingLeft: 10
	},
	menuItemText: {
		paddingLeft: 5,
		paddingTop: 13,
		fontSize: 18,
		color: '#fff'
	},
	footerContainer: {
		flex: 2,
		paddingHorizontal: 10
	},
})

export default createDrawerNavigator(
	{
		Timetable: {
			screen: TimetableScreen
		},
		Preferences: {
			screen: PreferencesScreen
		},
		Notifications: {
			screen: NotificationsScreen
		},
		Settings: {
			screen: SettingsScreen
		},
		Logout: {
			screen: LogoutScreen
		}
	},
	{
		contentComponent: SideMenu,
		drawerWidth: screenWidth
	}
)