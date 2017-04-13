import OpenLoopsRoute from './OpenLoops';
import MethodsRoute from './Methods';

export default store => [
  OpenLoopsRoute(store),
  MethodsRoute(store),
];
