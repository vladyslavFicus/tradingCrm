import React from 'react';
import { connect } from 'react-redux';
import View from '../components/View';
import { actionCreators as viewTermsActionCreators } from '../modules/view';
import { withRouter } from 'react-router';

const mapStateToProps = (state) => ({
  ...state.termsView,
});
export default withRouter(connect(mapStateToProps, { ...viewTermsActionCreators })(View));
