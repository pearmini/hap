function login() {
  return wx.cloud.callFunction({
    name: 'login',
  })
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + [hour, minute, second].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function promisic(func){
  return function(params = {}){
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        success: res => resolve(res),
        fail: error => reject(error)
      })
      func(args)
    })
  }
}

export { login, formatTime, formatNumber, promisic }