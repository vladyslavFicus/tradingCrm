import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { FormikInputField } from 'components';
import { FormValues } from '../../types';
import './GroupMarginsForm.scss';


type Props = {
  formik: FormikProps<FormValues>,
}

const GroupMarginsForm = (props: Props) => {
  const { formik: { initialValues: { enabled } } } = props;

  const archived = !enabled;

  return (
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
          data-testid="GroupMarginsForm-marginCallLevelInput"
          label={I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.MARGIN_CALL_LEVEL')}
          className="GroupMarginsForm__field"
          disabled={archived}
        />
        <Field
          name="stopoutLevel"
          component={FormikInputField}
          type="number"
          data-testid="GroupMarginsForm-stopoutLevelInput"
          label={I18n.t('TRADING_ENGINE.GROUP.MARGINS_GROUP_FORM.STOP_OUT_LEVEL')}
          className="GroupMarginsForm__field"
          disabled={archived}
        />
      </div>
    </div>
  );
};

export default React.memo(GroupMarginsForm);
