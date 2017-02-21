import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';
import { actionCreators as viewActionCreators } from '../modules/view';

const mapStateToProps = ({ userGameActivity, userProfile }) => ({
  ...userGameActivity,
});
const mapActions = {
  ...viewActionCreators,
};

export default connect(mapStateToProps, mapActions)(View);
