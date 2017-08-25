import React from 'react';
import PropTypes from 'prop-types';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../../../../components/ReduxForm';

const BonusReward = ({ label }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {label}
    </div>
    <div className="form-row">
      <div className="form-row__medium">
        {/*<CustomValueFieldVertical*/}
          {/*basename=""*/}
          {/*label=""*/}
          {/*typeValues=""*/}
        {/*/>*/}
      </div>
    </div>
    <button className="btn-transparent add-campaign-remove">&times;</button>
  </div>
);

BonusReward.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default BonusReward;
