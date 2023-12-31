import React from 'react';
import { Field } from 'formik';
import { FormikSingleSelectField, FormikCheckbox, FormikInputField } from 'components';
import I18n from 'i18n-config';
import { swapTypesLabels } from '../../constants';
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
        data-testid="SwapsSettings-swapConfigsEnableCheckbox"
        className="SwapsSettings__field"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.SYMBOL.ENABLE_LABEL')}
      />
    </div>
    <div className="SymbolSettings__field-container">
      <Field
        name="swapConfigs.type"
        data-testid="SwapsSettings-swapConfigsTypeSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.TYPE_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="SwapsSettings__field"
        component={FormikSingleSelectField}
        options={swapTypesLabels.map(({ name, value }) => ({
          label: I18n.t(name),
          value,
        }))}
      />
      <Field
        type="number"
        name="swapConfigs.long"
        data-testid="SwapsSettings-swapConfigsLongInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LONG_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
      <Field
        type="number"
        name="swapConfigs.short"
        data-testid="SwapsSettings-swapConfigsShortInput"
        label={I18n.t('TRADING_ENGINE.SYMBOL.SHORT_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
    </div>
  </div>
);

export default React.memo(SwapsSettings);
