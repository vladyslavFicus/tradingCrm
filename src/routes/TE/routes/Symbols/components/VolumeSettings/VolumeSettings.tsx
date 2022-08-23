import React from 'react';
import { Field } from 'formik';
import enumToArray from 'utils/enumToArray';
import I18n from 'i18n';

import {
  FormikSelectField,
} from 'components/Formik';
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
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_MIN')}
        className="VolumeSettings__field"
        component={FormikSelectField}
      >
        {enumToArray(LotMin).map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Field>
      <Field
        name="lotMax"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_MAX')}
        className="VolumeSettings__field"
        component={FormikSelectField}
      >
        {enumToArray(LotMax).map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Field>
      <Field
        name="lotStep"
        label={I18n.t('TRADING_ENGINE.SYMBOL.LOT_STEP')}
        className="VolumeSettings__field"
        component={FormikSelectField}
      >
        {enumToArray(LotStep).map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(VolumeSettings);