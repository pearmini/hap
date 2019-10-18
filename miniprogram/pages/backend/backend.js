// miniprogram/pages/backend1/backend1.js
import { GoodsModel } from "../../models/goods.js"
import { LabelsModel } from "../../models/labels.js"
import { FileModel } from "../../models/files.js"
const fileModel = new FileModel();
const goodsModel = new GoodsModel();
const labelsModel = new LabelsModel();
Page({

  data: {
    imgSrc: "https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/1.jpg?sign=49d449be6af88403a200117a6b8d7404&t=1565506439",
    content: "hhh",
    currentTags: [],
    tags: ['a'],
    newTags: [],
    cur: null,
    inputKey: '',
    inputTag: '',
    selectedTagsAll: [],
    selectedTags: []
  },

  onKeyWordChange(e) {
    this.data.cur.name = e.detail.detail.value;
  },
  onLoad: function(options) {
    const good = goodsModel.getCurrent();
    const labels = labelsModel.get("img");
    wx.showLoading({
      'title': 'loading'
    })
    Promise.all([good, labels]).then(res => {
      this.setData({
        cur: res[0].data[0],
        tags: res[1].data.map(i => i.value)
      })
      wx.hideLoading();
    })
  },

  onLeft(e) {
    const previous = goodsModel.getPrevious(this.data.cur);
    wx.showLoading({
      'title': 'loading'
    })
    previous.then(res => {
      wx.hideLoading();
      if (res === -1) {
        wx.showToast({
          'title': '第一张',
          'icon': 'none'
        })
        return;
      }
      this.setData({
        cur: res.data[0]
      })
    })
  },

  onRight(e) {
    wx.showLoading({
      'title': 'loading'
    })
    const next = goodsModel.getNext(this.data.cur);
    next.then(res => {
      wx.hideLoading();
      if (res === -1) {
        wx.showToast({
          'title': '最后一张',
          'icon': 'none'
        })
        return;
      }
      this.setData({
        cur: res.data[0]
      })
    })
  },

  isDelete(e) {
    wx.lin.showDialog({
      type: "confirm",
      title: "提示",
      content: "确定删除？",
      success: (res) => {
        if (res.confirm) {
          this.onDelete(e);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onDelete(e) {
    wx.showLoading({
      'title': 'deleting'
    })
    const del = goodsModel.delete(this.data.cur);
    del
      .then(res => { // 删除文件
        if (this.data.cur.fileid != '#') {
          return fileModel.delete(this.data.cur.fileid);
        } else {
          return new Promise((r, j) => {
            r();
          })
        }
      })
      .then(res => { //获取新的数据
        return goodsModel.getCurrent()
      }).then(res => { //渲染新的数据
        const data = res.data[0];
        this.setData({
          cur: res.data[0]
        })
        wx.showToast({
          title: '删除成功！'
        })
        wx.hideLoading();
      })
  },

  onView(e) {
    if (this.data.cur.fileid === '#') {
      wx.showToast({
        title: '还没有保存',
        icon: 'none'
      })
      return;
    }

    wx.navigateTo({
      url: `../detail/detail?id=${this.data.cur._id}`
    })
  },

  onQuery(e) {
    if (this.data.inputKey === '') {
      wx.showToast({
        title: '关键字非空',
        icon: 'none'
      })
      return;
    }

    const content = goodsModel.getInfoByKey(this.data.inputKey);
    wx.showLoading({
      title: 'loading'
    })
    content.then(res => {
      wx.hideLoading();
      this.data.cur.info = res.result === null ? '暂时没有相关信息。' : res.result;
      this.setData({
        cur: this.data.cur,
        inputKey: ''
      })
    })
  },

  onAddName(e) {
    if (this.data.cur.name === '') return;
    this._addTag(this.data.cur.name);
  },

  _addTag(tag) {
    // 将关键字添加成标签
    let index = this.data.cur.labels.indexOf(tag);
    if (index != -1) {
      this.setData({
        inputTag: ''
      })
      return;
    }
    this.data.cur.labels.push(tag);
    index = this.data.tags.indexOf(tag);
    if (index === -1) {
      this.data.tags.push(tag);
      this.data.newTags.push(tag);
    }
    this.setData({
      cur: this.data.cur,
      tags: this.data.tags
    })
  },

  onSave(e) {
    if (this.data.cur.name === '' || this.data.cur.labels.length === 0) {
      wx.showToast({
        'title': '关键字和标签不能为空',
        'icon': 'none'
      })
      return;
    }
    // 保存图片
    wx.showLoading({
      title: 'saving'
    })
    wx.getImageInfo({
      src: this.data.cur.url,
      success: (res) => {
        const name = this.data.cur.url.split('/').pop();
        const f = fileModel.add(res.path, `imgs/${name}`);
        f.then(res => {
          // 保存标签
          const promiseArr = [];
          for (let t of this.data.newTags) {
            promiseArr.push(labelsModel.add({
              type: 'img',
              value: t
            }))
          }
          // 保存goods
          promiseArr.push(goodsModel.updateGood(this.data.cur.id, {
            name: this.data.cur.name,
            fileid: res.fileID,
            info: this.data.cur.info,
            labels: this.data.cur.labels
          }))

          this.data.cur.fileid = res.fileID;
          this.setData({
            cur: this.data.cur
          })

          Promise.all(promiseArr).then(res => {
            this.data.newTags = [];
            wx.hideLoading();
            wx.showToast({
              title: '保存成功'
            })
          })
        })
      },
      fail: err => {
        console.log(err);
        this.onDelete();
        wx.hideLoading();
      }
    })
  },

  onKeyChange(e) {
    this.data.inputKey = e.detail.detail.value;
  },

  onTagChange(e) {
    this.data.inputTag = e.detail.detail.value;
  },

  onAddTag(e) {
    let index = this.data.cur.labels.indexOf(this.data.inputTag);
    if (this.data.inputTag === '' || index != -1) {
      wx.showToast({
        title: '标签为空或者重复',
        icon: 'none'
      })
      this.setData({
        inputTag: ''
      })
      return;
    }
    this.data.cur.labels.push(this.data.inputTag);
    index = this.data.tags.indexOf(this.data.inputTag);
    if (index === -1) {
      this.data.tags.push(this.data.inputTag);
      this.data.newTags.push(this.data.inputTag);
    }
    this.setData({
      cur: this.data.cur,
      inputTag: '',
      tags: this.data.tags
    })
  },

  tagChangeMy(e) {
    this.data.selectedTags = e.detail.value;
  },

  onDeleteTag(e) {
    for (let t of this.data.selectedTags) {
      const index = this.data.cur.labels.indexOf(t);
      if (index != -1) {
        this.data.cur.labels.splice(index, 1);
      }
    }
    this.setData({
      cur: this.data.cur
    })
  },

  tagChangeAll(e) {
    this.data.selectedTagsAll = e.detail.value;
  },

  onAddTagAll(e) {
    for (let t of this.data.selectedTagsAll) {
      const index = this.data.cur.labels.indexOf(t);
      if (index === -1) {
        this.data.cur.labels.push(t);
      } else {
        wx.showToast({
          title: '标签重复',
          icon: 'none'
        })
      }
    }
    this.setData({
      cur: this.data.cur
    })
  },

  onFormatLabel(e) {
    console.log(e);
    wx.showLoading({
      title: '更新中'
    })

    const imgs = this.getAll('img'),
      samples = this.getAll('sample'),
      strokes = this.getAll('stroke');

    Promise.all([imgs, samples, strokes]).then(res => {
      console.log(res);
      // wx.hideLoading();
      let allLabels = [];
      let types = ['img', 'sample', 'stroke'];
      for (let i = 0; i < res.length; i++) {
        const r = res[i];
        let labels = [];
        const data = r.result.data;
        for (let d of data) {
          for (let l of d.labels) {
            if (labels.indexOf(l) === -1) {
              labels.push(l);
            }
          }
        }
        labels = labels.map(item => ({ value: item, type: types[i] }))
        allLabels.push(...labels);
      }
      // console.log(allLabels);
      wx.cloud.callFunction({
        name: 'updateLabels',
        data: {
          labels: allLabels
        },
        success: (res) => {
          wx.hideLoading();
        },
        fail: err => {
          console.log(err);
          wx.hideLoading();
        }
      })

    })
  },

  getAll(type) {
    return new Promise((r, j) => {
      wx.cloud.callFunction({
        name: 'getAllGoods',
        data: {
          dbname: 'goods',
          type
        },
        success: (res) => {
          console.log(res);
          r(res);
        }
      })
    })
  }
})