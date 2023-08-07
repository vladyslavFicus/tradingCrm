import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { State } from 'types';
import { Button, RefreshButton } from 'components';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { attributeLabels } from './constants';
import { FeedFilterFormQueryVariables, useFeedFilterFormQuery } from './graphql/__generated__/FeedTypesQuery';
import './AccountProfileFeedGridFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const AccountProfileFeedGridFilter = ({ handleRefetch }: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as State<FeedFilterFormQueryVariables>;
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
      value: I18n.t(renderLabel(type, typesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

  const handleSubmit = (values: FeedFilterFormQueryVariables) => {
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
      initialValues={state?.filters || {} as FeedFilterFormQueryVariables}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
          creationDateFrom: 'dateWithTime',
          creationDateTo: 'dateWithTime',
          'details.orderId': ['numeric', 'min:0', 'max:999999999999999999'],
        }, translateLabels(attributeLabels), false)
      }
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="AccountProfileFeedGridFilter">
          <Field
            name="searchBy"
            className="AccountProfileFeedGridFilter__field"
            label={I18n.t(attributeLabels.searchBy)}
            placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.FEED.FILTER_FORM.LABELS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="details.orderId"
            className="AccountProfileFeedGridFilter__field"
            label={I18n.t(attributeLabels.orderId)}
            placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.FEED.FILTER_FORM.LABELS.ORDER_ID')}
            component={FormikInputField}
            withFocus
          />
          <Field
            name="auditLogType"
            label={I18n.t(attributeLabels.actionType)}
            component={FormikSelectField}
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
            className="AccountProfileFeedGridFilter__field"
            withAnyOption
            withFocus
          >
            {availableTypes.map(({ key, value }) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Field>
          <Field
            className="AccountProfileFeedGridFilter__field AccountProfileFeedGridFilter__field--date-range"
            label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />
          <div className="AccountProfileFeedGridFilter__buttons-group">
            <RefreshButton
              className="AccountProfileFeedGridFilter__button"
              onClick={handleRefetch}
            />
            <Button
              className="AccountProfileFeedGridFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AccountProfileFeedGridFilter__button"
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

export default React.memo(AccountProfileFeedGridFilter);
