import React from 'react'
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native'
import { ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import URLS from '../network/urls'
import ApiUtils from '../network/apiUtils'
import asyncStorage from '../storage/asyncStorage';

function renderIfElse(condition, trueContent, falseContent) {
  if (condition) {
    return trueContent
  } else {
    return falseContent
  }
}

export default class Notifications extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      notificationsCount: 20,
      isLoading: true,
      notifications: {}
    }
  }

  _openSideMenu () {
    this.props.navigation.openDrawer()
  }

  componentDidMount () {
    this.getNotifications()
  }

  getNotifications () {
    this.setState({ isLoading: true })
    ApiUtils.sendRequest(URLS.url.getNotifications, 'GET', {
      count: this.state.notificationsCount
    })
      .then(response => {
        this.setState({ notifications: response.data, isLoading: false })
      })
      .catch(error => {
        if (error.code === 401) {
          asyncStorage.clearStorage()
          this.props.navigation.navigate('Auth')
        } else {
          alert(error)
        }
      })
  }

  tryHandleChangeRequest (action, requestId) {
    Alert.alert(
      '',
      'Сохранить изменения?',
      [
        {text: 'Отменить'},
        {text: 'Да', onPress: () => this.handleChangeRequest(action, requestId)},
      ]
    )
  }

  handleChangeRequest (action, requestId) {
    ApiUtils.sendRequest(URLS.url.handleChangeRequest, 'POST', {
      action: action,
      request_id: requestId
    })
      .then(() => {
        Alert.alert('', 'Изменения успешно сохранены.')
        this.getNotifications()
      })
      .catch(err => {
        Alert.alert('Ошибка', err.code)
      })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '85%',
          backgroundColor: '#CED0CE',
          marginLeft: '15%'
        }}
      />
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity style={{justifyContent: 'center', flex: .1}} onPress={() => this._openSideMenu()}>
            <Icon name='menu' size={28} color={'#fff'}></Icon>
          </TouchableOpacity>

          <View style={{flex: .9, justifyContent: 'center'}}>
            <Text style={styles.headerText}>Уведомления</Text>
          </View>
        </View>
        
        <View style={styles.bodyContainer}>
          {renderIfElse(
            !this.state.isLoading,
            <FlatList
              data={this.state.notifications.notifications}
              containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
              keyExtractor={item => String(item.id)}
              ItemSeparatorComponent={this.renderSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isLoading}
                  onRefresh={() => this.getNotifications()}
                />
              }
              renderItem={({item}) => (
                <View>
                  <ListItem
                    roundAvatar
                    hideChevron={true}
                    title={item.dttm_added}
                    subtitle={item.text}
                    subtitleNumberOfLines={10}
                    containerStyle={{ borderBottomWidth: 0 }}
                    avatar={require('../../assets/warning.png')}
                  />
                  {renderIfElse(item.object_id, 
                      <View style={styles.acceptDeclineContainer}>
                        <TouchableOpacity
                          style={[styles.acceptDeclineItem, {backgroundColor: dangerColor}]}
                          onPress={() => this.tryHandleChangeRequest('D', (item.object_id))}
                        >
                          <Text>Отклонить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.acceptDeclineItem, {backgroundColor: goodColor}]}
                          onPress={() => this.tryHandleChangeRequest('A', (item.object_id))}
                        >
                          <Text>Одобрить</Text>
                        </TouchableOpacity>
                      </View>,
                      null
                    )}
                  
                </View>
              )}
            />,

            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" />
            </View>
          )}
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
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  acceptDeclineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: 120,
    paddingBottom: 5
  },
  acceptDeclineItem: {
    marginHorizontal: 5,
    padding: 8,
    borderRadius: 8
  }
})