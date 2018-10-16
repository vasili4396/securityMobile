import React from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
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
				alert(err)
			})
	}

	render() {
		return (
			<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
				<View style={styles.container}>
					<Text style={styles.header}>-Login-</Text>
						<TextInput
							style={styles.textInput}
							placeholder='Username'
							onChangeText={ (username) => this.setState({username})}
							underlineColorAndroid='transparent'
						/>
						<TextInput
							style={styles.textInput}
							placeholder='Password'
							onChangeText={ (password) => this.setState({password})}
							underlineColorAndroid='transparent'
						/>
						<TouchableOpacity
							style={styles.btn}
							onPress={() => this.login()}
						>
							<Text>login</Text>
						</TouchableOpacity>
					</View>
			</KeyboardAvoidingView>
		)
	}
}

const styles = StyleSheet.create({
		wrapper: {
			flex: 1
		},
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#2896d3',
			paddingLeft: 40,
			paddingRight: 40,
		},
		header: {
			fontSize: 24,
			marginBottom: 60,
			color: '#fff',
			fontWeight: 'bold',
		},
		textInput: {
			alignSelf: 'stretch',
			padding: 16,
			marginBottom: 20,
			backgroundColor: '#fff'
		},
		btn: {
			alignSelf: 'stretch',
			backgroundColor: '#01c853',
			padding: 20,
			alignItems: 'center'
		}
})
