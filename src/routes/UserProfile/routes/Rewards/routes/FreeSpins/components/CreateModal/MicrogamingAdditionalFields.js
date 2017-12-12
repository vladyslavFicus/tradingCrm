import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import { Currency } from '../../../../../../../../components/Amount';

const MicrogamingAdditionalFields = ({ coinLabel, disabled, coinSizeLabel, coins, coinSizes, currency }) => (
  <div className="col-md-8">
    <div className="row">
      <div className="col-md-6">
        <Field
          name="coinSize"
          label={coinSizeLabel}
          labelClassName="form-label"
          position="vertical"
          component={SelectField}
          showErrorMessage
          disabled={disabled}
          inputAddon={<Currency code={currency} />}
        >
          <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_COIN_SIZE')}</option>
          {coinSizes.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
      </div>
      <div className="col-md-6">
        <Field
          name="numberOfCoins"
          label={coinLabel}
          labelClassName="form-label"
          position="vertical"
          component={SelectField}
          showErrorMessage
          disabled={disabled}
        >
          <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_NUMBER_OF_COINS')}</option>
          {coins.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
      </div>
    </div>
  </div>
);
MicrogamingAdditionalFields.propTypes = {
  coinLabel: PropTypes.string.isRequired,
  coinSizeLabel: PropTypes.string.isRequired,
  coins: PropTypes.arrayOf(PropTypes.number).isRequired,
  coinSizes: PropTypes.arrayOf(PropTypes.number).isRequired,
  currency: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
MicrogamingAdditionalFields.defaultProps = {
  disabled: false,
};

export default MicrogamingAdditionalFields;
