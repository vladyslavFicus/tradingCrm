import React from 'react';
import { Field } from 'formik';
import I18n from 'i18n';
import {
  FormikInputField,
  FormikCheckbox,
  FormikSelectField,
} from 'components/Formik';
import { swapTypesLabels, rolloverLabels } from '../../constants';
import './SwapsSettings.scss';

const SwapsSettings = () => (
  <div className="SwapsSettings">
    <div className="SwapsSettings__section-header">
      <div className="SwapsSettings__section-title">
        {I18n.t('TRADING_ENGINE.SYMBOL.SWAPS')}
      </div>
    </div>
    <div className="SymbolSettings__field-container">
      <Field
        name="swapConfigs.enable"
        className="SwapsSettings__field"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.SYMBOL.ENABLE_LABEL')}
      />
    </div>
    <div className="SymbolSettings__field-container">
      <Field
        name="swapConfigs.type"
        label={I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="SwapsSettings__field"
        component={FormikSelectField}
      >
        {swapTypesLabels.map(({ name, value }) => (
          <option key={value} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Field>
      <Field
        type="number"
        name="swapConfigs.long"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LONG_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
      <Field
        type="number"
        name="swapConfigs.short"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SHORT_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
      <Field
        name="swapConfigs.rollover"
        label={I18n.t('TRADING_ENGINE.SYMBOL.3_DAYS_SWAP_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="SwapsSettings__field"
        component={FormikSelectField}
        searchable
      >
        {rolloverLabels.map(({ name, value }) => (
          <option key={value} value={value}>
            {I18n.t(name)}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(SwapsSettings);