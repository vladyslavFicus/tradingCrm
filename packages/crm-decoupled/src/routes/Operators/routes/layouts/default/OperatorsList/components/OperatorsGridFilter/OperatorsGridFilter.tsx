import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
  RefreshButton,
} from 'components';
import useFilter from 'hooks/useFilter';
import useOperatorsGridFilter from 'routes/Operators/routes/hooks/useOperatorsGridFilter';
import { FormValues } from 'routes/Operators/routes/types';
import './OperatorsGridFilter.scss';

const attributeLabels = {
  department: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  roles: 'OPERATORS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

type Props = {
  onRefetch: () => void,
};

const OperatorsGridFilter = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    authorities,
    availableDepartments,
    desks,
    teams,
    offices,
    officesDesksTeamsLoading,
    handleDepartmentFieldChange,
  } = useOperatorsGridFilter();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      className="OperatorsGridFilter"
      initialValues={filters}
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
                data-testid="OperatorsGridFilter-searchByInput"
                label={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY')}
                placeholder={I18n.t('OPERATORS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                withAnyOption
                searchable
                withFocus
                name="country"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-countrySelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('OPERATORS.GRID_FILTERS.COUNTRY')}
                component={FormikSingleSelectField}
                options={[
                  { label: I18n.t('COMMON.OTHER'), value: 'UNDEFINED' },
                  ...Object.keys(Utils.countryList).map(country => ({
                    label: Utils.countryList[country],
                    value: country,
                  })),
                ]}
              />

              <Field
                withAnyOption
                searchable
                withFocus
                name="status"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-statusSelect"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('PARTNERS.GRID_FILTERS.STATUS')}
                component={FormikSingleSelectField}
                options={Object.keys(Constants.Operator.statusesLabels).map(status => ({
                  label: I18n.t(Constants.Operator.statusesLabels[status as Constants.Operator.statuses]),
                  value: status,
                }))}
              />

              <Field
                className="OperatorsGridFilter__field OperatorsGridFilter__date-range"
                data-testid="OperatorsGridFilter-registrationDateRangePicker"
                label={I18n.t('OPERATORS.GRID_FILTERS.REGISTRATION_DATE_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'registrationDateFrom',
                  to: 'registrationDateTo',
                }}
                withFocus
              />

              <Field
                withFocus
                searchable
                name="offices"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-officesSelect"
                label={I18n.t('OPERATORS.GRID_FILTERS.OFFICES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                disabled={officesDesksTeamsLoading || !offices.length}
                options={offices.map(({ name, uuid }) => ({
                  label: name,
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
                name="desks"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-desksSelect"
                label={I18n.t('OPERATORS.GRID_FILTERS.DESKS')}
                placeholder={
                  I18n.t(
                    (!officesDesksTeamsLoading && !desksOptions.length)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikMultipleSelectField}
                disabled={officesDesksTeamsLoading || !desksOptions.length}
                options={desksOptions.map(({ uuid, name }) => ({
                  label: name,
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
                name="teams"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-teamsSelect"
                label={I18n.t('OPERATORS.GRID_FILTERS.TEAMS')}
                placeholder={
                  I18n.t(
                    (!officesDesksTeamsLoading && !teamsOptions.length)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikMultipleSelectField}
                disabled={officesDesksTeamsLoading || !teamsOptions.length}
                options={teamsOptions.map(({ uuid, name }) => ({
                  label: name,
                  value: uuid,
                }))}
              />

              <Field
                withAnyOption
                searchable
                withFocus
                name="authorities.department"
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                data-testid="OperatorsGridFilter-authoritiesDepartmentSelect"
                label={I18n.t(attributeLabels.department)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSingleSelectField}
                disabled={isSubmitting}
                onChange={(value: string) => handleDepartmentFieldChange(value, setFieldValue)}
                options={Object.keys(availableDepartments).map(department => ({
                  label: I18n.t(Utils.renderLabel(department, Constants.Operator.departmentsLabels)),
                  value: department,
                }))}
              />

              <Field
                searchable
                withFocus
                name="authorities.roles"
                data-testid="OperatorsGridFilter-authoritiesRolesSelect"
                label={I18n.t(attributeLabels.roles)}
                className="OperatorsGridFilter__field OperatorsGridFilter__select"
                component={FormikMultipleSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                disabled={isSubmitting || !availableRoles.length}
                options={availableRoles.map(role => ({
                  label: I18n.t(Utils.renderLabel(role, Constants.Operator.rolesLabels)),
                  value: role,
                }))}
              />
            </div>

            <div className="OperatorsGridFilter__buttons">
              <RefreshButton
                className="OperatorsGridFilter__button"
                data-testid="OperatorsGridFilter-refreshButton"
                onClick={onRefetch}
              />

              <Button
                className="OperatorsGridFilter__button"
                data-testid="OperatorsGridFilter-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorsGridFilter__button"
                data-testid="OperatorsGridFilter-applyButton"
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
