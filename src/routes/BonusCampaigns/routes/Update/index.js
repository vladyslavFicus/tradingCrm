import { injectReducer } from 'store/reducers';
import { actionTypes, actionCreators } from './modules/update';

export default (store) => ({
  path: 'update/:id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      if (!!nextState.params.id) {
        injectReducer(store, {
          key: 'bonusCampaignUpdate',
          reducer: require('./modules/update').default,
        });

        store.dispatch(actionCreators.fetchCampaign(nextState.params.id))
          .then((action) => {
            if (actionTypes.FETCH_CAMPAIGN.SUCCESS === action.type) {
              cb(null, require('./container/Container').default);
            } else {
              cb(null, require('routes/NotFound/container/Container').default);
            }
          });
      } else {
        cb(null, require('routes/NotFound/container/Container').default);
      }
    }, 'bonus-campaigns-update');
  },
});
