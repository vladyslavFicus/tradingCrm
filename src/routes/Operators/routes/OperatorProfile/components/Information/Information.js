import React from 'react';
import Personal from './Personal';
import Departments from './Departments';
import PropTypes from '../../../../../../constants/propTypes';

const Information = ({ data, authorities }) => (
  <div className="account-details">
    <div className="row">
      <div className="col-md-4">
        <Personal data={data} />
      </div>
      <div className="col-md-3">
        <Departments authorities={authorities} />
      </div>
    </div>
  </div>
);

Information.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
};

Information.defaultProps = {
  authorities: [],
};

export default Information;
