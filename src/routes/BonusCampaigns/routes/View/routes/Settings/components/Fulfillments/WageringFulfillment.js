import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { InputField, SelectField } from '../../../../../../../../components/ReduxForm';

const WageringFulfillment = ({ label, wagerMenu }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {label}
    </div>
    <div className="form-row">
      <div className="form-row__big">
        <Field
          name="wageredAmount"
          label=""
          labelClassName="no-label"
          type="text"
          component={SelectField}
          position="vertical"
        >
          {Object.keys(wagerMenu).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, wagerMenu)}
            </option>
          ))}
        </Field>
      </div>
    </div>
    <div className="form-row">
      <div className="form-row__small">
        <Field
          name="ageFrom"
          type="text"
          label={I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.AMOUNT_TO_WAGER')}
          placeholder="0.00"
          component={InputField}
          position="vertical"
          iconRightClassName="nas nas-currencies_icon"
        />
      </div>
    </div>
    <div className="margin-top-10">
      <input type="checkbox" />
      <span>{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.EXCLUDE_BONUS_MONEY')}</span>
    </div>
    <button className="btn-transparent add-campaign-remove">&times;</button>
  </div>
);
WageringFulfillment.propTypes = {
  label: PropTypes.string.isRequired,
  wagerMenu: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default WageringFulfillment;
