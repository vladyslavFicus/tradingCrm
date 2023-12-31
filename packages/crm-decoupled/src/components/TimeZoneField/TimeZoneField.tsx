import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Field } from 'formik';
import { Constants } from '@crm/common';
import { FormikSingleSelectField } from 'components';

type Props = {
  name?: string,
  className?: string,
};

const TimeZoneField = (props: Props) => {
  const { name = 'timeZone', className = '' } = props;

  const currentTimeZone = moment().format('Z');

  return (
    <Field
      withFocus
      name={name}
      className={className}
      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      label={I18n.t('COMMON.TIME_ZONE')}
      labelTooltip={I18n.t('COMMON.CURRENT_TIME_ZONE', { currentTimeZone })}
      component={FormikSingleSelectField}
      options={Constants.timeZoneOffsets.map(item => ({
        label: `UTC ${item}`,
        value: item,
      }))}
    />
  );
};

export default React.memo(TimeZoneField);
