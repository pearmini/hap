class DBModel {
  constructor() {
      this.db = wx.cloud.database({
        env: 'wechatcloud-79m2p'
      });
  }
}

export { DBModel }