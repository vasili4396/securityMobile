import React from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert
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
				if (err.code === 400) Alert.alert('', 'Неправильный логин, либо пароль.')
				else { alert(err) }
			})
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<ImageBackground
					source={require('../../assets/backgroundImage.png')}
					style={styles.imageContainer}
					resizeMode='cover'
				>
					<View style={{flexDirection: 'row'}}>
						<Text style={styles.imageBackgroundText}>Mind </Text>
						<Text style={StyleSheet.flatten([styles.imageBackgroundText, {color: 'red'}])}>&</Text>
						<Text style={styles.imageBackgroundText}> Machine</Text>
					</View>
					<Text style={styles.imageBackgroundTextLower}>
						Кабинет сотрудника
					</Text>
				</ImageBackground>
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
			</View>
		)
	}
}

const styles = StyleSheet.create({
	imageContainer: {
		width: '100%',
		flex: 7,
		alignItems: 'center',
    	justifyContent:'center',
	},
	imageBackgroundText: {
		textAlign: 'center',
		fontSize: 40,
		color: '#fff',
		fontWeight: 'bold'
	},
	imageBackgroundTextLower: {
		textAlign: 'center',
		fontSize: 20,
		color: '#fff'
	},
	dataContainer: {
		flex: 3
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
		fontSize: 20
	},
	btn: {
		flex: 3,
		marginBottom: 10,
		marginLeft: 50,
		marginRight: 50,
		borderRadius: 5,
		backgroundColor: '#6bbf5f',
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginButtonText: {
		fontSize: 20,
		color: '#fff'
	}
})
