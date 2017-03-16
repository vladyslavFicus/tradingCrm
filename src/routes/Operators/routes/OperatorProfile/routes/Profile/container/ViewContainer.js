import React from 'react';
import View from '../components/View';
import { connect } from 'react-redux';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile } }) => ({
  ...operatorProfile,
  // user,
  // bonus,
});
const mapActions = {
};

export default connect(mapStateToProps, mapActions)(View);
