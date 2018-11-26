import axios from 'axios'
import { Alert } from 'react-native'

export default {
  sendRequest: function(url, method, params = {}) {
    return new Promise((resolve, reject) => {
      let data = {}
      data.url = url
      data.method = method
      data.credentials = 'include'
      data.headers = { 'Content-Type': 'application/json' }
      data.params = params
      axios.request(data)
        .then(response => {
          let data = response.data
          if (data.code < 400) resolve(data)
          else {
            if (data.data.error_type === 'ValueException') Alert.alert('Ошибка', 'Данные введены неправильно.')
            else Alert.alert('Ошибка', data.data.error_message)
          }
        })
        .catch(err => {
          if (!err.response) Alert.alert('', 'Сервер для обработки алгоритма недоступен.')
          if (err.response.status === 500) Alert.alert('', 'Ошибка при обработке данных на сервере.')
          reject(err) 
        })
    })
  }
}