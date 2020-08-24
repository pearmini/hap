import request from '../../utils/request';

export default {
  login() {
    return request({
      method: 'fn',
      name: 'login',
      options: {
        name: 'login',
        loadingTitle: '登陆中...',
      },
    });
  },
};
