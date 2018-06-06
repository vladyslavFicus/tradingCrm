import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

const RewardPlan = ({ title, available, amount, onClick }) => (
  <Fragment>
    <div className="reward-plan-middle">{title}</div>
    <Choose>
      <When condition={available}>
        <div className="reward-plan-small">{amount}</div>
        <i
          onClick={onClick}
          className="font-size-16 cursor-pointer fa fa-edit float-right"
        />
      </When>
      <Otherwise>
        <div className="reward-plan-middle">{I18n.t('COMMON.NOT_AVAILABLE')}</div>
      </Otherwise>
    </Choose>
  </Fragment>
);

RewardPlan.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.number,
  available: PropTypes.bool.isRequired,
};

RewardPlan.defaultProps = {
  amount: 0,
};

export default RewardPlan;
