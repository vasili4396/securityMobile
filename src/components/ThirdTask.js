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

export default class SecondTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      res: {},
      l: ''
    }
  }

  getAnswer () {
    let lList = this.state.l.split(' ').join('').split(',').map(Number)
    if (!this.isArrayBool(lList)) Alert.alert('Ошибка', 'Массив может состоять только из 0 и 1')
    ApiUtils.sendRequest(URLS.thirdTask, 'get', {
      par: JSON.stringify(lList)
    })
      .then(response => {
        this.setState({res: response.data })
      })
  }

  isArrayBool(array) {
    for (var i of array) {
      if (i !== 0 && i !== 1) return false
    }
    return true
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
            <Text style={styles.headerText}>Потоковые шифры</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <Example exampleText='Укажите характеристический полином и приведите следующие 5 бит выхода генератора псевдо-
                                  случайной последовательности, основанного на регистре сдвига с линейной обратной связью, если известно,
                                  что степень характеристического полинома регистра – m (x) – равна 5, а предыдущая последовательность такова: 
                                  0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1. Порядок бит в последовательности соответствует порядку их генерации РСЛОС.' >
            </Example>
            <View style={styles.textInputContainer}>
              <Text>Введите известную последовательность</Text>
              <TextInputForm
                placeholder='Например: 0,1,0,0,1,1,0,0,0,0,1'
                onChangeText={ (l) => this.setState({l})}
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
