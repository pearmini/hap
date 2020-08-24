import promisify from './promisify';

wx.cloud.init();

const db = wx.cloud.database();
const $ = db.command.aggregate;
const _ = db.command;

export default async function ({method, name, options}) {
  try {
    const getByMethod = {
      fn: (options) => {
        return wx.cloud.callFunction({
          name: options.name,
          data: options.data,
        });
      },
      db: (options) => {
        const {query} = options;
        return query(db, $, _);
      },
      cloud: (options) => {
        const {name, ...rest} = options;
        const fn = promisify(wx.cloud[name]);
        return fn({...rest});
      },
    };
    wx.showLoading({
      title: options.loadingTitle || '加载中...',
    });
    console.log(`[request: ${method}(${name})]`, options);
    const get = getByMethod[method];
    const res = await get(options);
    console.log(`[response: ${method}]`, res);
    wx.hideLoading();
    return res;
  } catch (e) {
    console.error(e);
    wx.showToast({
      title: '出现了未知错误！',
      icon: 'none',
    });
  } finally {
    wx.hideLoading();
  }
}
