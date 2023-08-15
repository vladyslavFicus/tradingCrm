import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Types } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  RefreshButton,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { TradingEngine__OperatorStatuses__Enum as OperatorStatusesEnum } from '__generated__/types';
import { useOperatorAccessDataQuery } from './graphql/__generated__/OperatorAccessDataQuery';
import './OperatorsFilter.scss';

type Props = {
  onRefresh: () => void,
}

type FormValues = {
  keyword?: string,
  statuses?: string[],
  groupNames?: string[],
  registrationDateRange?: {
    from?: string,
    to?: string,
  },
}

const OperatorsFilter = (props: Props) => {
  const { onRefresh } = props;

  const navigate = useNavigate();
  const state = useLocation().state as Types.State<FormValues>;
  const operatorAccessDataQuery = useOperatorAccessDataQuery();

  const groups = operatorAccessDataQuery.data?.tradingEngine.operatorAccessData.accessibleGroupNames || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: Utils.decodeNullValues(values),
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
        <Form className="OperatorsFilter">
          <div className="OperatorsFilter__fields">
            <Field
              name="keyword"
              label={I18n.t('TRADING_ENGINE.OPERATORS.GRID.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.OPERATORS.GRID.SEARCH_BY_PLACEHOLDER')}
              className="OperatorsFilter__field OperatorsFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              searchable
              withFocus
              name="groupNames"
              label={I18n.t('TRADING_ENGINE.OPERATORS.GRID.GROUP')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OperatorsFilter__field"
              component={FormikMultipleSelectField}
              options={groups.map(groupName => ({
                label: I18n.t(groupName),
                value: groupName,
              }))}
            />
            <Field
              searchable
              withFocus
              name="statuses"
              label={I18n.t('TRADING_ENGINE.OPERATORS.GRID.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OperatorsFilter__field"
              component={FormikMultipleSelectField}
              options={Utils.enumToArray(OperatorStatusesEnum).map(status => ({
                label: I18n.t(status),
                value: status,
              }))}
            />
            <Field
              name="registrationDateRange"
              className="OperatorsFilter__field OperatorsFilter__date-range"
              label={I18n.t('TRADING_ENGINE.OPERATORS.GRID.REGISTRATION_DATE_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'registrationDateRange.from',
                to: 'registrationDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="OperatorsFilter__buttons">
            <RefreshButton
              className="OperatorsFilter__button"
              onClick={onRefresh}
            />
            <Button
              className="OperatorsFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="OperatorsFilter__button"
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

export default React.memo(OperatorsFilter);
