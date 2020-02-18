import React from 'react';
import PropTypes from 'constants/propTypes';
import Personal from './Personal';
import Departments from './Departments';

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
  data: PropTypes.partnerProfile.isRequired,
  authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
};

Information.defaultProps = {
  authorities: null,
};

export default Information;
