import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { FormikCheckbox } from 'components/Formik';
import './GroupPermissionsForm.scss';

const GroupPermissionsForm = () => (
  <div className="GroupPermissionsForm">
    <div className="GroupPermissionsForm__fields">
      <div className="GroupPermissionsForm__field">
        <div className="GroupPermissionsForm__title">
          {I18n.t('TRADING_ENGINE.GROUP.PERMISSIONS_GROUP_FORM.TITLE')}
        </div>
      </div>
      <Field
        name="useSwap"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.GROUP.PERMISSIONS_GROUP_FORM.ENABLE_CHARGE_OF_SWAPS')}
        className="GroupPermissionsForm__field"
      />
      <Field
        name="hedgeProhibited"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.GROUP.PERMISSIONS_GROUP_FORM.PROHIBIT_HEDGE_POSITIONS')}
        className="GroupPermissionsForm__field"
      />
    </div>
  </div>
);

export default React.memo(GroupPermissionsForm);
