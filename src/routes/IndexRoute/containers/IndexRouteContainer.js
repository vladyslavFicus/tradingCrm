import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IndexRoute from '../components/IndexRoute';
import { departments } from '../../../constants/brands';

export default withRouter(
  connect(({
    auth: {
      logged,
      department,
    },
  }) => ({
    logged,
    isAdministration: department === departments.ADMINISTRATION,
  }))(IndexRoute)
);
