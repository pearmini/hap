Component({
  properties: {
    placeholder: String,
    value: String,
  },

  data: {
    isFocus: false,
    value: '',
  },

  methods: {
    handleFocus: function () {
      this.setData({
        isFocus: true,
      });
      this.triggerEvent('focus');
    },

    handleBlur: function () {
      this.setData({
        isFocus: false,
      });
      this.triggerEvent('blur');
    },

    handleInput: function (e) {
      const {value} = e.detail;
      this.setData({
        value,
      });
      this.triggerEvent('input', {
        value,
      });
    },

    handleConfirm: function (e) {
      const {value} = e.detail;
      this.triggerEvent('confirm', {
        value,
      });
    },

    handleClear: function(){
      this.setData({
        value:''
      })
      this.triggerEvent('clear')
    }
  },
});
