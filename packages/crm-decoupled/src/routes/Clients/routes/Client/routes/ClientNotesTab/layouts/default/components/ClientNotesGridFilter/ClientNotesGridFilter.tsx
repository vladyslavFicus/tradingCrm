import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants } from '@crm/common';
import { Button, RefreshButton, FormikSingleSelectField, FormikDateRangePicker } from 'components';
import useFilter from 'hooks/useFilter';

import useClientNotesGridFilter
  from 'routes/Clients/routes/Client/routes/ClientNotesTab/hooks/useClientNotesGridFilter';
import { attributeLabels } from 'routes/Clients/routes/Client/routes/ClientNotesTab/constants';
import { FormValues } from 'routes/Clients/routes/Client/routes/ClientNotesTab/types';
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
        Utils.createValidator({
          department: ['string', `in:${Object.keys(departmentRoles).join()}`],
          changedAtFrom: 'dateWithTime',
          changedAtTo: 'dateWithTime',
        }, Utils.translateLabels(attributeLabels), false)
      }
      enableReinitialize
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="ClientNotesGridFilter">
          <Field
            withAnyOption
            searchable
            withFocus
            name="department"
            data-testid="ClientNotesGridFilter-departmentSelect"
            label={I18n.t(attributeLabels.department)}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            component={FormikSingleSelectField}
            className="ClientNotesGridFilter__field"
            disabled={loading}
            options={Object.keys(departmentRoles).map(department => ({
              label: I18n.t(Utils.renderLabel(department, Constants.Operator.departmentsLabels)),
              value: department,
            }))}
          />

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
