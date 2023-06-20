import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import { departmentsLabels } from 'constants/operators';
import { ClientNotesQueryVariables } from '../../graphql/__generated__/ClientNotesQuery';
import { attributeLabels } from './constants';
import { useAuthoritiesOptionsQuery } from './graphql/__generated__/AuthorityOptionsQuery';
import './ClientNotesGridFilter.scss';

type FormValues = {
  department?: string,
  changedAtFrom?: string,
  changedAtTo?: string,
};

type Props = {
  onRefetch: () => void,
};

const ClientNotesGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<ClientNotesQueryVariables>>();

  const history = useHistory();

  // ===== Permissions ===== //
  const permission = usePermission();
  const deniesAuthoritiesOptions = permission.denies(permissions.AUTH.GET_AUTHORITIES);

  // ===== Requests ===== //
  const { data, loading } = useAuthoritiesOptionsQuery({ skip: deniesAuthoritiesOptions });
  const allDepartmentRoles = data?.authoritiesOptions || {};
  const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

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
      initialValues={state?.filters || {}}
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
