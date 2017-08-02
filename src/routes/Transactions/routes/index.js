import ListRoute from './List';
import OpenLoopsRoute from './OpenLoops';

export default store => [
  ListRoute(store),
  OpenLoopsRoute(store),
];
