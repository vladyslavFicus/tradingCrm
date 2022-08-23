import React from 'react';
import { startCase } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import {
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
} from '../../graphql/__generated__/LeadCallHistoryQuery';
import { useClickToCallConfigQuery } from './graphql/__generated__/ClickToCallConfigQuery';
import './LeadCallHistoryGridFilter.scss';

type Props = {
  callHistoryQuery: CallHistoryQueryQueryResult
};

const LeadCallHistoryGridFilter = ({ callHistoryQuery }: Props) => {
  const { state } = useLocation<State<CallHistoryQueryVariables['args']>>();
  const history = useHistory();

  const clickToCallConfigQuery = useClickToCallConfigQuery();

  const callSystems = (clickToCallConfigQuery?.data?.clickToCall.configs || []).map(config => config.callSystem);

  const handleSubmit = (values: CallHistoryQueryVariables['args']) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    history.replace({
      state: {
        ...state,
        filters: {},
      },
    });

    resetForm();
  };

  return (
    <Formik
      className="LeadCallHistoryGridFilter"
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="LeadCallHistoryGridFilter__form">
          <Field
            name="operatorUuid"
            className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__search"
            label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY')}
            placeholder={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="callSystems"
            disabled={clickToCallConfigQuery.loading}
            className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__select"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
            component={FormikSelectField}
            searchable
            multiple
            withFocus
          >
            {callSystems.map(callSystem => (
              <option key={callSystem} value={callSystem}>
                {startCase(callSystem.toLowerCase())}
              </option>
            ))}
          </Field>
          <Field
            className="LeadCallHistoryGridFilter__field LeadCallHistoryGridFilter__date-range"
            label={I18n.t('LEAD_PROFILE.CALL_HISTORY.GRID.FILTERS.DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'callDateRange.from',
              to: 'callDateRange.to',
            }}
            withFocus
          />
          <div className="LeadCallHistoryGridFilter__buttons">
            <RefreshButton
              className="LeadCallHistoryGridFilter__button"
              onClick={callHistoryQuery.refetch}
            />
            <Button
              className="LeadCallHistoryGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="LeadCallHistoryGridFilter__button"
              disabled={isSubmitting || !dirty}
              type="submit"
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

export default React.memo(LeadCallHistoryGridFilter);