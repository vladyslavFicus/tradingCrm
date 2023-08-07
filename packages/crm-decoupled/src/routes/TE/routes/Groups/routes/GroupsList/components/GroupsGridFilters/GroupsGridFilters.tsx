import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField } from 'components/Formik';
import { Button, RefreshButton } from 'components';
import { State } from 'types';
import { GroupsQueryQueryResult, GroupsQueryVariables } from '../../graphql/__generated__/GroupsQuery';
import './GroupsGridFilters.scss';

type Props = {
  groupsListQuery: GroupsQueryQueryResult,
}

const GroupsGridFilters = ({ groupsListQuery }: Props) => {
  const state = useLocation().state as State<GroupsQueryVariables['args']>;
  const navigate = useNavigate();

  const { loading, refetch } = groupsListQuery || {};

  const handleSubmit = (values: GroupsQueryVariables['args']) => {
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
      className="GroupsGridFilters"
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="GroupsGridFilters__form">
          <div className="GroupsGridFilters__fields">
            <Field
              name="keyword"
              data-testid="GroupsGridFilters-keywordInput"
              label={I18n.t('TRADING_ENGINE.GROUPS.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.GROUPS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              className="GroupsGridFilters__fields--search"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
          </div>

          <div className="GroupsGridFilters__buttons">
            <RefreshButton
              className="GroupsGridFilters__button"
              data-testid="GroupsGridFilters-refreshButton"
              onClick={refetch}
            />

            <Button
              className="GroupsGridFilters__button"
              data-testid="GroupsGridFilters-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="GroupsGridFilters__button"
              data-testid="GroupsGridFilters-applyButton"
              disabled={loading || isSubmitting || !dirty}
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

export default React.memo(GroupsGridFilters);
