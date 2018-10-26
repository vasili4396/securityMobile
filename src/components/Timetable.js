import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import apiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import asyncStorage from '../storage/asyncStorage'
import moment from 'moment'
import GestureRecognizer from 'react-native-swipe-gestures'
import {createStackNavigator} from 'react-navigation'
import WorkerDay from './WorkerDay';

class Timetable extends React.Component {
  constructor(props) {
    super(props)
    this.renderDays.bind(this)
    this.state = {
      workerDays: [],
      userId: null,
      currentDate: moment().subtract(3, 'months').startOf('month'),
      months: {
        0: 'Январь',
        1: 'Февраль',
        2: 'Март',
        3: 'Апрель',
        4: 'Май',
        5: 'Июнь',
        6: 'Июль',
        7: 'Август',
        8: 'Сентябрь',
        9: 'Октябрь',
        10: 'Ноябрь',
        11: 'Декабрь',
      },
      workTypes: {
        'W': 'Работает',
        'H': 'В',
        'V': 'От.',
        'A': 'Отсут.'
      }
    }
  }

  componentDidMount () {
    asyncStorage.getItem('user').then(userInfo => {
      let uid = userInfo.id
      let shopId = userInfo.shop_id
      this.getCashierTimetable(uid, shopId)
      this.setState({userId: uid, shopId: shopId})
    })
  }

  computeExtremeDates () {
    let currentDate = moment(this.state.currentDate)
    let currentMonthStartingWeekday = (moment(currentDate).weekday() + 6) % 7
    let currentMonthEndingWeekday = (moment(currentDate).endOf('month').weekday() + 6) % 7
    let mondayOfPrevMonth = null
    let sundayOfNextMonth = null
    
    if (currentMonthStartingWeekday > 0) {
      mondayOfPrevMonth = moment(currentDate).subtract(currentMonthStartingWeekday, 'days')
    }
    if (currentMonthEndingWeekday < 6) {
      sundayOfNextMonth = moment(currentDate).endOf('month').add(7 - currentMonthEndingWeekday - 1, 'days')
    }
    let fromDate = mondayOfPrevMonth === null ? currentDate : mondayOfPrevMonth
    let toDate = sundayOfNextMonth === null ? currentDate.endOf('month') : sundayOfNextMonth

    return [fromDate, toDate]
  }

  getCashierTimetable = (userId, shopId) => {
    let extremeDates = this.computeExtremeDates()
    apiUtils.sendRequest(URLS.url.getWorkerTimetable, 'GET', {
      worker_id: JSON.stringify([userId]),
      shop_id: shopId,
      format: 'raw',
      from_dt: extremeDates[0].format(dateFormat),
      to_dt: extremeDates[1].format(dateFormat)
    })
      .then(res => res.data[userId].days)
      .then(res => {
        this.setState({workerDays: res})
      })
      .catch(err => {
        if (err.code === 401) {
          this.props.navigation.navigate('Auth')
        } else {
          alert(err)
        }
      })
  }

  renderWeekDays () {
    let weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    return weekdays.map((day) => {
      return (
        <Text key={day} style={styles.calendar_weekdays_text}>{day}</Text>
      )
    })
  }

