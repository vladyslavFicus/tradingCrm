import { asyncRoute } from '../../../../../../router';
import './files-grid.scss';

export default asyncRoute(() => import(/* webpackChunkName: "ProfileFileContainer" */ './containers/ViewContainer'));
