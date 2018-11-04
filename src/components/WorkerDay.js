import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native'
import URLS from '../network/urls'
import apiUtils from '../network/apiUtils'
import asyncStorage from '../storage/asyncStorage'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from 'react-native-modal-datetime-picker'
import HideableView from '../ui-components/HideableView'

function renderIfElse(condition, trueContent, falseContent) {
  if (condition) {
    return trueContent
  } else {
    return falseContent
  }
}

export default class WorkerDay extends React.Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      date: this.props.navigation.state.params.date,
      userId: null,
      initialWorkType: 'H',
      selectedWorkType: 'H',
      initialWorkStartTime: null,
      workStartTime: null,
      initialWorkEndTime: null,
      workEndTime: null,
      isStartTimePickerVifsible: false,
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
        'A': 'Отсутствие'
      },
      workerDay: null,
      changeRequest: null
    }
  }

  componentDidMount () {
    // this._isMounted = true

    asyncStorage.getItem('user').then(userInfo => {
      this.setState({userId: userInfo.id})
      this.getWorkerDayInfo(userInfo.id)
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  getWorkerDayInfo = (userId) => {
    let requestGetParams = {
      worker_id: userId,
      dt: this.state.date
    }

    apiUtils.sendRequest(URLS.url.getWorkerDay, 'GET', requestGetParams)
      .then(response => response.data)
      .then(response => {
        this.setState({
          workerDay: response,
          initialWorkType: response.day.type,
          initialWorkStartTime: response.day.dttm_work_start,
          initialWorkEndTime: response.day.dttm_work_end,
          selectedWorkType: response.day.type,
          workStartTime: response.day.dttm_work_start,
          workEndTime: response.day.dttm_work_end
        })
      })
      .catch(err => {
        if (err.code === 401) {
          this.props.navigation.navigate('Auth')
        } else if (err.code === 400) {
          this.setState({ workerDay: Object })
        } 
        else {
          alert(err)
        }
      })

    apiUtils.sendRequest(URLS.url.getChangeRequest, 'GET', requestGetParams)
      .then(response => {
        this.setState({ changeRequest: response.data })
      })
      .catch(err => {
        alert(err)
      })
    this._isMounted = true
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

  _showStartTimePicker = () => this.setState({ isStartTimePickerVisible: true })

  _hideStartTimePicker = () => this.setState({ isStartTimePickerVisible: false })

  _handleStartTimePicked = (time) => {
    this.setState({ workStartTime: moment(time, timeFormat).format(timeFormat) })
    this._hideStartTimePicker()
  }

  _showEndTimePicker = () => this.setState({ isEndTimePickerVisible: true })

  _hideEndTimePicker = () => this.setState({ isEndTimePickerVisible: false })

  _handleEndTimePicked = (time) => {
    this.setState({ workEndTime: moment(time, timeFormat).format(timeFormat) })
    this._hideEndTimePicker()
  }

  _trySaveNewWorkerDay = () => {
    const state = this.state
    if (state.workerDay.hasOwnProperty('day') && state.initialWorkType === state.selectedWorkType && state.initialWorkStartTime === state.workStartTime && state.initialWorkEndTime === state.workEndTime) {
      Alert.alert('Ошибка', 'Извините, но вы еще ничего не поменяли.')
      return
    }
    Alert.alert(
      '',
      'Вы действительно хотите сохранить изменения?',
      [
        {text: 'Отменить'},
        {text: 'Да', onPress: () => this._saveWorkerDay()},
      ]
    )
  }

  _saveWorkerDay = () => {
    let workType = this.state.selectedWorkType
    
    apiUtils.sendRequest(URLS.url.requestWorkerDay, 'POST', {
      worker_id: this.state.userId,
      dt: this.state.date,
      type: workType,
      tm_work_start: workType === 'W' ? this.state.workStartTime : null,
      tm_work_end: workType === 'W' ? this.state.workEndTime: null,
      wish_text: this.state.wishText
    })
      .then(() => {
        Alert.alert('', 'Запрос на изменение рабочего дня успешно отправлен менеджеру.')
      })
      .catch(err => {
        alert(err)
      })
  }

  render () {
    const state = this.state
    let weekdayNum = (moment(state.date, 'D.M.YYYY').weekday() + 6) % 7
    
    let todayDate = moment()
    
    let workStartTime = moment(state.workStartTime, timeFormat)
    let workEndTime = moment(state.workEndTime, timeFormat)
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
    if (this._isMounted) {
      return (
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{moment(state.date, 'D.M.YYYY').format('D.MM.YYYY')}, {state.weekdays[weekdayNum]}</Text>
          </View>
  
          <View style={styles.dayStatusTextContainer}>
            <Text style={{fontSize: 14}}>Статус дня</Text>
          </View>
  
          <View style={styles.workDayTypeContainer}>
            <View style={styles.workDayTypeRow}>
              <View style={styles.leftButtonContainer}>
                <Icon.Button
                  name='chevron-left'
                  size={30}
                  backgroundColor={primaryColor}
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
                  backgroundColor={primaryColor}
                  borderRadius={0}
                  onPress={() => this._nextWorkType()}
                >
                </Icon.Button>
              </View>
            </View>
          </View>
  
          <View style={styles.tipStyleContainer}>
            <Text style={styles.tipStyleText}>Нажмите на стрелочку, чтобы изменить</Text>
          </View>
  
          <View style={styles.personalPreferencesContainer}>
            <TextInput
              style={styles.personalPreferencesInput}
              placeholder='Введите текст пожелания'
              placeholderTextColor={tipColor}
              returnKeyType='none'
              underlineColorAndroid='transparent'
              onChangeText={ (wishText) => this.setState({wishText})}
            />
          </View>
  
          <View style={styles.timePreferencesContainer}>
            <HideableView 
              style={styles.hideableViewContainer}
              hide={state.selectedWorkType !== 'W'}
            >
              <View style={styles.timesContainer}>
                <TouchableOpacity onPress={this._showStartTimePicker}>
                  <Text style={{fontSize: 14}}>Время начала</Text>
                  <Text style={styles.timePreferences}>
                    {state.workStartTime ? state.workStartTime.slice(0, -3): 'Не задано'}
                  </Text>
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={state.isStartTimePickerVisible}
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
                  <Text style={styles.timePreferences}>
                    {state.workEndTime ? state.workEndTime.slice(0, -3): 'Не задано'}
                  </Text>
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={state.isEndTimePickerVisible}
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
          </View>
{/*   
          <View style={styles.changeRequestContainer}>
            {
              renderIfElse(
                state.changeRequest && state.changeRequest.hasOwnProperty('status_type'),
                <Text>
                  <Text style={styles.changeRequestText}>Вы уже запрашивал изменение графика на этот день. Статус запроса: </Text>
                  {
                    renderIfElse(
                      state.changeRequest.status_type === 'A',
                      <Text style={[styles.changeRequestText, {color: 'green'}]}>одобрен</Text>,
                      renderIfElse(
                        state.changeRequest.status_type === 'D',
                        <Text style={[styles.changeRequestText, {color: 'red'}]}>не одобрен</Text>,
                        <Text style={[styles.changeRequestText, {color: 'yellow'}]}>на рассмотрении</Text>
                      )
                    )
                  }
                </Text>,
                null
              )
            }
          </View> */}
  
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity onPress={this._trySaveNewWorkerDay} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                Сохранить изменения
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingTop: 10,
    flex: 1
  },
  headerText: {
    fontSize: 20
  },
  dayStatusTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: .7
  },
  workDayTypeContainer: {
    flex: 2,
    justifyContent: 'center'
  },
  workDayTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workDayTypeText: {
    paddingTop: 5,
    fontSize: 30,
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
  tipStyleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: .7
  },
  tipStyleText: {
    fontSize: 12,
    color: tipColor
  },
  personalPreferencesContainer: {
    flex: 2,
    paddingHorizontal: 15
  },
  personalPreferencesInput: {
    fontSize: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000000'
  },
  timePreferencesContainer: {
    flex: 4,
    justifyContent: 'center'
  },
  hideableViewContainer: {
    padding: 15
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  timePreferences: {
    fontSize: 26,
    textDecorationLine: 'underline'
  },
  changeRequestContainer: {
    flex: 4,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  changeRequestText: {
    fontSize: 18
  },
  saveButtonContainer: {
    flex: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignSelf: 'stretch'
  },
  saveButton: {
    height: 60,
    backgroundColor: primaryColor,
    borderRadius: 5
  },
  saveButtonText: {
    fontSize: 20,
    padding: 15,
    alignSelf: 'center',
    color: '#fff'
  }
})