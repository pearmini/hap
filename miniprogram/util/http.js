class HTTP {
  _request(url, resolve, reject, data, method) {
    wx.request({
      method: method,
      data: data,
      url: url,
      success: res => {
        resolve(res);
      },
      fail: res => {
        reject(data);
        this._show_error();
      }
    })
  }

  request({ url, data = {}, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method);
    })
  }

  _show_error() {
    console.log('some error!');
  }
}

export { HTTP }