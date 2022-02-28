import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { QueryResult, ApolloQueryResult } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { State } from 'types';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { IpWhitelistFeedFilters } from '../types';
import IpWhitelistFiltersQuery from './graphql/IpWhitelistFiltersQuery';
import './IpWhitelistFeedsFilters.scss';

type FeedTypes = { feedTypes?: { [key: string]: string } };
type Props = {
  feedTypesQuery: QueryResult<FeedTypes>
  refetch: (variables: IpWhitelistFeedFilters) => Promise<ApolloQueryResult<IpWhitelistFeedFilters>>,
};

const IpWhitelistFeedsFilters = ({ feedTypesQuery, refetch }: Props) => {
  const { state } = useLocation<State<IpWhitelistFeedFilters>>();
  const history = useHistory();

  const handleSubmit = (values: IpWhitelistFeedFilters) => {
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

  const feedTypesList = feedTypesQuery.data?.feedTypes || {};
  const availableTypes = Object.keys(feedTypesList)
    .filter(key => feedTypesList[key] && key !== '__typename')
    .map(type => ({
      key: type,
      value: I18n.t(renderLabel(type, typesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()
            }`],
          creationDateFrom: 'dateWithTime',
          creationDateTo: 'dateWithTime',
        }, false)
      }
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="IpWhitelistFeedsFilters">
          <Field
            name="searchBy"
            className="IpWhitelistFeedsFilters__field"
            label={I18n.t('IP_WHITELIST.FEED.FILTER_FORM.LABELS.SEARCH_BY')}
            placeholder={I18n.t('IP_WHITELIST.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="auditLogType"
            label={I18n.t('IP_WHITELIST.FEED.FILTER_FORM.LABELS.ACTION_TYPE')}
            component={FormikSelectField}
            className="IpWhitelistFeedsFilters__field"
            withAnyOption
            withFocus
          >
            {availableTypes.map(({ key, value }) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Field>
          <Field
            className="IpWhitelistFeedsFilters__field IpWhitelistFeedsFilters__field--date-range"
            label={I18n.t('IP_WHITELIST.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />
          <div className="IpWhitelistFeedsFilters__buttons-group">
            <RefreshButton
              className="IpWhitelistFeedsFilters__button"
              onClick={refetch}
            />
            <Button
              className="IpWhitelistFeedsFilters__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="IpWhitelistFeedsFilters__button"
              disabled={isSubmitting || !dirty}
              primary
              type="submit"
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default compose(
  React.memo,
  withRouter,
  withRequests({
    feedTypesQuery: IpWhitelistFiltersQuery,
  }),
)(IpWhitelistFeedsFilters);
