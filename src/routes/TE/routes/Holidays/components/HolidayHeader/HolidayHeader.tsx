import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { Button } from 'components/UI';
import { FormValues } from '../../types';
import './HolidayHeader.scss';

interface Props {
  formik: FormikProps<FormValues>,
}

const HolidayHeader = ({ formik }: Props) => {
  const { dirty, isSubmitting, initialValues } = formik;
  const { date } = initialValues;

  return (
    <div className="HolidayHeader">
      <ReactPlaceholder
        ready={date !== undefined}
        customPlaceholder={(
          <div>
            <TextRow
              className="animated-background"
              style={{ width: '220px', height: '20px' }}
            />
          </div>
        )}
      >
        <div className="HolidayHeader__title">
          {date || I18n.t('TRADING_ENGINE.HOLIDAY.NEW_HOLIDAY')}
        </div>
      </ReactPlaceholder>
      <Button
        small
        primary
        disabled={!dirty || isSubmitting}
        type="submit"
      >
        {I18n.t('COMMON.SAVE')}
      </Button>
    </div>
  );
};

export default React.memo(HolidayHeader);
