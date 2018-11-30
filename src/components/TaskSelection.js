import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'
import Example from './Example'
import Result from './Result'
import ApiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import TextInputForm from './TextInputForm'
import Modal from 'react-native-modal'

function renderIfElse(condition, trueContent, falseContent) {
  if (condition) {
    return trueContent
  } else {
    return falseContent
  }
}

export default class TaskSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1,//this.props.navigation.state.params.a,
      b: 2,//this.props.navigation.state.params.b,
      q: 47,//this.props.navigation.state.params.q
      x: '',
      y: '',
      n: '',
      taskID: '',
      modal1Visisble: false,
      modal2Visisble: false,
      modal3Visisble: false,
      answer: ''
    }
  }

  closeModals () {
    this.setState({
      modal1Visisble: false,
      modal2Visisble: false,
      modal3Visisble: false,
      taskID: ''
    })
  }

  clearValues () {
    this.setState({
      x: '',
      y: '',
      n: ''
    })
  }

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  )

  solve () {
    const state = this.state
    if (state.taskID === 1 && !state.n) {
      Alert.alert('', 'Введите n')
      this.clearValues()
      return null
    } 
    ApiUtils.sendRequest(URLS.solveEliptic, 'get', {
      x: state.x,
      y: state.y,
      n: state.n,
      task_id: state.taskID,
      a: state.a,
      b: state.b,
      q: state.q,
      answer: ''
    })
      .then(res => {
        this.setState({answer: res.data})
      })
      .catch(err => {
        console.log(err)
      })
  }

  renderModalContent = (text, placeholderText) => (
    <View style={styles.modalContent}>
      <View>
        <Text style={{ fontSize: 20 }}>{text}</Text>
      </View>
      <TextInputForm
        placeholder={placeholderText}
        onChangeText={ (l) => this.setState({ x: l.split(',').map(Number)[0], y: l.split(',').map(Number)[1], n: l.split(',').map(Number)[2]}) }
        placeholderTextColor='#000'
        borderBottomColor='#000'
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        {this.renderButton("Закрыть", () => { this.closeModals(); this.clearValues() } )}
        {this.renderButton("Решить", () => {
            this.closeModals()
            this.solve()
          }
        )}
      </View>
    </View>
  )


  render () {
    let equation = `y^2 = x^3 + ${this.state.a} * x + ${this.state.b}`

    function severalResults (results) {
      let res = []
      for (result of results) {
        res.push(
          <Text>{result + ', '}</Text>
        )
      }
      return res
    }

    return (
      <ScrollView>
        <View style={{flex: 2, marginBottom: 10}}>
          {renderIfElse(
            this.state.answer,
            <View style={{alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold'}}>Ответ</Text>
              {severalResults(this.state.answer)}
              {/* <Text>{this.state.answer}</Text> */}
            </View>
            ,
            null
          )}
        </View>

        <View style={{flex: 1}}>

          <View style={styles.paramsContainer}>
            <View>
              <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                Параметры для элиптической кривой
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <Text style={{ fontSize: 16, fontWeight: 'bold'}}>a = {this.state.a}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold'}}>b = {this.state.b}</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold'}}>q = {this.state.q}</Text>
            </View>
          </View>

          <View style={styles.bodyContainer}>
            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              Выберите задачу для решения
            </Text>
            <TouchableOpacity style={styles.taskContainer} onPress={() => this.setState({taskID: 1, modal1Visisble: true})}>
              <View style={styles.examplesArea}>
                <Example exampleText={
                    'Для точки A (x; y) принадлежащей группе точек эллиптической кривой ' + equation + ' над конечным полем найти координаты точек B = n × A.'
                }/>
            
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskContainer} onPress={() => this.setState({taskID: 2, modal2Visisble: true})}>
              <View style={styles.examplesArea}>
                <Example exampleText={
                  'Найти группу точек (перечислить все точки) эллиптической кривой ' + equation + ` над конечным полем F${this.state.q}. Для точки (x; y) определить, является ли она генератором всей группы точек, либо подгруппы. Перечислить точки генерируемой подгруппы (группы).`
                 } />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskContainer} onPress={() => this.setState({taskID: 2, modal3Visisble: true})}>
              <View style={styles.examplesArea}>
                <Example exampleText={
                  'Сгенерировать подгруппу точек эллиптической кривой ' + equation + ` над конечным полем F${this.state.q} по точке (x; y).`
                 } />
            
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={this.state.modal1Visisble}
          onBackdropPress={() => this.closeModals()}
          animationIn="slideInUp"
        >
          <View>
            {this.renderModalContent('Введите x, y, n', 'x, y, n')}
          </View>
        </Modal>
        <Modal
          isVisible={this.state.modal2Visisble}
          onBackdropPress={() => this.closeModals()}
          animationIn="slideInUp"
        >
          <View>
            {this.renderModalContent('Введите x, y', 'x, y')}
          </View>
        </Modal>
        <Modal
          isVisible={this.state.modal3Visisble}
          onBackdropPress={() => this.closeModals()}
          animationIn="slideInUp"
        >
          <View>
            {this.renderModalContent('Введите x, y', 'x, y')}
          </View>
        </Modal>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  paramsContainer: { flex: 5},
  bodyContainer: { flex: 20 },
  taskContainer: {
    borderColor: '#000',
    borderWidth: 2,
    marginHorizontal: 15,
    backgroundColor: primaryColor,
    borderRadius: 20,
    marginBottom: 5
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
})