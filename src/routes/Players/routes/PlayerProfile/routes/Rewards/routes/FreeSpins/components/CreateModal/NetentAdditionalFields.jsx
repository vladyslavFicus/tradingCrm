import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { SelectField } from '../../../../../../../../../../components/ReduxForm';

const NetentAdditionalFields = ({
  betLevelLabel, coinValueLevelLabel, betLevels, coinValueLevels, disabled,
}) => (
  <div className="col-md-8">
    <div className="row">
      <div className="col-md-6">
        <Field
          name="betLevel"
          label={betLevelLabel}
          labelClassName="form-label"
          position="vertical"
          component={SelectField}
          showErrorMessage
          disabled={disabled}
        >
          <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_COIN_SIZE')}</option>
          {betLevels.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
      </div>
      <div className="col-md-6">
        <Field
          name="coinValueLevel"
          label={coinValueLevelLabel}
          labelClassName="form-label"
          position="vertical"
          component={SelectField}
          showErrorMessage
          disabled={disabled}
        >
          <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_NUMBER_OF_COINS')}</option>
          {coinValueLevels.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
      </div>
    </div>
  </div>
);
NetentAdditionalFields.propTypes = {
  betLevelLabel: PropTypes.string.isRequired,
  coinValueLevelLabel: PropTypes.string.isRequired,
  betLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  coinValueLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  disabled: PropTypes.bool,
};
NetentAdditionalFields.defaultProps = {
  disabled: false,
};

export default NetentAdditionalFields;
