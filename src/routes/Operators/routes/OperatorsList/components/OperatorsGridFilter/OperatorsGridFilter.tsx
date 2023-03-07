import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { omit } from 'lodash';
import { State } from 'types';
import { ResetForm, SetFieldValue } from 'types/formik';
import { departmentsLabels, rolesLabels, statusesLabels, statuses } from 'constants/operators';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { OperatorsQueryVariables } from '../../graphql/__generated__/OperatorsQuery';
import { useAuthoritiesOptionsQuery } from './graphql/__generated__/AuthoritiesOptionsQuery';
import { useOfficesDesksTeamsQuery } from './graphql/__generated__/OfficesDesksTeamsQuery';
import './OperatorsGridFilter.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  roles: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

// unAvailableDepartments - is departments that can't be set to Operator
const unAvailableDepartments = ['AFFILIATE', 'AFFILIATE_MANAGER', 'CDE', 'BI', 'RBAC'];

type FormValues = {
  searchBy?: string,
  country?: string,
  status?: string,
  offices?: Array<string>,
  desks?: Array<string>,
  teams?: Array<string>,
  authorities?: {
    department?: string,
    roles?: Array<string>,
  },
};

type Props = {
  onRefetch: () => void,
};

const OperatorsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<OperatorsQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const authoritiesQuery = useAuthoritiesOptionsQuery();

  const authorities: Record<string, Array<string>> = authoritiesQuery?.data?.authoritiesOptions || {};
  const allDepartmentRoles = authoritiesQuery?.data?.authoritiesOptions || {};
  const availableDepartments = omit(allDepartmentRoles, unAvailableDepartments);

  const officesDesksTeamsQuery = useOfficesDesksTeamsQuery();

  const desks = officesDesksTeamsQuery.data?.userBranches?.DESK || [];
  const teams = officesDesksTeamsQuery.data?.userBranches?.TEAM || [];
  const offices = officesDesksTeamsQuery.data?.userBranches?.OFFICE || [];

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

  // ===== Handlers ===== //
  const handleDepartmentFieldChange = (value: string, setFieldValue: SetFieldValue<FormValues>) => {
    if (value) {
      setFieldValue('authorities.department', value);
      setFieldValue('authorities.roles', undefined);
    } else {
      setFieldValue('authorities', undefined);
    }
  };

  return (
    <Formik
      className="OperatorsGridFilter"
      initialValues={state?.filters as FormValues || {}}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        isSubmitting,
        resetForm,
        values,
        setFieldValue,
        dirty,
      }) => {
        const desksUuids = values.desks || [];
        const officesUuids = values.offices || [];
        const desksByOffices = desks.filter(desk => desk.parentBranch && officesUuids.includes(desk.parentBranch.uuid));
        const teamsByDesks = teams.filter(team => team.parentBranch && desksUuids.includes(team.parentBranch.uuid));
        const desksOptions = officesUuids.length ? desksByOffices : desks;
        const teamsOptions = desksUuids.length ? teamsByDesks : teams;
        const availableRoles = values?.authorities?.department ? authorities[values?.authorities?.department] : [];

        return (
          <Form className="OperatorsGridFilter__form">
            <div className="OperatorsGridFilter__fields">
              <Field
                name="searchBy"
                className="OperatorsGridFilter__field OperatorsGridFilter__search"
                label={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="country"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('OPERATORS.GRID_FILTERS.COUNTRY')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {[
                  <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                  ...Object.keys(countryList)
                    .map(country => (
                      <option key={country} value={country}>{countryList[country]}</option>
                    )),
                ]}
              </Field>

              <Field
                name="status"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {Object.keys(statusesLabels).map(status => (
                  <option key={status} value={status}>{I18n.t(statusesLabels[status as statuses])}</option>
                ))}
              </Field>

              <Field
                className="OperatorsGridFilter__field OperatorsGridFilter__date-range"
                label={I18n.t('OPERATORS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'registrationDateFrom',
                  to: 'registrationDateTo',
                }}
                withFocus
              />

              <Field
                name="offices"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                label={I18n.t('OPERATORS.GRID_FILTERS.OFFICES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={officesDesksTeamsQuery.loading || offices.length === 0}
                withFocus
                multiple
                searchable
              >
                {offices.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>
                    {name}
                  </option>
                ))}
              </Field>

              <Field
                name="desks"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                label={I18n.t('OPERATORS.GRID_FILTERS.DESKS')}
                placeholder={
                  I18n.t(
                    (!officesDesksTeamsQuery.loading && desksOptions.length === 0)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikSelectField}
                disabled={officesDesksTeamsQuery.loading || desksOptions.length === 0}
                searchable
                withFocus
                multiple
              >
                {desksOptions.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>

              <Field
                name="teams"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                label={I18n.t('OPERATORS.GRID_FILTERS.TEAMS')}
                placeholder={
                  I18n.t(
                    (!officesDesksTeamsQuery.loading && teamsOptions.length === 0)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikSelectField}
                disabled={officesDesksTeamsQuery.loading || teamsOptions.length === 0}
                searchable
                withFocus
                multiple
              >
                {teamsOptions.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>

              <Field
                name="authorities.department"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                label={I18n.t(attributeLabels.department)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={isSubmitting}
                withAnyOption
                customOnChange={(value: string) => handleDepartmentFieldChange(value, setFieldValue)}
                searchable
                withFocus
              >
                {Object.keys(availableDepartments).map(department => (
                  <option key={department} value={department}>
                    {I18n.t(renderLabel(department, departmentsLabels))}
                  </option>
                ))}
              </Field>

              <Field
                name="authorities.roles"
                label={I18n.t(attributeLabels.roles)}
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                component={FormikSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                disabled={isSubmitting || !availableRoles.length}
                searchable
                withFocus
                multiple
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>
                    {I18n.t(renderLabel(role, rolesLabels))}
                  </option>
                ))}
              </Field>
            </div>

            <div className="OperatorsGridFilter__buttons">
              <RefreshButton
                className="OperatorsGridFilter__button"
                onClick={onRefetch}
              />

              <Button
                className="OperatorsGridFilter__button"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorsGridFilter__button"
                disabled={isSubmitting || !dirty}
                type="submit"
                primary
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default React.memo(OperatorsGridFilter);
