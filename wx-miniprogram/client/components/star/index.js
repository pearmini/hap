Component({
  properties: {
    isLike: Boolean,
  },
  data: {},
  methods: {
    handleTap() {
      this.triggerEvent('click');
    },
  },
});
