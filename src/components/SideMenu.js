import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import React, {Component} from 'react'
import { createDrawerNavigator, NavigationActions } from 'react-navigation'
import SecondTask from './SecondTask'
import FourthTask from './FourthTask'

const screenWidth = 0.8 * Dimensions.get('screen').width

class SideMenu extends Component {
	constructor(props) {
		super(props)
		this.state = {
			firstName: '',
			lastName: '',
			group: ''
		}
	}

	navigateToScreen = (route) => () => {
	  const navigateAction = NavigationActions.navigate({
			routeName: route
	  })
	  this.props.navigation.dispatch(navigateAction)
	}

	renderMenuItem (routeName, itemName) {
		return (
			<TouchableOpacity onPress={this.navigateToScreen(routeName)} style={styles.menuItem}>
				<Text style={styles.menuItemText}>
					{itemName}
				</Text>
			</TouchableOpacity>
		)
	}
   
	render () {
	  return (
		<View style={styles.mainContainer}>

			<View style={styles.navigationMenuContainer}>				
				{this.renderMenuItem('SecondTask', '2. КСГПСЧ')}
				{this.renderMenuItem('FourthTask', '4. Псевдопростые числа')}
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
	navigationMenuContainer: {
		flex: 10,
		paddingTop: 15
	},
	menuItem: {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingLeft: 20
	},
	menuItemText: {
		paddingLeft: 5,
		paddingTop: 13,
		fontSize: 18,
		color: '#fff'
	}
})

export default createDrawerNavigator(
	{
		SecondTask: {
			screen: SecondTask
		},
		// FourthTask: {
		// 	screen: FourthTask
		// },
		// ThirdTask: {
		// 	screen: ThirdTask
		// },
		// FourthTask: {
		// 	screen: FourthTask
		// },
	},
	{
		contentComponent: SideMenu,
		drawerWidth: screenWidth
	}
)