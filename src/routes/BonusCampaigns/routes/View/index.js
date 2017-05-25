import { injectReducer } from '../../../../store/reducers';
import { actionCreators } from './modules/index';

export default store => ({
  path: 'view/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (nextState.params.id) {
        injectReducer(store, {
          key: 'bonusCampaignView',
          reducer: require('./modules/index').default,
        });

        store.dispatch(actionCreators.fetchCampaign(nextState.params.id))
          .then((action) => {
            if (action && !action.error) {
              cb(null, require('./container/ViewContainer').default);
            } else {
              cb(null, require('routes/NotFound/container/Container').default);
            }
          });
      } else {
        cb(null, require('routes/NotFound/container/Container').default);
      }
    }, 'bonus-campaigns-view');
  },
});
