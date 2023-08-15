import React from 'react';
import { Field } from 'formik';
import { Utils } from '@crm/common';
import { FormikSingleSelectField } from 'components';
import I18n from 'i18n-config';
import {
  LotMin,
  LotMax,
  LotStep,
} from 'routes/TE/routes/Groups/types';
import './VolumeSettings.scss';

const VolumeSettings = () => (
  <div className="VolumeSettings">
    <div className="SwapsSettings__section-header">
      <div className="SwapsSettings__section-title">
        {I18n.t('TRADING_ENGINE.SYMBOL.VOLUMES')}
      </div>
    </div>
    <div className="VolumeSettings__field-container">
      <Field
        name="lotMin"
        data-testid="VolumeSettings-lotMinSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_MIN')}
        className="VolumeSettings__field"
        component={FormikSingleSelectField}
        options={Utils.enumToArray(LotMin).map(value => ({
          label: value,
          value,
        }))}
      />
      <Field
        name="lotMax"
        data-testid="VolumeSettings-lotMaxSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_MAX')}
        className="VolumeSettings__field"
        component={FormikSingleSelectField}
        options={Utils.enumToArray(LotMax).map(value => ({
          label: value,
          value,
        }))}
      />
      <Field
        name="lotStep"
        data-testid="VolumeSettings-lotStepSelect"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_STEP')}
        className="VolumeSettings__field"
        component={FormikSingleSelectField}
        options={Utils.enumToArray(LotStep).map(value => ({
          label: value,
          value,
        }))}
      />
    </div>
  </div>
);

export default React.memo(VolumeSettings);
