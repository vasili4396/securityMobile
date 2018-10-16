import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native'
import { Table, TableWrapper, Cell } from 'react-native-table-component'
import moment from 'moment'
import apiUtils from '../network/apiUtils'
import URLS from '../network/urls'
import asyncStorage from '../storage/asyncStorage'

let groupBy = function(array, key) {
  return array.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const timesPerLine = 6
const timePeriod = [30, 'minutes']

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      constraintsInfo: Object,
      changedConstraints: Object,
      userId: Number,
      currentWeekday: moment().day() - 1,
      weekdays: {
        0: 'Понедельник',
        1: 'Вторник',
        2: 'Среда',
        3: 'Четверг',
        4: 'Пятница',
        5: 'Суббота',
        6: 'Воскресенье'
      }
    }
  }

  componentDidMount () {
    asyncStorage.getItem('user').then(userInfo => {
      this.getConstraint(userInfo.id)
      this.setState({userId: userInfo.id})
    })
  }

  getConstraint = (workerId) => {
    apiUtils.sendRequest(URLS.url.workerInfo, 'GET', {
      worker_id: workerId,
      info: 'constraints_info'
    })
      .then(res => {
        const data = res.data
        let constraintsByWeekday = {}
        let tmShopOpens = data.shop_times['tm_start']
        let tmShopCloses = data.shop_times['tm_end']
        Object.keys(this.state.weekdays).forEach(weekdayNum => constraintsByWeekday[weekdayNum] = [])
        let groupedByWeekday = groupBy(data.constraints_info, 'weekday')
        Object.keys(groupedByWeekday).forEach(key => {
          groupedByWeekday[key].sort(function (a, b) { // просто сортируем по времени
            return Date.parse('01/01/2000 '+ a) - Date.parse('01/01/2000 '+ b)
          })
          if (tmShopOpens !== null && tmShopCloses !== null) {  // фильтруем по закрытию/открытию магазина
            groupedByWeekday[key] = groupedByWeekday[key].filter( function(item) {
              return (
                (Date.parse('01/01/2000 '+ item.tm) - Date.parse('01/01/2000 '+ data.shop_times['tm_start']) >= 0)
                && 
                (Date.parse('01/01/2000 '+ data.shop_times['tm_end']) - Date.parse('01/01/2000 '+ item.tm) >= 0)
              )
            })
          }
        })
        if (tmShopCloses === null || tmShopOpens === null) {
          tmShopOpens = tmShopCloses = '00:00:00'
        }
        Object.keys(constraintsByWeekday).forEach(weekdayNum => {
          for (let startTime = moment(tmShopOpens, 'HH:mm:ss'); startTime <= moment(tmShopCloses, 'HH:mm:ss'); startTime.add(...timePeriod)) {
            constraintsByWeekday[weekdayNum].push({
              tm: startTime.format('HH:mm:ss'),
              isAbleToWork: !(
                groupedByWeekday.hasOwnProperty(weekdayNum) && 
                groupedByWeekday[weekdayNum].some(el => { return el.tm === startTime.format('HH:mm:ss') })
              )
            })
          }
        })
        this.setState({constraintsInfo: constraintsByWeekday})
      })
      .catch(err => {
        alert(err)
      })
  }

  _changeWorkOpportunity(rowIndex, columnIndex) {
    let prevState = this.state.constraintsInfo[this.state.currentWeekday][columnIndex + timesPerLine * rowIndex]
    if (prevState) {
      this.setState(state => (prevState.isAbleToWork = !prevState.isAbleToWork, state))
    }
  }

  _saveChanges () {
    const constraints = this.state.constraintsInfo

    let aggregatedData = {...Object.keys(constraints)}
    Object.keys(aggregatedData).forEach(weekdayNum => {
      aggregatedData[weekdayNum] = constraints[weekdayNum].filter(item => {
        return !item.isAbleToWork
      }).map(filteredItem => filteredItem.tm)
    })
    
    apiUtils.sendRequest(URLS.url.setWorkerInfo, 'POST', {
      worker_id: this.state.userId,
      constraint: JSON.stringify(aggregatedData)
    })
      .then(() => {
        alert('Изменения были успешно сохранены.')
      })
      .catch(err => {
        alert(err)
      })
  }

  _nextDay () {
    let nextWeekday = (++this.state.currentWeekday)%7
    this.setState({currentWeekday: nextWeekday})
  }

  _prevDay () {
    let prevWeekday = ((this.state.currentWeekday += 6)%7)
    this.setState({currentWeekday: prevWeekday})
  }

  render() {
    const state = this.state
    let currentWeekdayConstraints = state.constraintsInfo[state.currentWeekday]
    let tableData = []
    if (currentWeekdayConstraints) {
      tableData = currentWeekdayConstraints.map(key => {return key.tm.slice(0, -3)})  // извлекаем только время
      // ща будет супер костыль
      let tableDataLength = tableData.length
      for (let i = 0; i < timesPerLine - tableDataLength % timesPerLine; i++) tableData.push('')
      //
      tableData = new Array(Math.ceil(tableDataLength / timesPerLine)).fill().map(
        _ => tableData.splice(0, timesPerLine)
      ) // делим один большой массив на более мелкие
    }

    const element = (cellData, rowIndex, columnIndex) => (
      <TouchableOpacity
        onPress={() => this._changeWorkOpportunity(rowIndex, columnIndex)}
      >
        <View
          style={
            !currentWeekdayConstraints[columnIndex + timesPerLine * rowIndex] ? styles.emptyButton :
            currentWeekdayConstraints[columnIndex + timesPerLine * rowIndex].isAbleToWork
                ? styles.buttonCanWork
                : styles.buttonUnableToWork
          }
        >
          <Text style={styles.btnText}>{cellData}</Text>
        </View>
      </TouchableOpacity>
    );

		return (
      <View style={styles.container}>
        <Button
          onPress={() => this._prevDay()}
          title="Prev"
          color="#841584"
          style={{flexDirection: 'row', flexWrap:'wrap'}}
        />
        <Text style={{flexDirection: 'row', flexWrap:'wrap', alignItems: 'flex-start'}}> {state.weekdays[state.currentWeekday]} </Text>
        <Button
          onPress={() => this._nextDay()}
          title="Next"
          color="#841584"
        />
        <Table borderStyle={{borderColor: '#fff'}}>
          {
            tableData.map((rowData, rowIndex) => (
              <TableWrapper key={rowIndex} style={styles.row}>
                {
                  rowData.map((cellData, columnIndex) => (
                    <Cell key={columnIndex} data={element(cellData, rowIndex, columnIndex)} textStyle={styles.text}/>
                  ))
                }
              </TableWrapper>
            ))
          }
        </Table>
        <Button
          onPress={() => this._saveChanges()}
          title="Сохранить изменения"
          color="#841584"
        />
      </View>
		)
  }
}

const styles = StyleSheet.create({
  text: {
    margin: 6
  },
  weekdayContainer: {
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 24
  },
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#fff' 
  },
  row: { flexDirection: 'row', backgroundColor: '#fff' },
  buttonUnableToWork: { width: 60, height: 60, backgroundColor: '#FF0000', borderRadius: 2},
  buttonCanWork: { width: 60, height: 60, backgroundColor: '#01c056', borderRadius: 2},
  emptyButton: { width: 60, height: 60, backgroundColor: '#fff'},
  btnText: { textAlign: 'center', justifyContent: 'center', color: '#000000' },
})