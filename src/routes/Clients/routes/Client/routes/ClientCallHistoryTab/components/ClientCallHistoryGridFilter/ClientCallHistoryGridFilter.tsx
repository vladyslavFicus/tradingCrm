import React from 'react';
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
} from '../../graphql/__generated__/ClientCallHistoryQuery';
import { CallSystems } from '../../constants';
import './ClientCallHistoryGridFilter.scss';

type Props = {
  callHistory: CallHistoryQueryQueryResult
};

const ClientCallHistoryGridFilter = ({ callHistory }: Props) => {
  const { state } = useLocation<State<CallHistoryQueryVariables['args']>>();
  const history = useHistory();

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
      className="ClientCallHistoryGridFilter"
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
        <Form className="ClientCallHistoryGridFilter__form">
          <Field
            name="operatorUuid"
            className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__search"
            label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY')}
            placeholder={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="callSystems"
            className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__select"
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.CALL_SYSTEM')}
            component={FormikSelectField}
            searchable
            multiple
            withFocus
          >
            {CallSystems.map(provider => (
              <option key={provider} value={provider}>{I18n.t(provider)}</option>
            ))}
          </Field>
          <Field
            className="ClientCallHistoryGridFilter__field ClientCallHistoryGridFilter__date-range"
            label={I18n.t('CLIENT_PROFILE.CALL_HISTORY.GRID.FILTERS.DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'callDateRange.from',
              to: 'callDateRange.to',
            }}
            withFocus
          />
          <div className="ClientCallHistoryGridFilter__buttons">
            <RefreshButton
              className="ClientCallHistoryGridFilter__button"
              onClick={callHistory.refetch}
            />
            <Button
              className="ClientCallHistoryGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="ClientCallHistoryGridFilter__button"
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

export default React.memo(ClientCallHistoryGridFilter);
