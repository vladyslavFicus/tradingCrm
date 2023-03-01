import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { getBrand } from 'config';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { FeedsQueryVariables } from '../../graphql/__generated__/FeedsQuery';
import { useFeedTypesQuery } from './graphql/__generated__/FeedTypesQuery';
import './IpWhitelistFeedsFilters.scss';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const IpWhitelistFeedsFilters = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FeedsQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const feedTypesQuery = useFeedTypesQuery({ variables: { uuid: getBrand().id } });

  const feedTypesList = feedTypesQuery.data?.feedTypes || {};
  const availableTypes = Object.keys(feedTypesList)
    .filter(key => feedTypesList[key] && key !== '__typename')
    .map(type => ({
      key: type,
      value: I18n.t(renderLabel(type, typesLabels)),
    }))
    .sort(({ value: a }, { value: b }) => (a > b ? 1 : -1));

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: ResetForm<FormValues>) => {
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
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          searchBy: 'string',
          auditLogType: ['string', `in:${Object.keys(feedTypesList).join()}`],
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
            placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
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
              onClick={onRefetch}
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

export default React.memo(IpWhitelistFeedsFilters);