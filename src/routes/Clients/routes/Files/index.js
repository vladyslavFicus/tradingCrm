import { asyncRoute } from '../../../../router';

export default asyncRoute(() => import(/* webpackChunkName: "FileContainer" */ './containers/FilesContainer'));
