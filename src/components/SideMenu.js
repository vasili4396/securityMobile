import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import React, {Component} from 'react'
import { createDrawerNavigator, NavigationActions } from 'react-navigation'
import FirstTask from './First'
import SecondTask from './SecondTask'
import ThirdTask from './ThirdTask'
import FourthTask from './FourthTask'
import FifthTask from './FifthTask'
import SixthTask from './SixthTask'
import Eliptic from './Eliptic'

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
				{this.renderMenuItem('FirstTask', '1. Источники открытого текста')}
				{this.renderMenuItem('SecondTask', '2. КСГПСЧ')}
				{this.renderMenuItem('ThirdTask', '3. Потоковые шифры')}
				{this.renderMenuItem('FourthTask', '4. Псевдопростые числа')}
				{this.renderMenuItem('FifthTask', '5. RSA')}
				{this.renderMenuItem('SixthTask', '6. Подпись RSA')}
				{this.renderMenuItem('Eliptic', 'Эллиптические кривые')}
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
		FirstTask: {
			screen: FirstTask
		},
		SecondTask: {
			screen: SecondTask
		},
		ThirdTask: {
			screen: ThirdTask
		},
		FourthTask: {
			screen: FourthTask
		},
		FifthTask: {
			screen: FifthTask
		},
		SixthTask: {
			screen: SixthTask
		},
		Eliptic: {
			screen: Eliptic
		}
	},
	{
		contentComponent: SideMenu,
		drawerWidth: screenWidth
	}
)