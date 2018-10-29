import React from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
	Alert,
	Linking
} from 'react-native'
import apiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import asyncStorage from '../storage/asyncStorage'

export default class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: ''
		}
	}

	login () {
		apiUtils.sendRequest(URLS.url.signIn, 'POST', {
			username: this.state.username, password: this.state.password
		})
      .then((serverData) => {
				asyncStorage.setItem('user', serverData.data)
				this.props.navigation.navigate('App')
			})
			.catch(err => {
				if (err.code === 400) Alert.alert('', 'Неверный логин, либо пароль.')
				else { alert(err) }
			})
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<View style={styles.headerContainer}>
					<Text style={[styles.headerText, styles.headerTextLogo]}>Mind </Text>
					<Text style={StyleSheet.flatten([styles.headerText, styles.headerTextLogo, {color: 'red'}])}>&</Text>
					<Text style={[styles.headerText, styles.headerTextLogo]}> Machine</Text>					
				</View>

				<View style={styles.postHeaderContainer}>
					<Text style={[styles.headerText, styles.headerTextLower]}>Кабинет сотрудника</Text>
				</View>
				
				<View style={styles.dataContainer}>
					<View style={styles.textInputContainer}>
						<TextInput
							style={styles.textInput}
							placeholder='Логин'
							onChangeText={ (username) => this.setState({username})}
							underlineColorAndroid='transparent'
						/>
					</View>
					<View style={styles.textInputContainer}>
						<TextInput
							style={styles.textInput}
							secureTextEntry={true}
							placeholder='Пароль'
							onChangeText={ (password) => this.setState({password})}
							underlineColorAndroid='transparent'
						/>
					</View>
					<TouchableOpacity
						style={styles.btn}
						onPress={() => this.login()}
					>
						<Text style={styles.loginButtonText}>Войти</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.contactsContainer}>
					<Text style={styles.contactsText}>
						Связаться с нами: 8-(919)-1111111
					</Text>
				</View>

				<View style={styles.footerContainer}>
					<Text style={styles.footerText}>
						Версия: 1.0.0
					</Text>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		paddingTop: 30,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		flex: 2
	},
	postHeaderContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	headerText: {
		fontSize: 40,
		color: '#000'
	},
	headerTextLogo: {
		fontSize: 40,
		fontWeight: 'bold'
	},
	headerTextLower: {
		fontSize: 20
	},
	dataContainer: {
		flex: 6
	},
	textInputContainer: {
		flex: 2,
		margin: 20,
		alignSelf: 'stretch',
		backgroundColor: '#fff'	,
		borderBottomWidth: 2,
		borderBottomColor: '#b2b2b2'
	},
	textInput: {
		fontSize: 30
	},
	btn: {
		flex: 2,
		height: 10,
		marginLeft: 20,
		marginRight: 20,
		borderRadius: 5,
		backgroundColor: primaryColor,
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginButtonText: {
		fontSize: 20,
		color: '#fff'
	},
	contactsContainer: {
		flex: 4,
		alignItems: 'center'
	},
	contactsText: {
		paddingTop: 20,
		fontSize: 16
	},
	footerContainer: {
		flex: 1,
		bottom: 0,
		alignSelf: 'center'
	},
	footerText: {
		color: tipColor
	}
})
