// componets/status-show/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: String,
    imgUrl: String,
    btnText: String,
    btnShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGo(){
      this.triggerEvent('go');
    }
  }
})
