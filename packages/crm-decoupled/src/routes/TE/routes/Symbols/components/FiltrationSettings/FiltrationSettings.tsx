import React from 'react';
import { Field, FormikProps } from 'formik';
import { FormikSingleSelectField, FormikCheckbox, FormikInputField } from 'components';
import I18n from 'i18n-config';
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
          data-testid="FiltrationSettings-defaultFiltrationCheckbox"
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
        data-testid="FiltrationSettings-filtrationSoftFiltrationLevelInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SOFT_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.softFilter"
        data-testid="FiltrationSettings-filtrationSoftFilterSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.FILTER')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSingleSelectField}
        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
          label: index,
          value: index,
        }))}
      />
      <Field
        disabled={props.values.defaultFiltration}
        type="number"
        name="filtration.hardFiltrationLevel"
        data-testid="FiltrationSettings-filtrationHardFiltrationLevelInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.HARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.hardFilter"
        data-testid="FiltrationSettings-filtrationHardFilterSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.FILTER')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSingleSelectField}
        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
          label: index,
          value: index,
        }))}
      />
      <Field
        disabled={props.values.defaultFiltration}
        type="number"
        name="filtration.discardFiltrationLevel"
        data-testid="FiltrationSettings-filtrationDiscardFiltrationLevelInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.DISCARD_FILTRATION_LEVEL')}
        className="FiltrationSettings__field"
        component={FormikInputField}
      />
      <Field
        disabled={props.values.defaultFiltration}
        name="filtration.filterSmoothing"
        data-testid="FiltrationSettings-filtrationFilterSmoothingSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SMOOTHING')}
        className="FiltrationSettings__field FiltrationSettings__field--small"
        component={FormikSingleSelectField}
        options={['off', 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
          label: (index === 'off') ? 0 : index,
          value: index,
        }))}
      />
    </div>
  </div>
);

export default React.memo(FiltrationSettings);
