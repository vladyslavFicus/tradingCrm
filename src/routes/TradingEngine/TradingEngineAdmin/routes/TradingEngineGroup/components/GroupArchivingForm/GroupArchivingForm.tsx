import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import enumToArray from 'utils/enumToArray';
import { ArchivePeriodDays, ArchiveMaxBalance } from '../../types';
import './GroupArchivingForm.scss';

const GroupArchivingForm = () => (
  <div className="GroupArchivingForm">
    <div className="GroupArchivingForm__fields">
      <div className="GroupArchivingForm__field">
        <div className="GroupArchivingForm__title">
          {I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.TITLE')}
        </div>
      </div>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.INACTIVITY_PERIOD')}
        name="archivePeriodDays"
        component={FormikSelectField}
        className="GroupArchivingForm__field"
      >
        {enumToArray(ArchivePeriodDays).map(key => (
          <option key={ArchivePeriodDays[key]} value={ArchivePeriodDays[key]}>
            {key === 'DISABLED' ? I18n.t('COMMON.DISABLED') : ArchivePeriodDays[key]}
          </option>
        ))}
      </Field>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.MAXIMUM_BAlANCE')}
        name="archiveMaxBalance"
        component={FormikSelectField}
        className="GroupArchivingForm__field"
      >
        {enumToArray(ArchiveMaxBalance).map(key => (
          <option key={ArchiveMaxBalance[key]} value={ArchiveMaxBalance[key]}>
            {ArchiveMaxBalance[key]}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(GroupArchivingForm);