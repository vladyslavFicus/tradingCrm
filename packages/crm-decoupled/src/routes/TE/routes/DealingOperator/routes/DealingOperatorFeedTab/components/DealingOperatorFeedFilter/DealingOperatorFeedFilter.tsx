import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Utils, Types, Constants } from '@crm/common';
import {
  Button,
  RefreshButton,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { attributeLabels } from './constants';
import { FeedFilterFormQueryVariables, useFeedFilterFormQuery } from './graphql/__generated__/FeedTypesQuery';
import './DealingOperatorFeedFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const DealingOperatorFeedFilter = ({ handleRefetch }: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as Types.State<FeedFilterFormQueryVariables>;
  const uuid = useParams().id as string;

  const feedTypesQuery = useFeedFilterFormQuery({
    variables: {
      uuid,
    },
  });
  const feedTypesList = feedTypesQuery.data?.feedTypes || [];

  const availableTypes = Object.keys(feedTypesList)
    .filter(key => feedTypesList[key] && key !== '__typename')
    .map(type => ({
      key: type,
      value: I18n.t(Utils.renderLabel(type, Constants.auditTypesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

  const handleSubmit = (values: FeedFilterFormQueryVariables) => {
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
      initialValues={state?.filters || {} as FeedFilterFormQueryVariables}
      onSubmit={handleSubmit}
      validate={
        Utils.createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
          creationDateFrom: 'dateWithTime',
          creationDateTo: 'dateWithTime',
        }, Utils.translateLabels(attributeLabels), false)
      }
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="DealingOperatorFeedFilter">
          <Field
            name="searchBy"
            className="DealingOperatorFeedFilter__field"
            data-testid="DealingOperatorFeedFilter-searchByInput"
            label={I18n.t(attributeLabels.searchBy)}
            placeholder={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            withAnyOption
            withFocus
            name="auditLogType"
            data-testid="DealingOperatorFeedFilter-auditLogTypeSelect"
            label={I18n.t(attributeLabels.actionType)}
            component={FormikSingleSelectField}
            className="DealingOperatorFeedFilter__field"
            options={availableTypes.map(({ key, value }) => ({
              label: value,
              value: key,
            }))}
          />
          <Field
            className="DealingOperatorFeedFilter__field DealingOperatorFeedFilter__field--date-range"
            data-testid="DealingOperatorFeedFilter-creationDateRangePicker"
            label={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />
          <div className="DealingOperatorFeedFilter__buttons-group">
            <RefreshButton
              className="DealingOperatorFeedFilter__button"
              data-testid="DealingOperatorFeedFilter-refreshButton"
              onClick={handleRefetch}
            />
            <Button
              className="DealingOperatorFeedFilter__button"
              data-testid="DealingOperatorFeedFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="DealingOperatorFeedFilter__button"
              data-testid="DealingOperatorFeedFilter-applyButton"
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

export default React.memo(DealingOperatorFeedFilter);
