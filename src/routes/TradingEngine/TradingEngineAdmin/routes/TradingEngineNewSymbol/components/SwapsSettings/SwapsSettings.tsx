/* eslint-disable */
import React, { Suspense } from 'react';
import I18n from 'i18n';
import {Field} from "formik";
import {
  FormikInputField,
  FormikCheckbox,
  FormikSelectField,
} from 'components/Formik';
import './SwapsSettings.scss';

interface Props {

}

const SwapsSettings = (props: Props) => {
  const {
  } = props;

  return (
    <>
      <div className="SwapsSettings__section-header">
        <div className="SwapsSettings__section-title">
          {I18n.t('TRADING_ENGINE.NEW_SYMBOL.SWAPS')}
        </div>
      </div>
      <Field
        name="enable"
        className="SwapsSettings__field"
        component={FormikCheckbox}
        label={I18n.t(`TRADING_ENGINE.NEW_SYMBOL.ENABLE_LABEL`)}
      />
      <Field
        name="type"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.TYPE_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="SwapsSettings__field"
        component={FormikSelectField}
        withAnyOption
        searchable
        withFocus
      >
        {['type'].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Field>
      <Field
        name="longPosition"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.LONG_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
      <Field
        name="shortPosition"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.SHORT_POSITIONS_LABEL')}
        className="SwapsSettings__field"
        component={FormikInputField}
      />
      <Field
        name="days"
        label={I18n.t('TRADING_ENGINE.NEW_SYMBOL.3_DAYS_SWAP_LABEL')}
        placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
        className="SwapsSettings__field"
        component={FormikSelectField}
        searchable
        withFocus
      >
        {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Field>
    </>
  );
};

export default React.memo(SwapsSettings);
