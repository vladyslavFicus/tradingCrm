import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import { Constants } from '@crm/common';
import {
  Button,
  FormikMultipleSelectField,
  FormikInputField,
  FormikDateRangePicker,
  RefreshButton,
} from 'components';
import useFilter from 'hooks/useFilter';
import useNotificationsGridFilters from 'routes/Notifications/hooks/useNotificationsGridFilters';
import { FormValues } from 'routes/Notifications/types/notificationGridFilters';
import './NotificationsGridFilters.scss';

type Props = {
  onRefetch: () => void,
};

const NotificationsGridFilters = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    teams,
    desks,
    notificationTypes,
    notificationTypesData,
    notificationTypesLoading,
    desksTeamsLoading,
    operatorsLoading,
    filterOperators,
  } = useNotificationsGridFilters();

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
      {({ values, isSubmitting, resetForm, dirty }) => {
        const desksUuids = values.operatorDesks || [];
        const teamsByDesks = teams.filter(team => team.parentBranch && desksUuids.includes(team.parentBranch.uuid));
        const teamsOptions = desksUuids.length ? teamsByDesks : teams;
        const operatorsOptions = filterOperators(values);
        const notificationSubtypes = (values.notificationTypes || notificationTypes)
          .map(type => notificationTypesData[type])
          .flat(Infinity);

        return (
          <Form className="NotificationsGridFilters__form">
            <div className="NotificationsGridFilters__fields">
              <Field
                name="searchKeyword"
                className="NotificationsGridFilters__field NotificationsGridFilters__search"
                data-testid="NotificationsGridFilters-searchKeywordInput"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.SEARCH')}
                placeholder={I18n.t('NOTIFICATION_CENTER.FILTERS.PLACEHOLDERS.NOTIFICATION_OR_PLAYER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                searchable
                withFocus
                name="operatorDesks"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-operatorDesksSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.DESKS')}
                placeholder={
                  I18n.t(
                    (!desksTeamsLoading && !desks.length)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikMultipleSelectField}
                disabled={desksTeamsLoading || !desks.length}
                options={desks.map(({ uuid, name }) => ({
                  label: I18n.t(name),
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
                name="operatorTeams"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-operatorTeamsSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.TEAMS')}
                placeholder={
                  I18n.t(
                    (!desksTeamsLoading && !teamsOptions.length)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikMultipleSelectField}
                disabled={desksTeamsLoading || !teamsOptions.length}
                options={teamsOptions.map(({ uuid, name }) => ({
                  label: I18n.t(name),
                  value: uuid,
                }))}
              />

              <Field
                searchable
                withFocus
                name="operators"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-operatorsSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.OPERATORS')}
                placeholder={
                  I18n.t(
                    (!operatorsLoading && !operatorsOptions.length)
                      ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                      : 'COMMON.SELECT_OPTION.ANY',
                  )
                }
                component={FormikMultipleSelectField}
                disabled={operatorsLoading || !operatorsOptions.length}
                options={operatorsOptions.map(({ uuid, fullName, operatorStatus }) => ({
                  label: fullName,
                  value: uuid,
                  className: classNames('NotificationsGridFilters__select-option', {
                    'NotificationsGridFilters__select-option--inactive': operatorStatus
                    !== Constants.Operator.statuses.ACTIVE,
                  }),
                }))}
              />

              <Field
                searchable
                withFocus
                name="notificationTypes"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-notificationTypesSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                disabled={notificationTypesLoading}
                options={notificationTypes.map(type => ({
                  label: I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`),
                  value: type,
                }))}
              />

              <Field
                searchable
                withFocus
                name="notificationSubtypes"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-notificationSubtypesSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE_DETAILS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikMultipleSelectField}
                disabled={notificationTypesLoading || !notificationSubtypes.length}
                options={notificationSubtypes.map(subtype => ({
                  label: I18n.t(`NOTIFICATION_CENTER.TYPES.${subtype}`),
                  value: subtype,
                }))}
              />

              <Field
                className="NotificationsGridFilters__field NotificationsGridFilters__date-range"
                data-testid="NotificationsFilters-creationDateRangePicker"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.CREATION_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'creationDateRange.from',
                  to: 'creationDateRange.to',
                }}
                withFocus
              />
            </div>

            <div className="NotificationsGridFilters__buttons">
              <RefreshButton
                className="NotificationsGridFilters__button"
                data-testid="NotificationsFilters-refreshButton"
                onClick={onRefetch}
              />

              <Button
                className="NotificationsGridFilters__button"
                data-testid="NotificationsFilters-resetButton"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                data-testid="NotificationsFilters-applyButton"
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

export default React.memo(NotificationsGridFilters);
