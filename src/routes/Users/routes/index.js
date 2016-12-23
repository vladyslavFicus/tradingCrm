import { injectReducer } from 'store/reducers';

import ProfileRoute from './Profile';
import GameActivityRoute from './GameActivity';
import TransactionsRoute from './Transactions';
import BonusesRoute from './Bonuses';
import LimitsRoute from './Limits';

import ListRoute from './List';

export default (store) => [
  ListRoute(store),
  {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        injectReducer(store, { key: 'userProfile', reducer: require('../modules/view').default });
        injectReducer(store, { key: 'userBonus', reducer: require('../modules/bonus').default });

        cb(null, require('../layouts/Profile').default);
      });
    },

    childRoutes: [
      ProfileRoute(store),
      GameActivityRoute(store),
      TransactionsRoute(store),
      BonusesRoute(store),
      LimitsRoute(store),
    ],
  },
];
