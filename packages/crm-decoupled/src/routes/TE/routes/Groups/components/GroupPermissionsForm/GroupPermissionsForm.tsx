import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { FormikCheckbox } from 'components';
import { FormValues } from '../../types';
import './GroupPermissionsForm.scss';


type Props = {
  formik: FormikProps<FormValues>,
}

const GroupPermissionsForm = (props: Props) => {
  const { formik: { initialValues: { enabled } } } = props;

  const archived = !enabled;

  return (
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
          data-testid="GroupPermissionsForm-useSwapCheckbox"
          label={I18n.t('TRADING_ENGINE.GROUP.PERMISSIONS_GROUP_FORM.ENABLE_CHARGE_OF_SWAPS')}
          className="GroupPermissionsForm__field"
          disabled={archived}
        />
        <Field
          name="hedgeProhibited"
          component={FormikCheckbox}
          data-testid="GroupPermissionsForm-hedgeProhibitedCheckbox"
          label={I18n.t('TRADING_ENGINE.GROUP.PERMISSIONS_GROUP_FORM.PROHIBIT_HEDGE_POSITIONS')}
          className="GroupPermissionsForm__field"
          disabled={archived}
        />
      </div>
    </div>
  );
};

export default React.memo(GroupPermissionsForm);
