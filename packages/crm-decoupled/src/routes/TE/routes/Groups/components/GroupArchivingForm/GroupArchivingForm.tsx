import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { Utils } from '@crm/common';
import { FormikSingleSelectField, FormikCheckbox } from 'components';
import { ArchivePeriodDays, ArchiveMaxBalance, FormValues } from '../../types';
import './GroupArchivingForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const GroupArchivingForm = (props: Props) => {
  const { formik: { initialValues: { enabled }, values: { archivationEnabled } } } = props;

  const archived = !enabled;

  return (
    <div className="GroupArchivingForm">
      <div className="GroupArchivingForm__fields">
        <Field
          name="archivationEnabled"
          component={FormikCheckbox}
          data-testid="GroupArchivingForm-archivationEnabledCheckbox"
          label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.ENABLE')}
          className="GroupArchivingForm__field"
          disabled={archived}
        />
        <div className="GroupArchivingForm__wrapper">
          <div className="GroupArchivingForm__title">
            {I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.TITLE')}
          </div>

          <Field
            label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.INACTIVITY_PERIOD')}
            name="archivePeriodDays"
            component={FormikSingleSelectField}
            className="GroupArchivingForm__field"
            disabled={!archivationEnabled || archived}
            data-testid="GroupArchivingForm-archivePeriodDaysSelect"
            options={Utils.enumToArray(ArchivePeriodDays).map(value => ({
              label: ArchivePeriodDays[value] === 'DISABLED' ? I18n.t('COMMON.DISABLED') : value,
              value,
            }))}
          />

          <Field
            label={I18n.t('TRADING_ENGINE.GROUP.ARCHIVING_GROUP_FORM.MAXIMUM_BAlANCE')}
            name="archiveMaxBalance"
            component={FormikSingleSelectField}
            className="GroupArchivingForm__field"
            disabled={!archivationEnabled || archived}
            data-testid="GroupArchivingForm-archiveMaxBalanceSelect"
            options={Utils.enumToArray(ArchiveMaxBalance).map(value => ({
              label: value,
              value,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(GroupArchivingForm);
