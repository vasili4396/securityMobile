import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'
import Button from './Button'
import ApiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import Icon from 'react-native-vector-icons/MaterialIcons'
import TextInputForm from './TextInputForm'
import Result from './Result'
import Example from './Example'

function renderIfElse(condition, trueContent, falseContent) {
  if (condition) {
    return trueContent
  } else {
    return falseContent
  }
}

export default class SixthTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      res: {},
      n: '',
      e: '',
      m: ''
    }
  }

  getAnswer () {
    ApiUtils.sendRequest(URLS.sixthTask, 'get', {
      n: Number(this.state.n),
      e: Number(this.state.e),
      m: Number(this.state.m)
    })
      .then(response => {
        this.setState({res: response.data })
      })
  }

  _openSideMenu () {
    this.props.navigation.openDrawer()
  }

  render () {
    const state = this.state
    let answers = ''
    if (state.res.hasOwnProperty('ans')) {
      answers = state.res.ans.split(',')
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>RSA(подпись)</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <Example exampleText='Подписать сообщение по схеме RSA. Открытый ключ: n = 253; e = 119. Сообщение: m = 193.' >
            </Example>
            <View style={styles.textInputContainer}>
              <View style={{marginBottom: 10}}>
                <Text>Введите открытый ключ</Text>
                <TextInputForm
                  placeholder='n'
                  onChangeText={ (n) => this.setState({n})}
                  placeholderTextColor='#000'
                  borderBottomColor='#000'
                />
                <TextInputForm
                  placeholder='е'
                  onChangeText={ (e) => this.setState({e})}
                  placeholderTextColor='#000'
                  borderBottomColor='#000'
                />
              </View>
              <Text>Введите сообщение</Text>
              <TextInputForm
                placeholder='m'
                onChangeText={ (m) => this.setState({m})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
            </View>

            <View style={styles.button}>
						  <Button buttonText='Решить задачу' onPress={() => this.getAnswer()} color='#000'/>
					  </View>

            <View style={{flex: 2, marginBottom: 10}}>
              {renderIfElse(
                state.res.hasOwnProperty('ans'), 
                <View>
                  <Result results={answers} between={state.res.between} />
                </View>
                ,
                null
              )}
            </View>
            
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: primaryColor,
    padding: 20,
    flex: 1,
    flexDirection: 'row'
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14
  },
  bodyContainer: {
    flex: 19
  },
  textInputContainer: {
		flex: 10,
		marginHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 30
  },
  button: {
		justifyContent: 'center',
		flex: 4,
		marginHorizontal: 20
	},
})
