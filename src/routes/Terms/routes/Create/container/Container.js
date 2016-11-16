import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators } from '../modules/create';
import { withRouter } from 'react-router';

const mapStateToProps = (state) => ({
  ...state.termsCreate,
});
export default withRouter(connect(mapStateToProps, {
  ...actionCreators,
})(Create));
