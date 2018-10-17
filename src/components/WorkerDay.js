import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native'
import URLS from '../network/urls'
import apiUtils from '../network/apiUtils'
import asyncStorage from '../storage/asyncStorage'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from 'react-native-modal-datetime-picker'
// import Modal from 'react-native-modal'
import HideableView from '../ui-components/HideableView'

export default class WorkerDay extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '5.07.2018',//this.props.navigation.state.params.date,
      selectedWorkType: null,
      workStartTime: null,
      workEndTime: null,
      isModalVisible: false,
      isStartTimePickerVisible: false,
      isEndTimePickerVisible: false,
      wishText: '',
      weekdays: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
      ],
      workTypes: {
        'W': 'Рабочий',
        'H': 'Выходной',
        'V': 'Отпуск',
        'A': 'Отсутутствовал'
      },
      workerDay: null
    }
    asyncStorage.getItem('user').then(userInfo => {
      this.getWorkerDay(userInfo.id)
    })
  }

  getWorkerDay = (userId) => {
    apiUtils.sendRequest(URLS.url.getWorkerDay, 'GET', {
      worker_id: userId,
      dt: this.state.date,
    })
      .then(response => response.data)
      .then(response => {
        this.setState({
          workerDay: response,
          selectedWorkType: response.day.type,
          workStartTime: response.day.dttm_work_start,
          workEndTime: response.day.dttm_work_end
        })
      })
      .catch(err => {
        if (err.code === 401) {
          this.props.navigation.navigate('Auth')
        } else if (err.code === 400) {
          alert('Извините, такого дня в расписании нет.')
          this.props.navigation.goBack()
        } else {
          alert(err)
        }
      })
  }

  _prevWorkType () {
    let types = this.state.workTypes
    let typesLentgh = Object.keys(types).length
    let currentIndex = Object.keys(types).indexOf(this.state.selectedWorkType)
    this.setState({selectedWorkType: Object.keys(types)[(currentIndex + typesLentgh - 1) % typesLentgh]})
  }

  _nextWorkType () {
    let types = this.state.workTypes
    let currentIndex = Object.keys(types).indexOf(this.state.selectedWorkType)
    this.setState({selectedWorkType: Object.keys(types)[(currentIndex + 1) % Object.keys(types).length]})
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

  _showStartTimePicker = () => this.setState({ isStartTimePickerVisible: true })

  _hideStartTimePicker = () => this.setState({ isStartTimePickerVisible: false })

  _handleStartTimePicked = (time) => {
    this._hideStartTimePicker();
  }

  _showEndTimePicker = () => this.setState({ isEndTimePickerVisible: true })

  _hideEndTimePicker = () => this.setState({ isEndTimePickerVisible: false })

  _handleEndTimePicked = (time) => {
    this._hideEndTimePicker();
  }

  render () {
    const state = this.state
    let weekdayNum = (moment(state.date, 'D.MM.YYYY').weekday() + 6) % 7

    if (state.workerDay) {
      let todayDate = moment()
      let workStartTime = moment(state.workStartTime, 'HH:mm:ss')
      let workEndTime = moment(state.workEndTime, 'HH:mm:ss')
      let workStartDateTime = new Date(
        todayDate.year(),
        todayDate.month(),
        todayDate.day(),
        workStartTime.hour(),
        workStartTime.minute()
      )
      let workEndDateTime = new Date(
        todayDate.year(),
        todayDate.month(),
        todayDate.day(),
        workEndTime.hour(),
        workEndTime.minute()
      )

      return (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Text style={{fontSize: 20}}>{state.date}, {state.weekdays[weekdayNum]}</Text>
          </View>
  
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{fontSize: 14}}>Статус дня</Text>
          </View>
            
          <View style={styles.workDayType}>
            <View style={styles.leftButtonContainer}>
              <Icon.Button
                name='chevron-left'
                size={30}
                backgroundColor='#6bbf5f'
                borderRadius={0}
                onPress={() => this._prevWorkType()}
              >
              </Icon.Button>
            </View>

            <Text style={styles.workDayTypeText}>{state.workTypes[state.selectedWorkType]}</Text>

            <View style={styles.rightButtonContainer}>
              <Icon.Button
                name='chevron-right'
                size={30}
                backgroundColor='#6bbf5f'
                borderRadius={0}
                onPress={() => this._nextWorkType()}
              >
              </Icon.Button>
            </View>
          </View>

          <View style={styles.tipStyle}>
            <Text style={styles.tipStyleText}>Нажмите на стрелочку, чтобы изменить</Text>
          </View>

          <View style={styles.personalPreferences}>
            <TextInput
							// style={styles.textInput}
							placeholder='Введите текст пожаления'
							onChangeText={ (wishText) => this.setState({wishText})}
							// underlineColorAndroid='transparent'
						/>
          </View>

          {/* <View>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text style={{padding: 50}}>Show Modal</Text>
            </TouchableOpacity>
            <Modal
              isVisible={this.state.selectedWorkType === 'W'}
              backdropOpacity={0}
              animationInTiming={700} // в миллисекундах
              // onBackdropPress={() => this.setState({ isModalVisible: false })}
            > */}

          <HideableView 
            style={styles.preferencesContainer}
            hide={this.state.selectedWorkType !== 'W'}
          >
            <View style={styles.timesContainer}>
              <TouchableOpacity onPress={this._showStartTimePicker}>
                <Text style={{fontSize: 14}}>Время начала</Text>
                <Text style={styles.timePreferences}>{state.workStartTime.slice(0, -3)}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isStartTimePickerVisible}
                onConfirm={this._handleStartTimePicked}
                onCancel={this._hideStartTimePicker}      
                mode='time'
                date={workStartDateTime}
                titleIOS='Выберите время'
                confirmTextIOS='Подтвердить'
                cancelTextIOS='Отменить'
              />

              <TouchableOpacity onPress={this._showEndTimePicker}>
                <Text style={{fontSize: 14}}>Время окончания</Text>
                <Text style={styles.timePreferences}>{state.workEndTime.slice(0, -3)}</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isEndTimePickerVisible}
                onConfirm={this._handleEndTimePicked}
                onCancel={this._hideEndTimePicker}
                date={workEndDateTime}
                mode='time'
                titleIOS='Выберите время'
                confirmTextIOS='Подтвердить'
                cancelTextIOS='Отменить'
              />
            </View>
          </HideableView>
          {/* </View>
          </Modal> */}
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    padding: 10
  },
  workDayType: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  workDayTypeText: {
    paddingTop: 5,
    fontSize: 30
  },
  leftButtonContainer: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  rightButtonContainer: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  tipStyle: {
    alignItems: 'center'
  },
  tipStyleText: {
    fontSize: 12,
    color: '#505050'
  },
  preferencesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    padding: 20,
    borderColor: '#151515'
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  timePreferences: {
    fontSize: 30,
    textDecorationLine: 'underline'
  },
  personalPreferences: {

  }

})