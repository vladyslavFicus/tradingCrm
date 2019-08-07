import { asyncRoute } from '../../router';

export default asyncRoute(() => import(/* webpackChunkName: "Brands" */ './container/BrandsContainer'));
