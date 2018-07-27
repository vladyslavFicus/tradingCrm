import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withServiceCheck } from '../../components/HighOrder';
import Route from './Route';

export default compose(
  withServiceCheck,
  withRouter,
  connect(({ auth: { logged }, permissions: { data: permissions } }) => ({ logged, permissions }))
)(Route);
