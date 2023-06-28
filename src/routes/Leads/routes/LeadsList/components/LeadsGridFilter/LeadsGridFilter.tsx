import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { intersection, sortBy } from 'lodash';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { getAvailableLanguages, getBrand } from 'config';
import { State } from 'types';
import countries from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { salesStatuses as staticSalesStatuses } from 'constants/salesStatuses';
import { statuses as operatorsStasuses } from 'constants/operators';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/Buttons';
import TimeZoneField from 'components/TimeZoneField';
import { leadAccountStatuses, neverCalledTypes } from '../../constants';
import { FormValues } from '../../type';
import { OPERATORS_SORT, attributeLabels, maxSearchLimit } from './constants';
import { useAcquisitionStatusesQuery } from './graphql/__generated__/AcquisitionStatusesQuery';
import { useDesksAndTeamsQuery } from './graphql/__generated__/DesksAndTeamsQuery';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import './LeadsGridFilter.scss';

type Props = {
  onRefetch: () => void,
};

const LeadsGridFilter = (props:Props) => {
  const { onRefetch } = props;

  const { state } = useLocation<State<FormValues>>();
  const history = useHistory();

  // ===== Requests ===== //
  const { data: desksAndTeamsData, loading: isDesksAndTeamsLoading } = useDesksAndTeamsQuery();
  const { data: acquisitionStatusesData, loading: isAcquisitionStatusesLoading } = useAcquisitionStatusesQuery({
    variables: { brandId: getBrand().id },
  });

  const { data: operatorsData, loading: isOperatorsLoading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });
  const operators = operatorsData?.operators?.content || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  const handleReset = () => {
    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });
  };

  const filterOperatorsByBranch = (uuids: Array<string | null>) => (
    operators.filter((operator) => {
      const parentBranches = operator.hierarchy?.parentBranches || [];
      const branches = parentBranches.map(({ uuid }) => uuid) || [];

      return intersection(branches, uuids).length;
    })
  );

  const filterOperators = ({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(teams);
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsData?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team?.parentBranch?.uuid as string))
        .map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(uuids);
    }

    return operators;
  };

  const salesStatuses = sortBy(acquisitionStatusesData?.settings.salesStatuses || [], 'status');

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
      validate={createValidator({
        searchLimit: ['numeric', 'greater:0', `max:${maxSearchLimit}`],
      }, translateLabels(attributeLabels))}
    >
      {({
        isSubmitting,
        values,
        dirty,
      }) => {
        const desksUuids = values.desks || [];
        const desks = desksAndTeamsData?.userBranches?.DESK || [];

        const teams = desksAndTeamsData?.userBranches?.TEAM || [];
        const teamsByDesks = teams.filter(team => desksUuids.includes(team?.parentBranch?.uuid as string));
        const teamsOptions = desksUuids.length ? teamsByDesks : teams;

        const operatorsOptions = filterOperators(values);
        const languagesOptions = ['other', ...getAvailableLanguages()];

        return (
          <Form className="LeadsGridFilter__form">
            <div className="LeadsGridFilter__fields">
              <Field
                name="searchKeyword"
                className="LeadsGridFilter__field LeadsGridFilter__search"
                label={I18n.t(attributeLabels.searchKeyword)}
                placeholder={I18n.t('COMMON.SEARCH_BY.LEAD')}
                addition={<i className="icon icon-search" />}
                component={FormikInputField}
                data-testid="LeadsGridFilter-searchKeywordInput"
                withFocus
              />

              <Field
                name="languages"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.languages)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-languagesSelect"
                searchable
                withFocus
                multiple
              >
                {languagesOptions.map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>

              <Field
                name="countries"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.countries)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-countriesSelect"
                searchable
                withFocus
                multiple
              >
                {[
                  <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                  ...Object.keys(countries)
                    .map(country => (
                      <option key={country} value={country}>{countries[country]}</option>
                    )),
                ]}
              </Field>

              <Field
                name="desks"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.desks)}
                placeholder={
                    I18n.t(
                      (!isDesksAndTeamsLoading && desks.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || desks.length === 0}
                data-testid="LeadsGridFilter-desksSelect"
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
                name="teams"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.teams)}
                placeholder={
                    I18n.t(
                      (!isDesksAndTeamsLoading && teamsOptions.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isDesksAndTeamsLoading || teamsOptions.length === 0}
                data-testid="LeadsGridFilter-teamsSelect"
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
                name="salesAgents"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.salesAgents)}
                placeholder={
                    I18n.t(
                      (!isOperatorsLoading && operatorsOptions.length === 0)
                        ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                        : 'COMMON.SELECT_OPTION.DEFAULT',
                    )
                  }
                component={FormikSelectField}
                disabled={isOperatorsLoading || operatorsOptions.length === 0}
                data-testid="LeadsGridFilter-salesAgentsSelect"
                searchable
                withFocus
                multiple
              >
                {operatorsOptions.map(({ uuid, fullName, operatorStatus }) => (
                  <option
                    key={uuid}
                    value={uuid}
                    className={classNames('LeadsGridFilter__select-option', {
                      'LeadsGridFilter__select-option--inactive': operatorStatus === operatorsStasuses.INACTIVE
                          || operatorStatus === operatorsStasuses.CLOSED,
                    })}
                  >
                    {fullName}
                  </option>
                ))}
              </Field>

              <Field
                name="salesStatuses"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.salesStatuses)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={isAcquisitionStatusesLoading}
                data-testid="LeadsGridFilter-salesStatusesSelect"
                searchable
                withFocus
                multiple
              >
                {salesStatuses.map(({ status }) => (
                  <option key={status} value={status}>
                    {I18n.t(staticSalesStatuses[status])}
                  </option>
                ))}
              </Field>

              <Field
                name="status"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.status)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-statusSelect"
                withAnyOption
                searchable
                withFocus
              >
                {Object.values(leadAccountStatuses)
                  .map(({ label, value }) => (
                    <option key={value} value={value}>
                      {I18n.t(label)}
                    </option>
                  ))}
              </Field>

              <Field
                name="isNeverCalled"
                className="LeadsGridFilter__field LeadsGridFilter__select"
                label={I18n.t(attributeLabels.isNeverCalled)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                data-testid="LeadsGridFilter-isNeverCalledSelect"
                withAnyOption
                withFocus
              >
                {neverCalledTypes.map(({ value, label }) => (
                  // @ts-ignore TS doesn't approve value as boolean type
                  <option key={`isNeverCalled-${value}`} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>

              <Field
                name="searchLimit"
                type="number"
                className="LeadsGridFilter__field LeadsGridFilter__search-limit"
                label={I18n.t(attributeLabels.searchLimit)}
                placeholder={I18n.t('COMMON.UNLIMITED')}
                component={FormikInputField}
                data-testid="LeadsGridFilter-searchLimitInput"
                withFocus
                min={0}
              />
              <Field
                name="affiliate"
                className="LeadsGridFilter__field LeadsGridFilter__search"
                label={I18n.t(attributeLabels.affiliate)}
                placeholder={I18n.t('LEADS.FILTER.AFFILIATE_PLACEHOLDER')}
                component={FormikInputField}
                data-testid="LeadsGridFilter-affiliateInput"
                withFocus
              />

              <TimeZoneField className="LeadsGridFilter__field LeadsGridFilter__select" />

              <Field
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.registrationDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'registrationDateStart',
                  to: 'registrationDateEnd',
                }}
                data-testid="LeadsGridFilter-registrationDateRangePicker"
                withFocus
              />

              <Field
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastNoteDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastNoteDateFrom',
                  to: 'lastNoteDateTo',
                }}
                data-testid="LeadsGridFilter-lastNoteDateRangePicker"
                withFocus
              />

              <Field
                name="lastCallDateRange"
                className="LeadsGridFilter__field LeadsGridFilter__date-range"
                label={I18n.t(attributeLabels.lastCallDateRange)}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastCallDateFrom',
                  to: 'lastCallDateTo',
                }}
                anchorDirection="right"
                data-testid="LeadsGridFilter-lastCallDateRangePicker"
                withFocus
              />

              <div className="LeadsGridFilter__buttons">
                <RefreshButton
                  className="LeadsGridFilter__button"
                  onClick={onRefetch}
                  data-testid="LeadsGridFilter-refreshButton"
                />

                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                  onClick={handleReset}
                  data-testid="LeadsGridFilter-resetButton"
                  primary
                >
                  {I18n.t('COMMON.RESET')}
                </Button>

                <Button
                  className="LeadsGridFilter__button"
                  disabled={isSubmitting || !dirty}
                  type="submit"
                  data-testid="LeadsGridFilter-submitButton"
                  primary
                >
                  {I18n.t('COMMON.APPLY')}
                </Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default React.memo(LeadsGridFilter);
