import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import { ResetForm } from 'types/formik';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { createValidator } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { typesLabels } from 'constants/audit';
import { FeedsQueryVariables } from '../../graphql/__generated__/FeedsQuery';
import { useFeedTypesQuery } from './graphql/__generated__/FeedTypesQuery';
import './FeedsFilters.scss';

type FormValues = {
  searchBy?: string,
  auditLogType?: string,
  creationDateFrom?: string,
  creationDateTo?: string,
};

type Props = {
  targetUUID: string,
  skipCategoryFilter: boolean,
  auditCategory?: FeedAuditCategoryEnum,
  onRefetch: () => void,
};

const FeedsFilters = (props: Props) => {
  const { targetUUID, skipCategoryFilter, auditCategory, onRefetch } = props;

  const { state } = useLocation<State<FeedsQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const feedTypesQuery = useFeedTypesQuery({
    variables: {
      uuid: targetUUID,
      filters: {
        ...(auditCategory && { auditCategory }),
      },
    },
    skip: skipCategoryFilter,
  });

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
        <Form className="FeedsFilters">
          <Field
            name="searchBy"
            className="FeedsFilters__field FeedsFilters__field--search-by"
            data-testid="FeedsFilters-searchByInput"
            label={I18n.t('COMMON.FEEDS.FILTERS.SEARCH_BY')}
            placeholder={I18n.t('COMMON.FEEDS.FILTERS.SEARCH_BY_PLACEHOLDER')}
            addition={<i className="icon icon-search" />}
            component={FormikInputField}
            withFocus
          />

          <If condition={!skipCategoryFilter}>
            <Field
              name="auditLogType"
              className="FeedsFilters__field"
              data-testid="FeedsFilters-auditLogTypeSelect"
              label={I18n.t('COMMON.FEEDS.FILTERS.ACTION_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {availableTypes.map(({ key, value }) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Field>
          </If>

          <Field
            className="FeedsFilters__field FeedsFilters__field--date-range"
            data-testid="FeedsFilters-creationDateRangePicker"
            label={I18n.t('COMMON.FEEDS.FILTERS.ACTION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'creationDateFrom',
              to: 'creationDateTo',
            }}
            withFocus
          />

          <div className="FeedsFilters__buttons-group">
            <RefreshButton
              className="FeedsFilters__button"
              data-testid="FeedsFilters-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="FeedsFilters__button"
              data-testid="FeedsFilters-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="FeedsFilters__button"
              data-testid="FeedsFilters-applyButton"
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

export default React.memo(FeedsFilters);
