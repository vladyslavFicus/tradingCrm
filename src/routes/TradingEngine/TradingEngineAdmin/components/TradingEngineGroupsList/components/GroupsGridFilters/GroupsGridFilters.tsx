import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import { LocationState } from 'types/location';
import { GroupsQueryResult } from '../../types/group';
import './GroupsGridFilters.scss';

interface Props {
  groupsListQuery: GroupsQueryResult,
}

const GroupsGridFilters = ({ groupsListQuery }: Props) => {
  const { state } = useLocation<LocationState>();
  const history = useHistory();

  const { loading, refetch } = groupsListQuery || {};

  const handleSubmit = (values: Object) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: () => void) => {
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
              onClick={refetch}
            />

            <Button
              className="GroupsGridFilters__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="GroupsGridFilters__button"
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
