import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import { InputField, SelectField } from '../../../../../../../../../components/ReduxForm';
import { wageredAmount } from '../../../../../../../../../constants/bonus-campaigns';

const Wagering = ({ label, modalOpen, remove }) => (
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
          {Object.keys(wageredAmount).map(key => (
            <option key={key} value={key}>
              {renderLabel(key, wageredAmount)}
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
          onIconClick={modalOpen}
        />
      </div>
    </div>
    <div className="margin-top-10">
      <input type="checkbox" />
      <span>{I18n.t('BONUS_CAMPAIGNS.FULFILLMENTS.EXCLUDE_BONUS_MONEY')}</span>
    </div>
    <button
      className="btn-transparent add-campaign-remove"
      type="button"
      onClick={remove}
    >
      &times;
    </button>
  </div>
);

Wagering.propTypes = {
  label: PropTypes.string.isRequired,
  modalOpen: PropTypes.func,
  remove: PropTypes.func,
};

Wagering.defaultProps = {
  modalOpen: null,
  remove: null,
};

export default Wagering;
