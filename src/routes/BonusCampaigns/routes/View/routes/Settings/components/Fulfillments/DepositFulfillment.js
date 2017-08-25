import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { InputField } from '../../../../../../../../components/ReduxForm';

const DepositFulfillment = ({ label }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {label}
    </div>
    <div className="form-row">
      <div className="form-row__medium">
        <label>{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.DEPOSIT_AMOUNT_RANGE')}</label>
        <div className="range-group">
          <Field
            name="ageFrom"
            type="text"
            placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MIN_AMOUNT_PLACEHOLDER')}
            component={InputField}
            position="vertical"
            iconRightClassName="nas nas-currencies_icon"
          />
          <span className="range-group__separator">-</span>
          <Field
            name="ageTo"
            type="text"
            placeholder={I18n.t('BONUS_CAMPAIGNS.SETTINGS.LABEL.MAX_AMOUNT_PLACEHOLDER')}
            component={InputField}
            position="vertical"
            iconRightClassName="nas nas-currencies_icon"
          />
        </div>
      </div>
    </div>
    <button className="btn-transparent add-campaign-remove">&times;</button>
  </div>
);
DepositFulfillment.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default DepositFulfillment;
