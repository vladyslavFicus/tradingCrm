import ListRoute from './List';
import KycRequestRoute from './Kyc';

export default store => [
  ListRoute(store),
  KycRequestRoute(store),
];
