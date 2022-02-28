import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { FormikInputField } from 'components/Formik';
import './GroupMarginsForm.scss';

const GroupMarginsForm = () => (
  <div className="GroupMarginsForm">
    <div className="GroupMarginsForm__fields">
      <div className="GroupMarginsForm__field GroupMarginsForm__field--center">
        <div className="GroupMarginsForm__title">
          {I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.TITLE')}
        </div>
      </div>
      <Field
        name="marginCallLevel"
        component={FormikInputField}
        type="number"
        label={I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.MARGIN_CALL_LEVEL')}
        className="GroupMarginsForm__field"
      />
      <Field
        name="stopoutLevel"
        component={FormikInputField}
        type="number"
        label={I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.STOP_OUT_LEVEL')}
        className="GroupMarginsForm__field"
      />
    </div>
  </div>
);

export default React.memo(GroupMarginsForm);
