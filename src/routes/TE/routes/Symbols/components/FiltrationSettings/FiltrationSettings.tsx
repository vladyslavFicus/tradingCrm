import React from 'react';
import { Field, FormikProps } from 'formik';
import I18n from 'i18n';
import {
  FormikCheckbox,
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { FormValues } from '../../types';
import './FiltrationSettings.scss';

type Props = {
  handleDefaultFiltration: () => void,
} & FormikProps<FormValues>

const FiltrationSettings = (props: Props) => (
  <div className="FiltrationSettings">
    <div className="FiltrationSettings__section-header">
      <div className="FiltrationSettings__section-title">
        {I18n.t('TRADING_ENGINE.SYMBOL.FILTRATION')}
      </div>
    </div>
    <If condition={!!props.values.source}>
      <div className="FiltrationSettings__field-container">
        <Field
          name="defaultFiltration"
          className="FiltrationSettings__field"
          component={FormikCheckbox}
          label={I18n.t('TRADING_ENGINE.SYMBOL.DEFAULT')}
          onChange={props.handleDefaultFiltration}
        />
      </div>
    </If>
    <div className="FiltrationSettings__field-container">
      <Field
        disabled={props.values.defaultFiltration}
        type="number"
        name="filtration.softFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SOFT_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.softFilter"
        label={I18n.t('TRADING_ENGINE.SYMBOL.FILTER')}
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
        disabled={props.values.defaultFiltration}
        type="number"
        name="filtration.hardFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.SYMBOL.HARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.hardFilter"
        label={I18n.t('TRADING_ENGINE.SYMBOL.FILTER')}
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
        disabled={props.values.defaultFiltration}
        type="number"
        name="filtration.discardFiltrationLevel"
        label={I18n.t('TRADING_ENGINE.SYMBOL.DISCARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.filterSmoothing"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SMOOTHING')}
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
