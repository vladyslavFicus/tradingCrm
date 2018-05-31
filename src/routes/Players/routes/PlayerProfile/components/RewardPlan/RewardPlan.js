import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';

const RewardPlan = ({ title, available, amount, onOpen }) => (
  <Fragment>
    <div className="reward-plan-middle">{title}</div>
    <Choose>
      <When condition={available}>
        <div className="reward-plan-small">{amount}</div>
        <i
          onClick={onOpen}
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
  onOpen: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  available: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]).isRequired,
};

export default RewardPlan;
