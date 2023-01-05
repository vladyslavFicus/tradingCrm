import React from 'react';
import I18n from 'i18n-js';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import {
  FormikInputField,
  FormikSelectField,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import './MarginCallsFilter.scss';

type FormValues = {
  keyword?: string,
  groups?: string[],
}

type Props = {
  onRefresh: () => void,
}

const MarginCallsFilter = (props: Props) => {
  const { onRefresh } = props;

  const { state } = useLocation<State<FormValues>>();
  const history = useHistory();

  const groupsQuery = useGroupsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 100000,
        },
      },
    },
  });

  const groups = groupsQuery.data?.tradingEngine.groups.content || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
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
        <Form className="MarginCallsFilter">
          <div className="MarginCallsFilter__fields">
            <Field
              name="keyword"
              label={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              className="MarginCallsFilter__field MarginCallsFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              name="groups"
              label={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.GROUPS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              disabled={groupsQuery.loading}
              className="MarginCallsFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              multiple
            >
              {groups.map(({ groupName }) => (
                <option key={groupName} value={groupName}>
                  {I18n.t(groupName)}
                </option>
              ))}
            </Field>
          </div>
          <div className="MarginCallsFilter__buttons">
            <RefreshButton
              className="MarginCallsFilter__button"
              onClick={onRefresh}
            />
            <Button
              className="MarginCallsFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="MarginCallsFilter__button"
              type="submit"
              disabled={isSubmitting || !dirty}
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

export default React.memo(MarginCallsFilter);
