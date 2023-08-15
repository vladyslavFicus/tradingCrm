import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Utils } from '@crm/common';
import {
  Button,
  FormikSingleSelectField,
  RefreshButton,
  FormikDateRangePicker,
  FormikInputField,
} from 'components';
import { Feed__AuditCategory__Enum as FeedAuditCategoryEnum } from '__generated__/types';
import useFeedsFilters from '../../../hooks/useFeedsFilters';
import './FeedsFilters.scss';

type Props = {
  targetUUID: string,
  skipCategoryFilter: boolean,
  auditCategory?: FeedAuditCategoryEnum,
  onRefetch: () => void,
};

const FeedsFilters = (props: Props) => {
  const { targetUUID, skipCategoryFilter, auditCategory, onRefetch } = props;

  const { initialValues, feedTypesList, availableTypes, handleSubmit, handleReset } = useFeedsFilters(
    { targetUUID, skipCategoryFilter, auditCategory },
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={
        Utils.createValidator({
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
              withAnyOption
              withFocus
              name="auditLogType"
              className="FeedsFilters__field"
              data-testid="FeedsFilters-auditLogTypeSelect"
              label={I18n.t('COMMON.FEEDS.FILTERS.ACTION_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSingleSelectField}
              options={availableTypes.map(({ key, value }) => ({
                label: value,
                value: key,
              }))}
            />
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
