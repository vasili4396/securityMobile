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

export default class FourthTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      res: {},
      l: '',
      n: ''
    }
  }

  getAnswer () {
    let lList = this.state.l.split(' ').join('').split(',').map(Number)
    
    ApiUtils.sendRequest(URLS.url.fourthTask, 'GET', {
      l: JSON.stringify(lList),
      n: Number(this.state.n)
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
    // if (state.res.hasOwnProperty('ans')) {
    //   for (ans in state.res.ans) {
    //     console.log(ans)
    //   }
    // } 
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>Псевдопростые числа</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <Example exampleText='Проверить, являются ли числа 74, 448, 640, 660, 719 свидетелями простоты числа 793 по Миллеру.'/>
            
            <View style={styles.textInputContainer}>
              <Text>Введите числа, которые проверить</Text>
              <TextInputForm
                placeholder='Например: 74, 448, 640, 660, 719'
                onChangeText={ (l) => this.setState({l})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <Text style={{paddingTop: 20}}>Введите само число</Text>
              <TextInputForm
                placeholder='Например: 793'
                onChangeText={ (n) => this.setState({n})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
            </View>

            <View style={styles.button}>
						  <Button buttonText='Решить задачу' onPress={() => this.getAnswer()} color='#000'/>
					  </View>

            <View style={{flex: 2}}>
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
