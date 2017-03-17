import React from 'react';
import OperatorProfileLayout from '../layouts/OperatorProfileLayout';
import { connect } from 'react-redux';

const mapStateToProps = ({ operatorProfile: { view: operatorProfile } }) => ({
  ...operatorProfile,
});
const mapActions = {
};

export default connect(mapStateToProps, mapActions)(OperatorProfileLayout);
