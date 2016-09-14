import { injectReducer } from 'store/reducers';
import { actionTypes, actionCreators } from './modules/update';

export default (store) => ({
  path: 'update/:id',
  onEnter: (nextState, replace, callback) => {
    if (!!nextState.params.id) {
      injectReducer(store, {
        key: 'bonusCampaignUpdate',
        reducer: require('./modules/update').default,
      });

      store.dispatch(actionCreators.fetchCampaign(nextState.params.id))
        .then((action) => {
          if (actionTypes.FETCH_CAMPAIGN.SUCCESS === action.type) {
            callback();
          } else {
            console.warn('Campaign not found...');
            replace({
              pathname: '/404',
            });
          }
        });
    } else {
      console.warn('Route is not valid');
      replace({
        pathname: '/404',
      });
    }
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, { content: require('./container/Container').default });
    }, 'bonus-campaigns-update');
  },
})
;
