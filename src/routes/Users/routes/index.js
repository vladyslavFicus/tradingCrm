import ListRoute from './List';
import DormantRoute from './Dormant';

export default (store) => [
  ListRoute(store),
  DormantRoute(store),
];
