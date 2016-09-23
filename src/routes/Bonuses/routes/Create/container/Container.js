import React from 'react';
import { connect } from 'react-redux';
import Create from '../components/Create';
import { actionCreators as bonusActionCreators } from '../modules/create';
import { actionCreators as profileActionCreators } from 'routes/Users/modules/view';
import { withRouter } from 'react-router';

const mapStateToProps = (state) => ({
  ...state.bonusCreate,
});
export default withRouter(connect(mapStateToProps, {
  ...bonusActionCreators,
  fetchProfile: profileActionCreators.loadProfile,
})(Create));
