import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native'
import { Table, TableWrapper, Cell } from 'react-native-table-component'
import Icon from 'react-native-vector-icons/MaterialIcons'
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
        Object.keys(weekdays).forEach(weekdayNum => constraintsByWeekday[weekdayNum] = [])
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
      tableData = currentWeekdayConstraints.map(key => { return key.tm.slice(0, -3) })  // извлекаем только время
      // ща будет супер костыль (нужен, чтобы дозаполнить оставшиеся в конце таблицы "пустые" дни)
      let tableDataLength = tableData.length
      for (let i = 0; i < timesPerLine - tableDataLength % timesPerLine; i++) tableData.push('')
      //
      tableData = new Array(Math.ceil(tableDataLength / timesPerLine)).fill()
        .map(_ => tableData.splice(0, timesPerLine)) // делим один большой массив на более мелкие
    }

    const element = (cellData, rowIndex, columnIndex) => (
      <TouchableOpacity
        onPress={() => this._changeWorkOpportunity(rowIndex, columnIndex)}
      >
        <View
          style={[
            !currentWeekdayConstraints[columnIndex + timesPerLine * rowIndex] ? styles.emptyButton :
            currentWeekdayConstraints[columnIndex + timesPerLine * rowIndex].isAbleToWork
                ? styles.buttonCanWork
                : styles.buttonUnableToWork,
            styles.tableCellButton
          ]}
        >
          <Text style={styles.btnText}>{cellData}</Text>
        </View>
      </TouchableOpacity>
    )

		return (
      <View style={{flex: 1}}>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Пожелание на день недели</Text>
        </View>

        <View style={styles.postHeaderContainer}>
          <Text style={styles.postHeaderText}>
            Красным помечены времена, когда вы не можете работать, а зеленым - когда можете. Нажмите на ячейку, чтобы изменить свои пожелания на день недели.
          </Text>
        </View>

        <View style={styles.weekdayContainer}>
          <View style={styles.leftButtonContainer}>
            <Icon.Button
              name='chevron-left'
              size={30}
              backgroundColor={goodColor}
              borderRadius={0}
              onPress={() => this._prevDay()}
            >
            </Icon.Button>
          </View>
          <Text style={styles.weekdayText}>{weekdays[state.currentWeekday]}</Text>
          <View style={styles.rightButtonContainer}>
            <Icon.Button
              name='chevron-right'
              size={30}
              backgroundColor={goodColor}
              borderRadius={0}
              onPress={() => this._nextDay()}
            >
            </Icon.Button>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Table borderStyle={{borderColor: '#fff', borderWidth: .2}}>
            {
              tableData.map((rowData, rowIndex) => (
                <TableWrapper key={rowIndex} style={styles.tableRow}>
                  {
                    rowData.map((cellData, columnIndex) => (
                      <Cell
                        key={columnIndex}
                        data={element(cellData, rowIndex, columnIndex)}
                        style={{padding: .2}}
                      />
                    ))
                  }
                </TableWrapper>
              ))
            }
          </Table>
        </View>

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity onPress={() => this._saveChanges()} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>
              Сохранить изменения
            </Text>
          </TouchableOpacity>
        </View>

      </View>
		)
  }
}

const styles = StyleSheet.create({
  headerContainer:{
    backgroundColor: primaryColor,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText : {
    paddingTop: 15,
    fontSize: 22,
    color: '#fff'
  },
  postHeaderContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d8d8d8',
    flexDirection: 'row'
  },
  postHeaderText: {
    color: '#727272',
    flex: 1,
    flexWrap: 'wrap'
  },
  weekdayContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  weekdayText: {
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
  tableContainer: {
    flex: 10,
    paddingTop: 10,
    alignItems: 'center'
  },
  tableRow: {
    flexDirection: 'row'
  },
  btnText: {
    color: '#ffffff'
  },
  tableCellButton: {
    width: 55,
    height: 55,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonUnableToWork: { 
    backgroundColor: dangerColor,
  },
  buttonCanWork: {
    backgroundColor: goodColor,
  },
  emptyButton: {
    backgroundColor: '#fff'
  },
  saveButtonContainer: {
    margin: 15,
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