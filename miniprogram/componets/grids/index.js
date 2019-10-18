// componets/grids/index.js
Component({
  properties: {
    data: Array,
    col: Number,
    row: Number
  },

  data: {
    hasMore: false,
    currentPage: 0,
    pageCount: 0,
    maxPage: 0,
    currentData: [],
    selectedList: []
  },

  attached() {
    const data = this.properties.data;
    const maxRow = this.properties.row;
    this.data.pageCount = maxRow * this.properties.col;
    this.data.maxPage = (data.length / this.data.pageCount) | 0;
    if (data.length > maxRow * this.properties.col) {
      this.setData({
        hasMore: true,
        currentData: data.slice(0, this.data.pageCount)
      })
    } else {
      this.setData({
        currentData: this.properties.data
      })
    }

  },

  methods: {
    onTap(e) {
      const index = e.target.dataset.index + this.data.pageCount * this.data.currentPage;
      const tag = this.properties.data[index];
      tag.checked = !tag.checked;
      if(tag.checked){
        this.data.selectedList.push(index);
      }else{
        const i = this.data.selectedList.indexOf(index);
        this.data.selectedList.splice(i, 1);
      }
      this.triggerEvent('tagChange', {
        list: this.data.selectedList
      })
    },

    onLeft(e) {
      if (this.data.currentPage === 0) {
        wx.lin.showMessage({
          content: '这是第一页啦～',
          type: 'error'
        })
      } else {
        this.data.currentPage--;
        this.updateData();
      }
    },

    onRight(e) {
      if (this.data.currentPage === this.data.maxPage) {
        wx.lin.showMessage({
          content: '没有更多标签啦～',
          type: 'error'
        })
      } else {
        this.data.currentPage++;
        this.updateData();
      }
    },

    updateData() {
      const currentPage = this.data.currentPage,
        pageCount = this.data.pageCount;
      const start = currentPage * pageCount;
      this.setData({
        currentData: this.properties.data.slice(start, start + pageCount)
      })
    }
  }
})