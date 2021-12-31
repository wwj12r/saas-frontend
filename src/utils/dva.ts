import { create } from 'dva-core';
// import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
import models from '../store';
import Taro from '@tarojs/taro';


function createApp(opt) {
  let app;
  // redux日志
  // opt.onAction = [createLogger()];
  app = create(opt);
  app.use(createLoading({}));

  opt.models.forEach(model => app.model(model));
  app.start();

  app.getStore = () => app._store;
  app.getDispatch = () => app._store.dispatch;
  return app;
}

let dvaApp = createApp({
  initialState: {},
  models: models,
  onError(e) {
    Taro.showToast({ title: e.message, icon: 'none' });
  },
});


export default dvaApp;
