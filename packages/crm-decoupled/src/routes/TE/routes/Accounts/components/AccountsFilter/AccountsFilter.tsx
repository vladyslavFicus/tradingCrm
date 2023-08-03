import React from 'react';
import I18n from 'i18n-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import {
  FormikDateRangePicker,
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { statuses } from '../../constants';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import './AccountsFilter.scss';

type Props = {
  handleRefetch: () => void,
  loading: boolean,
}

interface InitialFormValues {
  keyword?: string,
  enabled?: boolean,
  groups?: string[],
  registrationDateRange?: {
    from?: string,
    to?: string,
  },
}

const AccountsFilter = (props: Props) => {
  const { handleRefetch, loading } = props;

  const navigate = useNavigate();
  const state = useLocation().state as State<InitialFormValues>;

  const groupsQuery = useGroupsQuery({
    variables: {
      args: {
        enabled: true,
        page: {
          from: 0,
          size: 100000,
        },
      },
    },
  });

  const groups = groupsQuery.data?.tradingEngine.groups.content || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: InitialFormValues) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: () => void) => {
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
        <Form className="AccountsFilter__form">
          <div className="AccountsFilter__fields">
            <Field
              name="keyword"
              label={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              className="AccountsFilter__field AccountsFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              name="enabled"
              label={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountsFilter__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
              boolean
            >
              {statuses.map(({ value, label }) => (
                // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
                <option key={`archived-${value}`} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
            <Field
              name="groups"
              label={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.GROUPS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountsFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              multiple
              disabled={groupsQuery.loading}
            >
              {groups.map(({ groupName }) => (
                <option key={groupName} value={groupName}>
                  {groupName}
                </option>
              ))}
            </Field>
            <Field
              name="registrationDateRange"
              className="AccountsFilter__field AccountsFilter__field--large"
              label={I18n.t('TRADING_ENGINE.ACCOUNTS.FORM.FIELDS.REGISTRATION_DATE_RANGE')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'registrationDateRange.from',
                to: 'registrationDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="AccountsFilter__buttons">
            <RefreshButton
              className="AccountsFilter__button"
              onClick={handleRefetch}
            />

            <Button
              className="AccountsFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AccountsFilter__button"
              type="submit"
              disabled={loading || isSubmitting || !dirty}
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

export default React.memo(AccountsFilter);
