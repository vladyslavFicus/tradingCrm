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
    operators: PropTypes.shape({
      operators: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.operatorProfile),
      }),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
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
    if (!types) return [];

    const subtypeJSX = value => (
      <option key={value} value={value}>
        {I18n.t(notificationCenterSubTypesLabels[value])}
      </option>
    );
    const typesLength = types.length;

    switch (true) {
      case typesLength === 0:
        return [];

      case typesLength === 1:
        return subtypes[types].map(subtypeJSX);

      case typesLength > 1:
        return subtypesOfChosenTypes(subtypes, types).map(subtypeJSX);

      default:
        return [];
    }
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
    const desks = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.DESK') || [];
    const teams = get(hierarchyData, 'hierarchy.userBranchHierarchy.data.TEAM') || [];
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
        }) => (
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
              <Field
                name="creationDateRange"
                className="NotificationsGridFilter__input NotificationsGridFilter__dates"
                label={I18n.t('NOTIFICATION_CENTER.FILTERS.LABELS.CREATION_RANGE')}
                startDatePlaceholderText={I18n.t('COMMON.DATE_OPTIONS.START_DATE')}
                endDatePlaceholderText={I18n.t('COMMON.DATE_OPTIONS.END_DATE')}
                component={FormikDateRangePicker}
                periodKeys={{
                  start: 'creationDateFrom',
                  end: 'creationDateTo',
                }}
                withTime
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
                disabled={notificationCenterSubtypesLoading || !notificationTypes}
              >
                {this.renderSubtypesOptions(notificationTypes, subtypes)}
              </Field>
            </div>
            <div className="NotificationsGridFilter__buttons">
              <Button
                className="NotificationsGridFilter__button"
                disabled={isSubmitting || !dirty}
                onClick={() => this.onHandleReset(handleReset)}
                type="button"
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
        )}
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
