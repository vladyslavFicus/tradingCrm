import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

const RewardPlan = ({ title, available, amount, onClick }) => (
  <div className="font-size-13">
    <span className="font-weight-700">{title}: </span>
    <Choose>
      <When condition={available}>
        {amount}
        <i onClick={onClick} className="font-size-16 cursor-pointer fa fa-edit float-right" />
      </When>
      <Otherwise>
        {I18n.t('COMMON.NOT_AVAILABLE')}
      </Otherwise>
    </Choose>
  </div>
);

RewardPlan.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  available: PropTypes.bool.isRequired,
};

RewardPlan.defaultProps = {
  amount: 0,
};

export default RewardPlan;
