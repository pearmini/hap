import Taro from '@tarojs/taro';
import config from '../config/index';

Taro.cloud.init();
const db = Taro.cloud.database();
const _ = db.command;

export default async ({ method, name, data, query, cb }) => {
  const map = {
    db: {
      source: `db: ${name}`,
      info: 'query',
      get: () => query(db, _),
    },
    fn: {
      source: `fn=${name}`,
      info: JSON.stringify(data),
      get: () => Taro.cloud.callFunction({ name, data }),
    },
    rest: {
      source: `rest=${name}`,
      info: 'rest',
      get: () => cb(Taro),
    },
  };

  try {
    const { source, info, get } = map[method];
    if (!config.noConsole) {
      console.log(`${new Date().toLocaleString()} 【${source}】 ${info}`);
    }
    const res = await get();
    if (!config.noConsole) {
      console.log(
        `${new Date().toLocaleString()} 【${source}】【接口响应】：`,
        res
      );
    }
    return res;
  } catch (e) {
    console.error(e);
  }
};
