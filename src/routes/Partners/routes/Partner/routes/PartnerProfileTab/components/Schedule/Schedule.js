import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import Grid, { GridColumn } from 'components/Grid';
import { FormikCheckbox } from 'components/Formik';
import ScheduleModal from 'modals/ScheduleModal';
import getSchedule from './graphql/getScheduleQuery';
import changeScheduleStatusMutation from './graphql/changeScheduleStatusMutation';
import './Schedule.scss';

class Schedule extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      scheduleModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    affiliateUuid: PropTypes.string.isRequired,
    schedule: PropTypes.query({
      schedule: PropTypes.shape({
        data: PropTypes.object.isRequired,
      }),
    }).isRequired,
    changeScheduleStatus: PropTypes.func.isRequired,
  };

  state = {
    checkedCountries: {},
  }

  static getDerivedStateFromProps({ schedule: { data } }, { checkedCountries }) {
    const scheduleWeek = get(data, 'schedule') || [];

    return {
      checkedCountries: {
        ...scheduleWeek.reduce((acc, { day, activated }) => ({ ...acc, [day]: activated }), {}),
        ...checkedCountries,
      },
    };
  }

  handleSubmit = async (value) => {
    const {
      changeScheduleStatus,
      affiliateUuid,
      notify,
      schedule: {
        refetch,
      },
    } = this.props;

    const {
      data: {
        schedule: {
          changeScheduleStatus: {
            success,
          },
        },
      },
    } = await changeScheduleStatus({
      variables: {
        affiliateUuid,
        data: Object.keys(value).map(day => ({ day, activated: value[day] })),
      },
    });

    if (success) {
      refetch();
    }

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
      message: success
        ? I18n.t('COMMON.SUCCESS')
        : I18n.t('COMMON.ERROR'),
    });
  }

  handleChange = setFieldValue => (e) => {
    const { name, checked } = e.target;

    this.setState(prevState => ({ checkedCountries: { ...prevState.checkedCountries, [name]: checked } }));

    setFieldValue(name, checked);
  }

  triggerEditScheduleModal = (value) => {
    const {
      modals: { scheduleModal },
      affiliateUuid,
      schedule: {
        refetch,
      },
    } = this.props;

    scheduleModal.show({
      ...value,
      activated: this.state.checkedCountries[value.day],
      affiliateUuid,
      refetch,
    });
  };

  renderDay = ({ day }) => (
    <Choose>
      <When condition={day}>
        <div className="font-weight-700">{I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderHours = ({ workingHoursFrom, workingHoursTo }) => (
    <Choose>
      <When condition={workingHoursFrom && workingHoursTo}>
        <div className="font-weight-700">
          {`
            ${I18n.t('PARTNERS.SCHEDULE.FROM')} ${workingHoursFrom}
            ${I18n.t('PARTNERS.SCHEDULE.TO')} ${workingHoursTo}
          `}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderLimit = ({ totalLimit }) => (
    <Choose>
      <When condition={totalLimit}>
        <div className="font-weight-700">{totalLimit}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderCountry = ({ countrySpreads }) => (
    <Choose>
      <When condition={countrySpreads}>
        <div className="font-weight-700">
          {countrySpreads.map(({ country, limit }) => (
            <div className="Schedule__countrySpreads">
              <span>{countryList[country.toUpperCase()]}</span>
              <span className="margin-right-50">{limit}</span>
            </div>
          ))}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderActivate = setFieldValue => ({ day }) => (
    <Field
      name={day}
      onChange={this.handleChange(setFieldValue)}
      component={FormikCheckbox}
    />
  )

  renderActions = value => (
    <Button
      transparent
    >
      <i
        onClick={() => this.triggerEditScheduleModal(value)}
        className="font-size-16 cursor-pointer fa fa-edit float-right"
      />
    </Button>
  )

  render() {
    const {
      schedule: {
        data,
        loading,
      },
    } = this.props;
    const { checkedCountries } = this.state;

    const scheduleWeek = get(data, 'schedule') || [];

    return (
      <div className="Schedule card">
        <div className="card-body">
          <Formik
            initialValues={{
              ...scheduleWeek.reduce((acc, { day, activated }) => ({ ...acc, [day]: activated }), {}),
            }}
            enableReinitialize
            onSubmit={this.handleSubmit}
          >
            {({ dirty, isSubmitting, setFieldValue }) => (
              <Form>
                <If condition={dirty || isSubmitting}>
                  <Button
                    primary
                    type="submit"
                    className="pull-right"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </If>
                <div className="Schedule__heading">{I18n.t('PARTNERS.SCHEDULE.TITLE')}</div>
                <Grid
                  rowsClassNames={({ day }) => (
                    classNames({
                      'Schedule--is-disabled': !checkedCountries[day],
                    }))
                  }
                  data={scheduleWeek}
                  handleRowClick={this.handleOfficeClick}
                  isLastPage
                  withNoResults={!loading && scheduleWeek.length === 0}
                >
                  <GridColumn
                    name="activate"
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.ACTIVATE')}
                    render={this.renderActivate(setFieldValue)}
                  />
                  <GridColumn
                    name="day"
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.DAY')}
                    render={this.renderDay}
                  />
                  <GridColumn
                    name="hours"
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.WORKING_HOURS')}
                    render={this.renderHours}
                  />
                  <GridColumn
                    name="limit"
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.TOTAL_LEADS_LIMIT')}
                    render={this.renderLimit}
                  />
                  <GridColumn
                    name="country"
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.COUNTRY_LIMIT')}
                    render={this.renderCountry}
                  />
                  <GridColumn
                    name="action"
                    render={this.renderActions}
                  />
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default compose(
  withModals({
    scheduleModal: ScheduleModal,
  }),
  withNotifications,
  withRequests({
    schedule: getSchedule,
    changeScheduleStatus: changeScheduleStatusMutation,
  }),
)(Schedule);
