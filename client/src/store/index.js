import { create } from 'dva-core';
import createLoading from 'dva-loading';

import discoveryModel from '../pages/discovery/model';
import detailModel from '../pages/detail/model';
import indexModel from '../pages/index/model';
import picturesModel from '../pages/pictures/model';

export default function configStore() {
  const models = [discoveryModel, detailModel, indexModel, picturesModel];

  const app = create({
    models,
    initialState: {},
  });

  app.use(createLoading());

  if (!global.registered) {
    models.forEach(model => app.model(model));
    global.registered = true;
  }

  app.start();
  return app._store;
}
