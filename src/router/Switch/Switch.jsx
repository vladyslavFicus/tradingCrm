import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomSwitch = ({ location, ...props }, { previousLocation }) => (
  <Switch location={location.state && location.state.modal ? previousLocation : location} {...props} />
);

CustomSwitch.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      modal: PropTypes.bool,
    }),
  }).isRequired,
};

CustomSwitch.contextTypes = {
  previousLocation: PropTypes.object,
};

export default withRouter(CustomSwitch);
