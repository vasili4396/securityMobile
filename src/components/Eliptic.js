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
import Icon from 'react-native-vector-icons/MaterialIcons'
import TextInputForm from './TextInputForm'
import TaskSelection from './TaskSelection'
import {createStackNavigator} from 'react-navigation'

class ElipticSetParams extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '',
      b: '',
      q: ''
    }
  }

  isAbleToContinue () {
    if (this.state.a && this.state.b && this.state.q) {
      this.props.navigation.navigate('taskSelectionPage', {
        a: this.state.a,
        b: this.state.b,
        q: this.state.q
      })
    } else {
      Alert.alert('Ошибка', 'Неправильно указаны входные данные.')
    }
  }

  _openSideMenu () {
    this.props.navigation.openDrawer()
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>Эллиптические кривые</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.generalView}>
              <Text style={styles.generalViewText}>В общем случае уравнение эллиптической кривой имеет вид: 
                <Text style={[styles.generalViewText, {fontWeight: 'bold'}]}> y^2 = x^3 + a*x + b</Text>
              </Text>
              <Text style={styles.generalViewText}>Также для задачи необходимо основание поля, по которому идут вычисления</Text>
            </View>
            
            <View style={styles.textInputContainer}>
              <Text style={{ fontWeight: 'bold' }}>Введите a и b</Text>
              <TextInputForm
                placeholder='a, b (через запятую)'
                onChangeText={ (l) => this.setState({ a: l.split(',').map(Number)[0], b: l.split(',').map(Number)[1] }) }
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
              <Text style={{paddingTop: 20, fontWeight: 'bold' }}>Введите основание поля</Text>
              <TextInputForm
                placeholder='Целое простое число'
                onChangeText={ (q) => this.setState({q})}
                placeholderTextColor='#000'
                borderBottomColor='#000'
              />
            </View>

            <View style={styles.button}>
						  <Button buttonText='Продолжить' onPress={() => this.isAbleToContinue()} color='#000'/>
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
  generalView: {
    marginHorizontal: 20
  },
  generalViewText: {
    fontSize: 16
  },
  textInputContainer: {
    flex: 10,
    marginTop: 10,
		marginHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 30
  },
  button: {
    flex: 10,
		marginHorizontal: 20
	},
})

export default elipticStackNavigator = createStackNavigator(
  {
    taskSelectionPage: {
      screen: TaskSelection,
      navigationOptions: {
        title: 'Выберите задачу'
      }
    },
    setParamsPage: {
      screen: ElipticSetParams,
      navigationOptions: {
        header: null
      }
    },
    initialRouteName: 'setParamsPage'
  }
)