import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Route from './Route';

export default compose(
  withRouter,
  connect(({
    auth: { logged, department, role },
    permissions: { data: permissions },
  }) => ({
    logged,
    permissions,
    authority: { department, role },
  })),
)(Route);
