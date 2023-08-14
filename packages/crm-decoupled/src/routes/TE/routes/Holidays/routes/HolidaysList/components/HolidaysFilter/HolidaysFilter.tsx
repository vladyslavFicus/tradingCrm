import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Types } from '@crm/common';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import {
  FormikInputField,
  FormikDateRangePicker,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import './HolidaysFilter.scss';

type Props = {
  onRefresh: () => void,
}

type FormValues = {
  description?: string,
  dateTimeRange?: {
    from?: string,
    to?: string,
  },
}

const HolidaysFilter = (props: Props) => {
  const { onRefresh } = props;

  const navigate = useNavigate();
  const state = useLocation().state as Types.State<FormValues>;

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="HolidaysFilter">
          <div className="HolidaysFilter__fields">
            <Field
              name="description"
              data-testid="HolidaysFilter-descriptionInput"
              label={I18n.t('TRADING_ENGINE.HOLIDAYS.FILTER_FORM.DESCRIPTION')}
              placeholder={I18n.t('TRADING_ENGINE.HOLIDAYS.FILTER_FORM.DESCRIPTION_PLACEHOLDER')}
              className="HolidaysFilter__field HolidaysFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              name="dateTimeRange"
              className="HolidaysFilter__field HolidaysFilter__field--large"
              data-testid="HolidaysFilter-dateTimeRangePicker"
              label={I18n.t('TRADING_ENGINE.HOLIDAYS.FILTER_FORM.DATE_TIME_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'dateTimeRange.from',
                to: 'dateTimeRange.to',
              }}
              withUtc={false}
              withFocus
            />
          </div>
          <div className="HolidaysFilter__buttons">
            <RefreshButton
              className="HolidaysFilter__button"
              data-testid="HolidaysFilter-refreshButton"
              onClick={onRefresh}
            />
            <Button
              className="HolidaysFilter__button"
              data-testid="HolidaysFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="HolidaysFilter__button"
              data-testid="HolidaysFilter-applyButton"
              type="submit"
              disabled={!dirty || isSubmitting}
              primary
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(HolidaysFilter);
