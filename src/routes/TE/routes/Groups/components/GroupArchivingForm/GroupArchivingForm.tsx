import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { FormikCheckbox, FormikSelectField } from 'components/Formik';
import enumToArray from 'utils/enumToArray';
import { ArchivePeriodDays, ArchiveMaxBalance, FormValues } from '../../types';
import './GroupArchivingForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const GroupArchivingForm = (props: Props) => {
  const { formik } = props;

  return (
    <div className="GroupArchivingForm">
      <div className="GroupArchivingForm__fields">
        <Field
          name="archivationEnabled"
          component={FormikCheckbox}
          label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.ENABLE')}
          className="GroupArchivingForm__field"
        />
        <div className="GroupArchivingForm__wrapper">
          <div className="GroupArchivingForm__title">
            {I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.TITLE')}
          </div>

          <Field
            label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.INACTIVITY_PERIOD')}
            name="archivePeriodDays"
            component={FormikSelectField}
            className="GroupArchivingForm__field"
            disabled={!formik.values.archivationEnabled}
          >
            {enumToArray(ArchivePeriodDays).map(value => (
              <option key={value} value={value}>
                {ArchivePeriodDays[value] === 'DISABLED' ? I18n.t('COMMON.DISABLED') : value}
              </option>
            ))}
          </Field>
          <Field
            label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.MAXIMUM_BAlANCE')}
            name="archiveMaxBalance"
            component={FormikSelectField}
            className="GroupArchivingForm__field"
            disabled={!formik.values.archivationEnabled}
          >
            {enumToArray(ArchiveMaxBalance).map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Field>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GroupArchivingForm);
