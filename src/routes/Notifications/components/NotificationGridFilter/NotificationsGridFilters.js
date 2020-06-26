import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { Formik, Form, Field } from 'formik';
import { FormikDateRangePicker, FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import Button from 'components/UI/Button';
import { filterLabels } from 'constants/user';
import { notificationCenterSubTypesLabels } from 'constants/notificationCenter';
import { OperatorsQuery, UserBranchHierarchyQuery, TypesQuery, SubtypesQuery } from './graphql';
import { prepareSubtypes, subtypesOfChosenTypes } from './utils';
import './NotificationsGridFilters.scss';

class NotificationsFilters extends PureComponent {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    operators: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operatorProfile),
    }).isRequired,
    userBranchHierarchy: PropTypes.any.isRequired,
    typesQuery: PropTypes.any.isRequired,
    subtypesQuery: PropTypes.any.isRequired,
  };

  initialValues = {
    operators: '',
    searchKeyword: '',
    operatorTeams: '',
    operatorDesks: '',
    creationDateTo: '',
    creationDateFrom: '',
    notificationTypes: '',
    notificationSubtypes: '',
  };

  onHandleSubmit = ({ creationDateFrom, creationDateTo, ...restValues }, { setSubmitting }) => {
    const creationDateRange = {
      from: creationDateFrom,
      to: creationDateTo,
    };
    this.props.onSubmit(decodeNullValues({ ...restValues, creationDateRange }));
    setSubmitting(false);
  };

  onHandleReset = (handleReset) => {
    handleReset();
    this.props.onReset();
  };

  renderSubtypesOptions = (types, subtypes) => {
    if (!types || !types.length) return [];

    return subtypesOfChosenTypes(subtypes, types)
      .filter(value => notificationCenterSubTypesLabels[value])
      .map(value => (
        <option key={value} value={value}>
          {I18n.t(notificationCenterSubTypesLabels[value])}
        </option>
      ));
  };

  render() {
    const {
      operators: {
        data: operatorsData,
        loading: operatorsLoading,
      },
      userBranchHierarchy: {
        data: hierarchyData,
        loading: hierarchyLoading,
      },
      typesQuery: {
        data: typesData,
        loading: notificationCenterTypesLoading,
      },
      subtypesQuery: {
        data: subtypesData,
        loading: notificationCenterSubtypesLoading,
      },
    } = this.props;

    const operators = get(operatorsData, 'operators.data.content') || [];
    const desks = get(hierarchyData, 'userBranches.DESK') || [];
    const teams = get(hierarchyData, 'userBranches.TEAM') || [];
    const types = get(typesData, 'notificationCenterTypes.data') || [];
    const arrOfSubtypes = get(subtypesData, 'notificationCenterSubtypes.data') || [];
    const subtypes = prepareSubtypes(arrOfSubtypes);

    return (
      <Formik
        initialValues={this.initialValues}
        onSubmit={this.onHandleSubmit}
      >
        {({
          setFieldValue,
          isSubmitting,
          handleReset,
          values: {
            notificationSubtypes,
            notificationTypes,
          },
          dirty,
        }) => {
          const subtypesOptions = this.renderSubtypesOptions(notificationTypes, subtypes);

          return (
            <Form className="NotificationsGridFilter__form">
              <div className="NotificationsGridFilter__inputs">
                <Field
                  name="searchKeyword"
                  className="NotificationsGridFilter__input NotificationsGridFilter__search"
                  placeholder={I18n.t('NOTIFICATION_CENTER.FILTERS.PLACEHOLDERS.NOTIFICATION_OR_PLAYER')}
                  label={I18n.t(filterLabels.searchValue)}
                  component={FormikInputField}
                />
                <Field
                  name="operators"
                  className="NotificationsGridFilter__input NotificationsGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.AGENTS')}
                  component={FormikSelectField}
                  searchable
                  multiple
                  disabled={operatorsLoading}
                >
                  {operators.map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>{fullName}</option>
                  ))}
                </Field>
                <Field
                  name="operatorTeams"
                  className="NotificationsGridFilter__input NotificationsGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t(filterLabels.teams)}
                  component={FormikSelectField}
                  searchable
                  multiple
                  disabled={hierarchyLoading}
                >
                  {teams.map(({ uuid, name }) => (
                    <option key={uuid} value={uuid}>{name}</option>
                  ))}
                </Field>
                <Field
                  name="operatorDesks"
                  className="NotificationsGridFilter__input NotificationsGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t(filterLabels.desks)}
                  component={FormikSelectField}
                  searchable
                  multiple
                  disabled={hierarchyLoading}
                >
                  {desks.map(({ uuid, name }) => (
                    <option key={uuid} value={uuid}>{name}</option>
                  ))}
                </Field>
                <FormikDateRangePicker
                  className="NotificationsGridFilter__input NotificationsGridFilter__dates"
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.CREATION_RANGE')}
                  periodKeys={{
                    start: 'creationDateFrom',
                    end: 'creationDateTo',
                  }}
                />
                <Field
                  name="notificationTypes"
                  className="NotificationsGridFilter__input NotificationsGridFilter__select--L"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE')}
                  component={FormikSelectField}
                  searchable
                  multiple
                  customOnChange={(value) => {
                    setFieldValue('notificationTypes', value || '');
                    if (notificationSubtypes) setFieldValue('notificationSubtypes', '');
                  }}
                  disabled={notificationCenterTypesLoading}
                >
                  {types.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </Field>
                <Field
                  name="notificationSubtypes"
                  className="NotificationsGridFilter__input NotificationsGridFilter__select--L"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.NOTIFICATION_TYPE_DETAILS')}
                  component={FormikSelectField}
                  searchable
                  multiple
                  disabled={notificationCenterSubtypesLoading || !subtypesOptions.length}
                >
                  {subtypesOptions}
                </Field>
              </div>
              <div className="NotificationsGridFilter__buttons">
                <Button
                  className="NotificationsGridFilter__button"
                  disabled={isSubmitting || !dirty}
                  onClick={() => this.onHandleReset(handleReset)}
                  common
                >
                  {I18n.t('COMMON.RESET')}
                </Button>
                <Button
                  disabled={isSubmitting}
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
  }
}

export default compose(
  withStorage(['auth']),
  withRequests({
    typesQuery: TypesQuery,
    operators: OperatorsQuery,
    subtypesQuery: SubtypesQuery,
    userBranchHierarchy: UserBranchHierarchyQuery,
  }),
)(NotificationsFilters);