  renderDays () {
    let arrayOfDays = []
    let extremeDates = this.computeExtremeDates()
    let fromDate = extremeDates[0]
    let toDate = extremeDates[1]
    let workerDays = this.state.workerDays
    let isExistWorkerDay = null
    
    let differenceInDays = Math.floor(moment.duration(toDate.diff(fromDate.subtract(1, 'days'))).asDays())

    for (let i = 0; i < differenceInDays; i++) {

      let weekDay = Math.floor(i / 7)
      if (i % 7 === 0) {
        arrayOfDays.push([])
      }
      let dayInCalendar = fromDate.add(1, 'days')
      isExistWorkerDay = workerDays.find(oneDay => oneDay.day.dt === dayInCalendar.format(dateFormat))
      if (isExistWorkerDay) {
        let type = isExistWorkerDay.day.type
        if (type === 'W') {
          /*
            [Год, Месяц, День, Время Начала(либо тип , если выходной/отпуск), Время конца (либо ничего)]
          */
          arrayOfDays[weekDay].push([
            dayInCalendar.format('YYYY'),
            dayInCalendar.format('MM'),
            dayInCalendar.format('D'),
            isExistWorkerDay.day.dttm_work_start.slice(0, -3),
            isExistWorkerDay.day.dttm_work_end.slice(0, -3),
          ])
        } else {
          arrayOfDays[weekDay].push([
            dayInCalendar.format('YYYY'),
            dayInCalendar.format('MM'),
            dayInCalendar.format('D'),
            this.state.workTypes[type]
          ])
        }
      } else {
        arrayOfDays[weekDay].push([
          dayInCalendar.format('YYYY'),
          dayInCalendar.format('MM'),
          dayInCalendar.format('D'),
          '-'
        ])
      }
    }
    
    return arrayOfDays.map((week, i) => {
      return (
        <View style={{ flexDirection: 'row' }} key={i}>
          {
            week.map((day, j) => {
              return (
                <TouchableOpacity
                  style={styles.day}
                  key={j}
                  onPress={() => this._getWorkerDay(day)}
                >
                  <Text style={styles.day_text}>
                    {day[2]}{'\n'}
                    {day[3]}{'\n'}
                    {day[4]}
                  </Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    })
  }

  _getWorkerDay (day) {
    if (day[3] !== '-') {
      this.props.navigation.navigate('detailsPage', {
        date: [day[2], day[1], day[0]].join('.')
      })
    }
  }

  _onSwipeRight () {
    let prevMonth = this.state.currentDate.subtract(1, 'month')
    this.setState({currentDate: prevMonth})
    this.renderDays()
    this.getCashierTimetable(this.state.userId, this.state.shopId)
  }

  _onSwipeLeft () {
    let nextMonth = this.state.currentDate.add(1, 'month')
    this.setState({currentDate: nextMonth})
    this.renderDays()
    this.getCashierTimetable(this.state.userId, this.state.shopId)
  }

  render () {
    const state = this.state

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    }

    return (
      <GestureRecognizer
        onSwipeLeft={() => this._onSwipeLeft()}
        onSwipeRight={() => this._onSwipeRight()}
        config={config}
        style={{flex: 1}}
      >
      <View>

        <View style={styles.header}>
          <View style={styles.header_item}>
            <Text style={[styles.header_text, styles.text_center, styles.bold_text]}>Календарь</Text>
          </View>
        </View>

        <View>
          <View style={styles.calendar_header}>
            <View style={[styles.calendar_header_item]}>
              <Text 
                style={styles.calendar_header_text}
              >
                {state.months[state.currentDate.month()]}, {state.currentDate.year()}
              </Text>
            </View>
          </View>

          <View style={styles.calendar_weekdays}>
            {this.renderWeekDays()}
          </View>

          <View style={styles.calendar_days}>
            {this.renderDays()}
          </View>
        </View>
        
      </View>
      </GestureRecognizer>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#329BCB',
    flexDirection: 'row',
    padding: 30
  },
  header_item: {
    flex: 1
  },
  text_center: {
    textAlign: 'center'
  },
  text_right: {
    textAlign: 'right'
  },
  header_text: {
    color: '#fff',
    fontSize: 20
  },
  bold_text: {
    fontWeight: 'bold'
  },
  calendar_header: {
    flexDirection: 'row'
  },
  calendar_header_item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  calendar_header_text: {
    fontWeight: 'bold',
    fontSize: 20
  },
  calendar_weekdays: {
    flexDirection: 'row'
  },
  calendar_weekdays_text: {
    flex: 1,
    color: '#C0C0C0',
    textAlign: 'center'
  },
  day: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 3,
    height: 80,
    margin: 1,
    paddingTop: 20
  },
  day_text: {
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: 12
  }
})

export default timetableStackNavigator = createStackNavigator(
  {
    timetablePage: {
      screen: Timetable,
      navigationOptions: {
        header: null
      }
    }, 
    detailsPage: {
      screen: WorkerDay,
      navigationOptions: {
        title: 'Пожелания'
      }
    },
    initialRouteName: 'detailsPage'
  }
)