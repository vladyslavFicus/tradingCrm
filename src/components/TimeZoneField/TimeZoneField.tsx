import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Field } from 'formik';
import { timeZoneOffsets } from 'constants/dates';
import { FormikSelectField } from 'components/Formik';

type Props = {
  name?: string,
  className?: string,
};

const TimeZoneField = (props: Props) => {
  const { name = 'timeZone', className = '' } = props;

  const currentTimeZone = moment().format('Z');

  return (
    <Field
      name={name}
      className={className}
      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      label={I18n.t('COMMON.TIME_ZONE')}
      labelTooltip={I18n.t('COMMON.CURRENT_TIME_ZONE', { currentTimeZone })}
      component={FormikSelectField}
      withFocus
    >
      {timeZoneOffsets.map(item => (
        <option key={item} value={item}>
          {`UTC ${item}`}
        </option>
      ))}
    </Field>
  );
};

export default React.memo(TimeZoneField);
