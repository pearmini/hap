import { DBModel } from "./db.js"
class LabelsModel extends DBModel {

  get(type) {
    return wx.cloud.callFunction({
      name: 'getAll',
      data: {
        type,
        dbname: 'labels'
      }
    }).then(res => {
      return new Promise((r, j) =>{
        r(res.result);
      })
    })
  }

  add(data){
  	return this.db.collection('labels').add({
  		data
  	})
  }
}

export { LabelsModel }