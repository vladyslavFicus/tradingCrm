import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { typesLabels } from 'constants/audit';
import { Button, RefreshButton } from 'components/Buttons';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { FeedsQueryVariables } from '../../graphql/__generated__/FeedsQuery';
import { useFeedTypesQuery } from './graphql/__generated__/FeedTypesQuery';
import './DistributionRuleFeedsFilter.scss';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const DistributionRuleFeedsFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FeedsQueryVariables>>();

  const history = useHistory();

  const { id: uuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const feedTypesQuery = useFeedTypesQuery({ variables: { uuid } });

  const feedTypes = feedTypesQuery.data?.feedTypes || {};
  const availableFeedTypes = Object.keys(feedTypes).filter(key => (!!feedTypes[key] && key !== '__typename'));

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
      className="DistributionRuleFeedsFilter"
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="DistributionRuleFeedsFilter__form">
          <Field
            name="searchBy"
            className="DistributionRuleFeedsFilter__field DistributionRuleFeedsFilter__search"
            label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY')}
            placeholder={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <Field
            name="auditLogType"
            className="DistributionRuleFeedsFilter__field DistributionRuleFeedsFilter__select"
            label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_TYPE')}
            placeholder={I18n.t('COMMON.ANY')}
            component={FormikSelectField}
            withAnyOption
            searchable
            withFocus
          >
            {availableFeedTypes.map(type => (
              <option key={type} value={type}>
                {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
              </option>
            ))}
          </Field>

          <Field
            className="DistributionRuleFeedsFilter__field DistributionRuleFeedsFilter__date-range"
            label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />

          <div className="DistributionRuleFeedsFilter__buttons">
            <RefreshButton
              className="DistributionRuleFeedsFilter__button"
              onClick={onRefetch}
            />

            <Button
              className="DistributionRuleFeedsFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="DistributionRuleFeedsFilter__button"
              disabled={isSubmitting || !dirty}
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

export default React.memo(DistributionRuleFeedsFilter);