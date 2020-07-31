import Taro, { Component } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';

import Index from './pages/index';

import configStore from './store';

import './app.scss';

const store = configStore();

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/discovery/index',
      'pages/user/index',
      'pages/detail/index',
      'pages/pictures/index',
    ],
    tabBar: {
      color: '#333',
      selectedColor: '#6190e8',
      list: [
        {
          pagePath: 'pages/discovery/index',
          text: '发现',
        },
        {
          pagePath: 'pages/index/index',
          text: '滤镜',
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
        },
      ],
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
