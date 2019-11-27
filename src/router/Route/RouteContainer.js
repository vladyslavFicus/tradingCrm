import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import Route from './Route';

export default compose(
  withRouter,
)(withStorage(['auth', 'token'])(withPermission(Route)));
