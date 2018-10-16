function NetworkError ({data, code}) {
  Error.call(this, data)
  this.name = 'Ошибка сервера'
  this.code = code
  this.message = `${data.error_type} (${code}). ${data.error_message}`

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, NetworkError)
  } else {
    this.stack = (new Error()).stack
  }
}
NetworkError.prototype = Object.create(Error.prototype)

function transformGetRequest (url, params) {
  url += '?'
  let paramsAmount = Object.keys(params).length
  Object.keys(params).map((paramsKey, index) => {
    url += String(paramsKey) + '=' + String(params[paramsKey])
    if (index !== paramsAmount - 1) {
      url += '&'
    }
  })
  return url
}

export default {
  sendRequest: function(url, method, params = {}) {
    return new Promise((resolve, reject) => {
      let data = {}
      data.method = method
      data.credentials = 'include'
      data.headers = { 'Content-Type': 'application/json' }
      data.body = method === 'POST' ? JSON.stringify(params) : undefined
      if (method === 'GET' && params) {
        url = transformGetRequest(url, params)
      }
      fetch(url, data)
        .then(response => response.json())
        .then(response => {
          let data = response.data
          let code = response.code
          if (code < 400) {
              resolve(response)
          } else {
              reject(new NetworkError ({data: data, code: code}))
          }
        })
        .catch(err => {
          console.log(err)
            reject(
              new NetworkError ({
                data: {
                  error_message: 'Ошибка подключения к серверу', 
                  error_type: err}, 
                code: 500
              })
            )
            console.log('Error in sendRequest method: ', err)
        })
    })
  }
}