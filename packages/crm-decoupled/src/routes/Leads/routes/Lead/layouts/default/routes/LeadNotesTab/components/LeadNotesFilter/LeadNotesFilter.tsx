import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, RefreshButton } from 'components';
import useFilter from 'hooks/useFilter';
import { FormikDateRangePicker } from 'components/Formik';
import { FormValues } from 'routes/Leads/routes/Lead/types/leadNotesFilter';
import './LeadNotesFilter.scss';

type Props = {
  onRefetch: () => void,
};

const LeadNotesFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      initialValues={filters}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="LeadNotesFilter">
          <Field
            className="LeadNotesFilter__field LeadNotesFilter__date-range"
            data-testid="LeadNotesFilter-changeAtDateRangePicker"
            label={I18n.t('LEAD_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'changedAtFrom',
              to: 'changedAtTo',
            }}
            withFocus
          />

          <div className="LeadNotesFilter__buttons">
            <RefreshButton
              className="LeadNotesFilter__button"
              data-testid="LeadNotesFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="LeadNotesFilter__button"
              data-testid="LeadNotesFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadNotesFilter__button"
              data-testid="LeadNotesFilter-applyButton"
              type="submit"
              primary
              disabled={isSubmitting || !dirty}
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(LeadNotesFilter);
