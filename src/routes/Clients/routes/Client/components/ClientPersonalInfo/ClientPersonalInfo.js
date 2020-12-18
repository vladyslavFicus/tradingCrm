/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';

class ClientPersonalInfo extends PureComponent {
  static propTypes = {
    client: PropTypes.profile.isRequired,
  };

  render() {
    return (
      <div>Your code here</div>
    );
  }
}

export default ClientPersonalInfo;
