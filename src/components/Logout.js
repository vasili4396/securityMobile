import React from 'react'
import apiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import asyncStorage from '../storage/asyncStorage'

export default class Logout extends React.Component {
  constructor(props) {
		super(props)
		this.logout()
	}
	
	logout = () => {
		apiUtils.sendRequest(URLS.url.logout, 'POST', {})
      .then(() => {
        asyncStorage.clearStorage()
        this.props.navigation.navigate('AuthLoading')
			})
			.catch(err => {
				alert(err)
			})
	}

	render() {
		return null
	}
}