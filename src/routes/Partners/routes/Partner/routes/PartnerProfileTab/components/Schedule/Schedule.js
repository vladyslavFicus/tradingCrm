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
import { convertTimeFromUTC } from 'utils/timeConverter';
import { Button } from 'components/UI';
import Grid, { GridColumn } from 'components/Grid';
import { FormikCheckbox } from 'components/Formik';
import PartnerScheduleModal from 'modals/PartnerScheduleModal';
import getSchedule from './graphql/getScheduleQuery';
import changeScheduleStatusMutation from './graphql/changeScheduleStatusMutation';
import './Schedule.scss';

class Schedule extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      partnerScheduleModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    affiliateUuid: PropTypes.string.isRequired,
    partner: PropTypes.partner.isRequired,
    changeScheduleStatus: PropTypes.func.isRequired,
  };

  state = {
    checkedCountries: {},
  }

  static getDerivedStateFromProps({ partner: { data } }, { checkedCountries }) {
    const scheduleWeek = get(data, 'partner.schedule') || [];

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
      partner: {
        refetch,
      },
    } = this.props;

    try {
      await changeScheduleStatus({
        variables: {
          affiliateUuid,
          data: Object.keys(value).map(day => ({ day, activated: value[day] })),
        },
      });

      refetch();

      notify({
        level: 'success',
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.SUCCESS'),

      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.ERROR'),
      });
    }
  }

  handleChange = setFieldValue => (e) => {
    const { name, checked } = e.target;

    this.setState(prevState => ({ checkedCountries: { ...prevState.checkedCountries, [name]: checked } }));

    setFieldValue(name, checked);
  }

  triggerEditScheduleModal = (value) => {
    const {
      modals: { partnerScheduleModal },
      affiliateUuid,
      partner: {
        refetch,
      },
    } = this.props;

    partnerScheduleModal.show({
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
            ${I18n.t('PARTNERS.SCHEDULE.FROM')} ${convertTimeFromUTC(workingHoursFrom)}
            ${I18n.t('PARTNERS.SCHEDULE.TO')} ${convertTimeFromUTC(workingHoursTo)}
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
      <When condition={totalLimit !== null}>
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

  renderActivate = setFieldValue => ({ day, configId }) => (
    <Field
      name={day}
      disabled={!configId}
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
      partner: {
        data,
        loading,
      },
    } = this.props;
    const { checkedCountries } = this.state;

    const scheduleWeek = get(data, 'partner.schedule') || [];

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
                <span className="Schedule__heading">{I18n.t('PARTNERS.SCHEDULE.TITLE')}</span>
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
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.ACTIVATE')}
                    render={this.renderActivate(setFieldValue)}
                  />
                  <GridColumn
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.DAY')}
                    render={this.renderDay}
                  />
                  <GridColumn
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.WORKING_HOURS')}
                    render={this.renderHours}
                  />
                  <GridColumn
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.TOTAL_LEADS_LIMIT')}
                    render={this.renderLimit}
                  />
                  <GridColumn
                    header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.COUNTRY_LIMIT')}
                    render={this.renderCountry}
                  />
                  <GridColumn
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
    partnerScheduleModal: PartnerScheduleModal,
  }),
  withNotifications,
  withRequests({
    partner: getSchedule,
    changeScheduleStatus: changeScheduleStatusMutation,
  }),
)(Schedule);
