import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
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

export default class FirstTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      res: {},
      x1: '',
      x2: '',
      z1: '',
      z2: ''
    }
  }

  parseToNumber (fraction) {
    let parts = fraction.replace(' ', '').split('/')
    return parts[0] / parts[1]
  }

  getAnswer () {
    if (typeof(this.state.x1) === 'string') this.state.x1 = this.parseToNumber(this.state.x1)
    if (typeof(this.state.x2) === 'string') this.state.x2 = this.parseToNumber(this.state.x2)
    if (typeof(this.state.z1) === 'string') this.state.z1 = this.parseToNumber(this.state.z1)
    if (typeof(this.state.z2) === 'string') this.state.z2 = this.parseToNumber(this.state.z2)

    ApiUtils.sendRequest(URLS.firstTask, 'get', {
      x1: Math.round(this.state.x1 * 100) / 100,
      x2: Math.round(this.state.x2 * 100) / 100,
      z1: Math.round(this.state.z1 * 100) / 100,
      z2: Math.round(this.state.z2 * 100) / 100
    })
      .then(response => {
        console.log(response)
        this.setState({res: response.data })
      })
  }

  _openSideMenu () {
    this.props.navigation.openDrawer()
  }

  render () {
    const state = this.state
    let answers = ''

    function parseAnswers (answers) {
      let res = []
      for (result of answers) {
        res.push(
          <Text>{result + ', '}</Text>
        )
      }
      return res
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>Источники открытого текста</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <Example exampleText='Источник открытого текста характеризуется случайной величиной X, принимающей два значения
                                  x1 и x2 с вероятностями p (x = x1) = 1/5 и p (x = x2) = 4/5 соответственно. Источник ключей характеризуется
                                  случайной величиной Z, независимой от величины X, принимающей два значения z1 и z2 с вероятностями
                                  p (z = z1) = 1/6 и p (z = z2) = 5/6 соответственно. Функция шифрования Ez (x) задаётся следующими прави-
                                  лами: (x1, z1) → y1, (x1, z2) → y2, (x2, z1) → y2, (x2, z2) → y1.'/>

            <Text><Text style={{fontWeight: 'bold'}}>1.</Text> Найдите собственную информацию каждого из сообщений открытого текста в битах.</Text>
            <Text><Text style={{fontWeight: 'bold'}}>2.</Text> Найдите энтропию источника сообщений, источника ключей и шифротекста в битах.</Text>
            <Text><Text style={{fontWeight: 'bold'}}>3.</Text> Найдите взаимную информацию открытого текста и ключа в битах.</Text>
            <Text><Text style={{fontWeight: 'bold'}}>4.</Text> Найдите взаимную информацию открытого текста и шифротекста в битах.</Text>
            <Text><Text style={{fontWeight: 'bold'}}>5.</Text> Найдите взаимную информацию ключа и шифротекста в битах.</Text>
            <Text style={{marginBottom: 10}}>
              <Text style={{fontWeight: 'bold'}}>6.</Text>
              Найдите апостериорное распределение вероятностей открытого текста для обоих вариантов перехваченных злоумышленником шифротекстов y1 и y2.
            </Text>
            <View style={styles.textInputContainer}>
              <Text>Введите исходные параметры</Text>
              <TextInputForm
                placeholder='p(x = x1)'
                onChangeText={ (x1) => this.setState({x1})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <TextInputForm
                placeholder='p(x = x2)'
                onChangeText={ (x2) => this.setState({x2})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <TextInputForm
                placeholder='p(z = z1)'
                onChangeText={ (z1) => this.setState({z1})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <TextInputForm
                placeholder='p(z = z2)'
                onChangeText={ (z2) => this.setState({z2})}
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
                  <Result results={state.res.ans} between={state.res.between} />
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
