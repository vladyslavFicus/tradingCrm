import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withServiceCheck } from '../../components/HighOrder';
import { departments } from '../../constants/brands';
import Route from './Route';

export default compose(
  withServiceCheck,
  withRouter,
  connect(({
    auth: { logged, department },
    permissions: { data: permissions },
  }) => ({
    logged,
    permissions,
    isAdministration: department === departments.ADMINISTRATION,
  }))
)(Route);
