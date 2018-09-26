import React from 'react';
import Personal from './Personal';
import PropTypes from '../../../../../../constants/propTypes';
import AcquisitionStatus from './AcquisitionStatus';

const Information = ({ data, loading }) => (
  <div className="account-details">
    <div className="row">
      <div className="col-md-4">
        <Personal
          data={data}
          loading={loading}
        />
      </div>
      <div className="col-md-3">
        <AcquisitionStatus
          data={data}
          loading={loading}
        />
      </div>
    </div>
  </div>
);

Information.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

Information.defaultProps = {
  data: {},
};

export default Information;
