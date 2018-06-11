import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

const RewardPlan = ({ title, amount, onClick }) => (
  <div className="font-size-13">
    <span className="font-weight-700">{I18n.t(title)}: </span>
    {amount}
    <i onClick={onClick} className="font-size-16 cursor-pointer fa fa-edit float-right" />
  </div>
);

RewardPlan.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

RewardPlan.defaultProps = {
  amount: 0,
  title: '',
};

export default RewardPlan;
