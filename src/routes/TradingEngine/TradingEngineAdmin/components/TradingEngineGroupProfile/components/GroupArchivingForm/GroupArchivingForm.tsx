
import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import { ARCHIVE_PERIOD, ARCHIVE_MAX_BALANCE } from '../../constants';
import './GroupArchivingForm.scss';

const GroupArchivingForm = () => (
  <div className="GroupArchivingForm">
    <div className="GroupArchivingForm__fields">
      <div className="GroupArchivingForm__field">
        <div className="GroupArchivingForm__title">
          {I18n.t('TRADING_ENGINE.GROUP_PROFILE.ARCHIVING_GROUP_FORM.TITLE')}
        </div>
      </div>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.ARCHIVING_GROUP_FORM.INACTIVITY_PERIOD')}
        name="archivePeriodDays"
        component={FormikSelectField}
        className="GroupArchivingForm__field"
      >
        {Object.entries(ARCHIVE_PERIOD).map(([key, value]) => (
          <option key={key} value={Number(key)}>
            {value}
          </option>
        ))}
      </Field>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.ARCHIVING_GROUP_FORM.MAXIMUM_BAlANCE')}
        name="archiveMaxBalance"
        component={FormikSelectField}
        className="GroupArchivingForm__field"
      >
        {ARCHIVE_MAX_BALANCE.map(balance => (
          <option key={balance} value={balance}>
            {balance}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(GroupArchivingForm);
