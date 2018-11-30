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
      l: '',
      p: ''
    }
  }

  getAnswer () {
    let lList = this.state.l.split(' ').join('').split(',').map(Number)
    
    ApiUtils.sendRequest(URLS.secondTask, 'get', {
      l: JSON.stringify(lList),
      p: Number(this.state.p)
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
            <Text style={styles.headerText}>КСГПСЧ и потоковые шифры</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <Example exampleText='Привести следующие два элемента последовательности, сформированной линейным конгруэнтным
                          методом, если предыдущие 3 элемента последовательности такие: 348, 65, 139, а все вычисления выполняются
                          в поле F499.' >
            </Example>
            <View style={styles.textInputContainer}>
              <Text>Введите первые 3 элемента последовательности через запятую</Text>
              <TextInputForm
                placeholder='Например: 219, 12, 102'
                onChangeText={ (l) => this.setState({l})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <Text style={{paddingTop: 20}}>Введите основание поля</Text>
              <TextInputForm
                placeholder='Например: 499'
                onChangeText={ (p) => this.setState({p})}
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
