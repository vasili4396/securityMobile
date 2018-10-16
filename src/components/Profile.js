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

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstName: 'Test',
      lastName: 'Test',
      email: '',
      status: ''
    }
  }


  render() {
		return (
      <View >
        <Text style={styles.fullNameContainer}>-Профиль-</Text>
        <Text style={styles.fullNameContainer}> 
          {this.state.firstName} {this.state.lastName} 
        </Text> 
      </View>
		)
  }
}

const styles = StyleSheet.create({
  fullNameContainer: {
    marginBottom: 40
  },
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