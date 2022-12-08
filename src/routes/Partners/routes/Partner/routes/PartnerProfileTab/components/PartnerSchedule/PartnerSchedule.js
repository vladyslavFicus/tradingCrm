import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import { Table, Column } from 'components/Table';
import { FormikCheckbox } from 'components/Formik';
import PartnerScheduleModal from 'modals/PartnerScheduleModal';
import ChangeScheduleStatusMutation from './graphql/ChangeScheduleStatusMutation';
import './PartnerSchedule.scss';

class PartnerSchedule extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      partnerScheduleModal: PropTypes.modalType,
    }).isRequired,
    partnerData: PropTypes.query({
      partner: PropTypes.partner,
    }).isRequired,
    changeScheduleStatus: PropTypes.func.isRequired,
  };

  state = {
    checkedCountries: {},
  }

  static getDerivedStateFromProps({ partnerData: { data } }, { checkedCountries }) {
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
      partnerData: {
        data,
        refetch,
      },
    } = this.props;

    try {
      await changeScheduleStatus({
        variables: {
          affiliateUuid: data?.partner?.uuid,
          data: Object.keys(value).map(day => ({ day, activated: value[day] })),
        },
      });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNERS.MODALS.SCHEDULE.NOTIFICATIONS.UPDATE_STATUS.TITLE'),
        message: I18n.t('COMMON.SUCCESS'),

      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
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
      partnerData: {
        refetch,
        data,
      },
    } = this.props;

    partnerScheduleModal.show({
      ...value,
      activated: this.state.checkedCountries[value.day],
      affiliateUuid: data?.partner?.uuid,
      refetch,
    });
  };

  renderDay = ({ day }) => (
    <Choose>
      <When condition={day}>
        <div className="PartnerSchedule__general">{I18n.t(`PARTNERS.SCHEDULE.WEEK.${day}`)}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderHours = ({ workingHoursFrom, workingHoursTo }) => (
    <Choose>
      <When condition={workingHoursFrom && workingHoursTo}>
        <div className="PartnerSchedule__general">
          {`
            ${I18n.t('PARTNERS.SCHEDULE.FROM')} ${moment(workingHoursFrom, 'HH:mm:ss').format('HH:mm')}
            ${I18n.t('PARTNERS.SCHEDULE.TO')} ${moment(workingHoursTo, 'HH:mm:ss').format('HH:mm')}
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
        <div className="PartnerSchedule__general">{totalLimit}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderCountry = ({ countrySpreads }) => (
    <Choose>
      <When condition={countrySpreads}>
        <div className="PartnerSchedule__general">
          {countrySpreads.map(({ country, limit }) => (
            <div className="PartnerSchedule__countrySpreads" key={country}>
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
      icon
      onClick={() => this.triggerEditScheduleModal(value)}
    >
      <i className="fa fa-edit" />
    </Button>
  )

  render() {
    const {
      partnerData: {
        data,
        loading,
      },
    } = this.props;
    const { checkedCountries } = this.state;

    const scheduleWeek = get(data, 'partner.schedule') || [];

    return (
      <div className="PartnerSchedule">
        <Formik
          initialValues={{
            ...scheduleWeek.reduce((acc, { day, activated }) => ({ ...acc, [day]: activated }), {}),
          }}
          enableReinitialize
          onSubmit={this.handleSubmit}
        >
          {({ dirty, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="PartnerSchedule__header-container">
                <div className="PartnerSchedule__heading">{I18n.t('PARTNERS.SCHEDULE.TITLE')}</div>
                <If condition={dirty || isSubmitting}>
                  <Button
                    primary
                    type="submit"
                  >
                    {I18n.t('COMMON.SAVE_CHANGES')}
                  </Button>
                </If>
              </div>

              <Table
                items={scheduleWeek}
                loading={loading}
                customClassNameRow={({ day }) => (
                  classNames({
                    'PartnerSchedule--is-disabled': !checkedCountries[day],
                  }))
                }
              >
                <Column
                  header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.ACTIVATE')}
                  render={this.renderActivate(setFieldValue)}
                />
                <Column
                  header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.DAY')}
                  render={this.renderDay}
                />
                <Column
                  header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.WORKING_HOURS')}
                  render={this.renderHours}
                />
                <Column
                  header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.TOTAL_LEADS_LIMIT')}
                  render={this.renderLimit}
                />
                <Column
                  header={I18n.t('PARTNERS.SCHEDULE.GRID_HEADER.COUNTRY_LIMIT')}
                  render={this.renderCountry}
                />
                <Column render={this.renderActions} />
              </Table>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withModals({
    partnerScheduleModal: PartnerScheduleModal,
  }),
  withRequests({
    changeScheduleStatus: ChangeScheduleStatusMutation,
  }),
)(PartnerSchedule);
