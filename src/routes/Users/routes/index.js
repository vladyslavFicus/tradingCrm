import ListRoute from './List';
import KycRequestRoute from './Kyc';
import DormantRoute from './Dormant';

export default store => [
  ListRoute(store),
  KycRequestRoute(store),
  DormantRoute(store),
];
