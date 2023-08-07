import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import { Button } from 'components';
import { FormValues } from '../../types';
import './HolidayHeader.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const HolidayHeader = ({ formik }: Props) => {
  const { dirty, isSubmitting, initialValues } = formik;
  const { date } = initialValues;

  return (
    <div className="HolidayHeader">
      <div className="HolidayHeader__title">
        <Choose>
          <When condition={!!date}>
            {date}
          </When>
          <Otherwise>
            {I18n.t('TRADING_ENGINE.HOLIDAY.NEW_HOLIDAY')}
          </Otherwise>
        </Choose>
      </div>
      <Button
        small
        primary
        disabled={!dirty || isSubmitting}
        data-testid="HolidayHeader-saveButton"
        type="submit"
      >
        {I18n.t('COMMON.SAVE')}
      </Button>
    </div>
  );
};

export default React.memo(HolidayHeader);
