import { LearnModel } from "../../models/learns.js"
import { login } from "../../util/util.js"
import { FileModel } from "../../models/files.js"
import { Towxml } from "../../towxml/main"
import { GoodsModel } from "../../models/goods.js"
const learnModel = new LearnModel();
const fileModel = new FileModel();
const goodsModel = new GoodsModel();
Page({

  data: {
    read: false,
    openid: '',
    did: '',
    loading: true,
    type: '',
    article: {},
    good: null
  },

  onLoad: function(options) {
    const did = options.id;
    const good = goodsModel.getById(did);
    const openid = login();

    Promise.all([good, openid]).then(res => {
      this.data.good = res[0].data[0];
      this.data.openid = res[1].result.openid;
      this.data.did = this.data.good._id;
      this.data.type = this.data.good.type;
      if (this.data.type === 'img') {
        this.renderImg();
      } else {
        this.renderOther();
      }

      return learnModel.get(this.data.openid, this.data.did);
    }).then(res => {
      const data = res.data;
      this.setData({
        read: data.length === 0 ? false : true,
      })
    })
  },

  renderImg() {
    fileModel.get(this.data.good.fileid)
      .then(res => {
        const url = res.tempFilePath;
        const {name, info, intro, labels} = this.data.good;
        const raw = `# ${name} \n![Alt](${url}) \n## 标签 \n${labels.join(' ')} \n## 图片介绍 \n${intro} \n## 相关介绍 \n${info} \n## 数据来源 \n- 上海图书馆知识竞赛 \n- 百度百科`;
        const towxml = new Towxml();
        let data = towxml.toJson(raw, 'markdown');
        data = towxml.initData(data, {
          base: 'https://xxx.com/',
          app: this
        });
        this.setData({
          article: data,
          loading:false
        })
      })
  },

  renderOther() {
    const fileId = this.data.good.fileid;
    fileModel.get(fileId)
      .then(res => {
        return new Promise((resolve, reject) => {
          const FileSystemManager = wx.getFileSystemManager();
          FileSystemManager.readFile({
            filePath: res.tempFilePath,
            encoding: "utf-8",
            success: res => {
              resolve(res)
            },
            fail: console.log
          });
        })
      }, console.log)
      .then(res => {
        const towxml = new Towxml();
        let data = towxml.toJson(res.data, 'markdown');
        data = towxml.initData(data, {
          base: 'https://xxx.com/',
          app: this
        });
        this.setData({
          article: data,
          loading:false
        })
      })
  },

  onConfirm(e) {
    wx.showLoading({
      title: "确定中"
    })
    learnModel.add(this.data.openid, this.data.did, this.data.type)
      .then(res => {
        this.setData({
          read: true
        })
        wx.hideLoading();
      })
  },

  onCancel(e) {
    wx.showLoading({
      title: "修改中"
    })
    learnModel.delete(this.data.openid, this.data.did)
      .then(res => {
        this.setData({
          read: false
        })
        wx.hideLoading();
      })
  }
})