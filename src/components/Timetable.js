import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import apiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import asyncStorage from '../storage/asyncStorage'
import moment from 'moment'
import {createStackNavigator} from 'react-navigation'
import GestureRecognizer from 'react-native-swipe-gestures'
import Icon from 'react-native-vector-icons/MaterialIcons'
import WorkerDay from './WorkerDay'
import {ColoredCalendarView, ColoredCalendarText} from '../ui-components/ColoredCalendar'

function renderIfElse(condition, trueContent, falseContent) {
  if (condition) {
    return trueContent
  } else {
    return falseContent
  }
}

class Timetable extends React.Component {
  constructor(props) {
    super(props)
    this.renderDays.bind(this)
    this.state = {
      workerDays: [],
      userId: null,
      currentDate: moment().startOf('month'),
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

    let differenceInDays = Math.floor(moment.duration(toDate.diff(moment(fromDate).subtract(1, 'days'))).asDays())
    if (differenceInDays < 7 * 6) toDate.add(7 * 6 - differenceInDays, 'days')

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
            dayInCalendar.format('M'),
            dayInCalendar.format('D'),
            isExistWorkerDay.day.dttm_work_start.slice(0, -3),
            isExistWorkerDay.day.dttm_work_end.slice(0, -3)
          ])
        } else {
          arrayOfDays[weekDay].push([
            dayInCalendar.format('YYYY'),
            dayInCalendar.format('M'),
            dayInCalendar.format('D'),
            workTypes[type]
          ])
        }
      } else {
        arrayOfDays[weekDay].push([
          dayInCalendar.format('YYYY'),
          dayInCalendar.format('M'),
          dayInCalendar.format('D'),
          workTypes['E']
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
                  style={styles.calendar_day}
                  key={j}
                  onPress={() => this._getWorkerDay(day)}
                >
                  <View style={styles.calendar_day_date}>
                    <Text
                      style={[
                        String(this.state.currentDate.month() + 1) === day[1] ? { color: '#000' } :  { color: '#A9A9A9' }
                      ]}
                    >
                      {day[2]}
                    </Text>
                  </View>
                  <ColoredCalendarView
                    style={styles.calendar_day_details}
                    type={Object.keys(workTypes).find(key => workTypes[key] === day[3])}
                  >
                    { renderIfElse(
                      day[4],
                      <View>
                        <ColoredCalendarText
                          style={styles.calendar_day_details_text}
                          type={Object.keys(workTypes).find(key => workTypes[key] === day[3])}
                        >
                          {day[3]}
                        </ColoredCalendarText>
                        <ColoredCalendarText
                          style={styles.calendar_day_details_text}
                          type={Object.keys(workTypes).find(key => workTypes[key] === day[3])}
                        >
                          {day[4]}
                        </ColoredCalendarText>
                      </View>,
                      <ColoredCalendarText
                        style={styles.calendar_day_details_text}
                        type={Object.keys(workTypes).find(key => workTypes[key] === day[3])}
                      >
                        {day[3]}
                      </ColoredCalendarText>
                    )}
                  </ColoredCalendarView>                  
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    })
  }

  _getWorkerDay (day) {
    this.props.navigation.navigate('detailsPage', {
      date: [day[2], day[1], day[0]].join('.')
    })
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

  _openSideMenu () {
    this.props.navigation.openDrawer()
  }

  render () {
    const state = this.state

    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>Расписание</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <GestureRecognizer
              onSwipeLeft={() => this._onSwipeLeft()}
              onSwipeRight={() => this._onSwipeRight()}
            >
              <View style={styles.calendar_month}>
                <Text style={styles.calendar_month_text}>
                  {months[state.currentDate.month()]}, {state.currentDate.year()}
                </Text>
                <Text style={{color: tipColor, fontSize: 10}}>
                  Свайпните вправо, либо влево, чтобы изменить месяц.
                </Text>
              </View>
            </GestureRecognizer>

            <View style={styles.calendar_weekdays}>
              {this.renderWeekDays()}
            </View>
        
            <View style={styles.calendar_days}>
              {this.renderDays()}
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
    fontSize: 20
  },
  bodyContainer: {
    flex: 19
  },
  calendar_month: {
    padding: 10,
    alignItems: 'center'
  },
  calendar_month_text: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  calendar_weekdays: {
    flexDirection: 'row'
  },
  calendar_weekdays_text: {
    flex: 1,
    color: '#C0C0C0',
    textAlign: 'center'
  },
  calendar_day: {
    flex: 3.5,
    backgroundColor: '#F5F5F5',
    height: 80
  },
  calendar_day_date: {
    borderWidth: .5,
    borderColor: '#aeb4c4',
    backgroundColor: '#d9d9d9',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendar_day_details: {
    borderWidth: .5,
    borderColor: '#aeb4c4',
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5
  },
  calendar_day_details_text: {
    fontSize: 12,
    marginVertical: 3
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
    initialRouteName: 'timetablePage'
  }
)