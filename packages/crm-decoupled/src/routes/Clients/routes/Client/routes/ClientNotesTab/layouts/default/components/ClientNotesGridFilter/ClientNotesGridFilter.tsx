import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import useFilter from 'hooks/useFilter';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components';
import useClientNotesGridFilter
  from 'routes/Clients/routes/Client/routes/ClientNotesTab/hooks/useClientNotesGridFilter';
import { attributeLabels } from 'routes/Clients/routes/Client/routes/ClientNotesTab/constants';
import { FormValues } from 'routes/Clients/routes/Client/routes/ClientNotesTab/types';
import { departmentsLabels } from 'constants/operators';
import './ClientNotesGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const ClientNotesGridFilter = (props: Props) => {
  const { onRefetch } = props;
  const {
    loading,
    departmentRoles,
  } = useClientNotesGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      initialValues={filters}
      onSubmit={handleSubmit}
      validate={
        createValidator({
          department: ['string', `in:${Object.keys(departmentRoles).join()}`],
          changedAtFrom: 'dateWithTime',
          changedAtTo: 'dateWithTime',
        }, translateLabels(attributeLabels), false)
      }
      enableReinitialize
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="ClientNotesGridFilter">
          <Field
            name="department"
            data-testid="ClientNotesGridFilter-departmentSelect"
            label={I18n.t(attributeLabels.department)}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            component={FormikSelectField}
            className="ClientNotesGridFilter__field"
            disabled={loading}
            withAnyOption
            searchable
            withFocus
          >
            {Object.keys(departmentRoles).map(department => (
              <option key={department} value={department}>
                {I18n.t(renderLabel(department, departmentsLabels))}
              </option>
            ))}
          </Field>

          <Field
            className="ClientNotesGridFilter__field ClientNotesGridFilter__field--date-range"
            data-testid="ClientNotesGridFilter-changedAtDateRangePicker"
            label={I18n.t('PLAYER_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
            component={FormikDateRangePicker}
            fieldsNames={{
              from: 'changedAtFrom',
              to: 'changedAtTo',
            }}
            withFocus
          />

          <div className="ClientNotesGridFilter__buttons-group">
            <RefreshButton
              className="ClientNotesGridFilter__button"
              data-testid="ClientNotesGridFilter-refreshButton"
              onClick={onRefetch}
            />

            <Button
              className="ClientNotesGridFilter__button"
              data-testid="ClientNotesGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="ClientNotesGridFilter__button"
              data-testid="ClientNotesGridFilter-applyButton"
              type="submit"
              disabled={isSubmitting || !dirty}
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

export default React.memo(ClientNotesGridFilter);
