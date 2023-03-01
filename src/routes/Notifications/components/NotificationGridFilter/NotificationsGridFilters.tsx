import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { intersection } from 'lodash';
import { Formik, Form, Field } from 'formik';
import classNames from 'classnames';
import { State } from 'types';
import { ResetForm } from 'types/formik';
import { statuses as operatorsStasuses } from 'constants/operators';
import { decodeNullValues } from 'components/Formik/utils';
import { FormikDateRangePicker, FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components/Buttons';
import { NotificationsQueryVariables } from '../../graphql/__generated__/NotificationsQuery';
import { OPERATORS_SORT } from './constants';
import { useNotificationTypesQuery } from './graphql/__generated__/NotificationTypesQuery';
import { useDesksTeamsQuery } from './graphql/__generated__/DesksTeamsQuery';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import './NotificationsGridFilters.scss';

type FormValues = {
  searchKeyword?: string,
  operatorDesks?: Array<string>,
  operatorTeams?: Array<string>,
  operators?: Array<string>,
  notificationTypes?: Array<string>,
  notificationSubtypes?: Array<string>,
  creationDateRange?: {
    from?: string,
    to?: string,
  },
};

type Props = {
  onRefetch: () => void,
};

const NotificationsFilters = (props: Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<NotificationsQueryVariables>>();

  const history = useHistory();

  // ===== Requests ===== //
  const { data: notificationTypesQueryData, loading: notificationTypesLoading } = useNotificationTypesQuery();

  const notificationTypesData = notificationTypesQueryData?.notificationCenterTypes || {};
  const notificationTypes = Object.keys(notificationTypesData);

  const { data: desksTeamsData, loading: desksTeamsLoading } = useDesksTeamsQuery();

  const desks = desksTeamsData?.userBranches?.DESK || [];
  const teams = desksTeamsData?.userBranches?.TEAM || [];

  const { data: operatorsData, loading: operatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const operators = operatorsData?.operators?.content || [];

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

  const filterOperatorsByBranch = (uuids: Array<string>) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  );

  const filterOperators = ({ operatorDesks, operatorTeams }: FormValues) => {
    if (operatorTeams?.length) {
      return filterOperatorsByBranch(operatorTeams);
    }

    if (operatorDesks?.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsByDesks = teams
        .filter(team => team.parentBranch && operatorDesks.includes(team.parentBranch.uuid))
        .map(({ uuid }) => uuid);

      return filterOperatorsByBranch([...operatorDesks, ...teamsByDesks]);
    }

    return operators;
  };

  return (
    <Formik
      initialValues={state?.filters as FormValues || {}}
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
          <Form className="NotificationsGridFilter__form">
            <div className="NotificationsGridFilter__fields">
              <Field
                name="searchKeyword"
                className="NotificationsGridFilter__field NotificationsGridFilter__search"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.SEARCH')}
                placeholder={I18n.t('NOTIFICATION_CENTER.FILTERS.PLACEHOLDERS.NOTIFICATION_OR_PLAYER')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                withFocus
              />

              <Field
                name="operatorDesks"
                className="NotificationsGridFilter__field NotificationsGridFilter__select"
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
                className="NotificationsGridFilter__field NotificationsGridFilter__select"
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
                className="NotificationsGridFilter__field NotificationsGridFilter__select"
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
                    className={classNames('NotificationsGridFilter__select-option', {
                      'NotificationsGridFilter__select-option--inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                    })}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="notificationTypes"
                className="NotificationsGridFilter__field NotificationsGridFilter__select"
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
                className="NotificationsGridFilter__field NotificationsGridFilter__select"
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
                className="NotificationsGridFilter__field NotificationsGridFilter__date-range"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.CREATION_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'creationDateRange.from',
                  to: 'creationDateRange.to',
                }}
                withFocus
              />
            </div>

            <div className="NotificationsGridFilter__buttons">
              <RefreshButton
                className="NotificationsGridFilter__button"
                onClick={onRefetch}
              />

              <Button
                className="NotificationsGridFilter__button"
                onClick={() => handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
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

export default React.memo(NotificationsFilters);
