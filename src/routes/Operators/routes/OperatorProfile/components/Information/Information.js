import React from 'react';
import Personal from './Personal';
import Departments from './Departments';
import PropTypes from '../../../../../../constants/propTypes';

const Information = ({ data }) => (
  <div className="account-details">
    <div className="row">
      <div className="col-md-4">
        <Personal data={data} />
      </div>
      <div className="col-md-3">
        <Departments authorities={data.authorities} />
      </div>
    </div>
  </div>
);

Information.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
};

export default Information;
