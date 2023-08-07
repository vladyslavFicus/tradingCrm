import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import useFilter from 'hooks/useFilter';
import { FormikDateRangePicker, FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components';
import useNotificationsGridFilters from 'routes/Notifications/hooks/useNotificationsGridFilters';
import { FormValues } from 'routes/Notifications/types/notificationGridFilters';
import { statuses as operatorsStasuses } from 'constants/operators';
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
                component={FormikSelectField}
                disabled={desksTeamsLoading || !desks.length}
                searchable
                withFocus
                multiple
              >
                {desks.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {I18n.t(name)}
                  </option>
                ))}
              </Field>

              <Field
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
                component={FormikSelectField}
                disabled={desksTeamsLoading || !teamsOptions.length}
                searchable
                withFocus
                multiple
              >
                {teamsOptions.map(({ uuid, name }) => (
                  <option key={uuid} value={uuid}>
                    {I18n.t(name)}
                  </option>
                ))}
              </Field>

              <Field
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
                component={FormikSelectField}
                disabled={operatorsLoading || !operatorsOptions.length}
                searchable
                withFocus
                multiple
              >
                {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={classNames('NotificationsGridFilters__select-option', {
                      'NotificationsGridFilters__select-option--inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                    })}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="notificationTypes"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-notificationTypesSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={notificationTypesLoading}
                searchable
                withFocus
                multiple
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>
                    {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
                  </option>
                ))}
              </Field>

              <Field
                name="notificationSubtypes"
                className="NotificationsGridFilters__field NotificationsGridFilters__select"
                data-testid="NotificationsFilters-notificationSubtypesSelect"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE_DETAILS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={notificationTypesLoading || !notificationSubtypes.length}
                searchable
                withFocus
                multiple
              >
                {notificationSubtypes.map(subtype => (
                  <option key={subtype} value={subtype}>
                    {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
                  </option>
                ))}
              </Field>

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
