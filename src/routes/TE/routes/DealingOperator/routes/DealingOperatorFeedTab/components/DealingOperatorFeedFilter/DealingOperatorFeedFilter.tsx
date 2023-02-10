import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { State } from 'types';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { attributeLabels } from './constants';
import { FeedFilterFormQueryVariables, useFeedFilterFormQuery } from './graphql/__generated__/FeedTypesQuery';
import './DealingOperatorFeedFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const DealingOperatorFeedFilter = ({ handleRefetch }: Props) => {
  const history = useHistory();
  const { state } = useLocation<State<FeedFilterFormQueryVariables>>();
  const { id: uuid } = useParams<{ id: string }>();

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
      value: I18n.t(renderLabel(type, typesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

  const handleSubmit = (values: FeedFilterFormQueryVariables) => {
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
      initialValues={state?.filters || {} as FeedFilterFormQueryVariables}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
          creationDateFrom: 'dateWithTime',
          creationDateTo: 'dateWithTime',
        }, translateLabels(attributeLabels), false)
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
            label={I18n.t(attributeLabels.searchBy)}
            placeholder={I18n.t('TRADING_ENGINE.OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="auditLogType"
            label={I18n.t(attributeLabels.actionType)}
            component={FormikSelectField}
            className="DealingOperatorFeedFilter__field"
            withAnyOption
            withFocus
          >
            {availableTypes.map(({ key, value }) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Field>
          <Field
            className="DealingOperatorFeedFilter__field DealingOperatorFeedFilter__field--date-range"
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
              onClick={handleRefetch}
            />
            <Button
              className="DealingOperatorFeedFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="DealingOperatorFeedFilter__button"
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
