import React from 'react';
import I18n from 'i18n';
import { Field } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import './FiltrationSettings.scss';

const FiltrationSettings = () => (
  <div className="FiltrationSettings">
    <div className="FiltrationSettings__section-header">
      <div className="FiltrationSettings__section-title">
        {I18n.t('TRADING_ENGINE.NEW_SYMBOL.FILTRATION')}
      </div>
    </div>
    <div className="FiltrationSettings__field-container">
      <Field
        type="number"
        name="filtration.softFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SOFT_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="filtration.softFilter"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.FILTER')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSelectField}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Field>
      <Field
        type="number"
        name="filtration.hardFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.HARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="filtration.hardFilter"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.FILTER')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSelectField}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Field>
      <Field
        type="number"
        name="filtration.discardFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.DISCARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        name="filtration.filterSmoothing"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SMOOTHING')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSelectField}
      >
        {['off', 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <option key={i} value={i === 'off' ? 0 : i}>
            {i}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(FiltrationSettings);
