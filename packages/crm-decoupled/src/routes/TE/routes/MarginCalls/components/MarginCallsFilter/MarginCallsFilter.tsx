import React from 'react';
import I18n from 'i18n-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Utils, Types } from '@crm/common';
import { Button, FormikMultipleSelectField, RefreshButton, FormikInputField } from 'components';
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

  const state = useLocation().state as Types.State<FormValues>;
  const navigate = useNavigate();

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
        <Form className="MarginCallsFilter">
          <div className="MarginCallsFilter__fields">
            <Field
              name="keyword"
              data-testid="MarginCallsFilter-keywordInput"
              label={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              className="MarginCallsFilter__field MarginCallsFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              searchable
              withFocus
              name="groups"
              data-testid="MarginCallsFilter-groupsSelect"
              label={I18n.t('TRADING_ENGINE.MARGIN_CALLS.FORM.FIELDS.GROUPS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              disabled={groupsQuery.loading}
              className="MarginCallsFilter__field"
              component={FormikMultipleSelectField}
              options={groups.map(({ groupName }) => ({
                label: I18n.t(groupName),
                value: groupName,
              }))}
            />
          </div>
          <div className="MarginCallsFilter__buttons">
            <RefreshButton
              className="MarginCallsFilter__button"
              data-testid="MarginCallsFilter-refreshButton"
              onClick={onRefresh}
            />
            <Button
              className="MarginCallsFilter__button"
              data-testid="MarginCallsFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="MarginCallsFilter__button"
              data-testid="MarginCallsFilter-applyButton"
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
