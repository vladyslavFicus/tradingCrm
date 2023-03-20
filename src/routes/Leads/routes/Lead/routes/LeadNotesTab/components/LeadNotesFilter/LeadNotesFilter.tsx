import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { decodeNullValues } from 'components/Formik/utils';
import { LeadNotesQueryVariables } from '../../graphql/__generated__/LeadNotesQuery';
import './LeadNotesFilter.scss';

type FormValues = {
  changedAtFrom?: string,
  changedAtTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const LeadNotesFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<LeadNotesQueryVariables>>();

  const history = useHistory();

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
        <Form className="LeadNotesFilter">
          <Field
            className="LeadNotesFilter__field LeadNotesFilter__date-range"
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
              onClick={onRefetch}
            />

            <Button
              className="LeadNotesFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="LeadNotesFilter__button"
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
