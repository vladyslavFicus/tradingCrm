/* eslint-disable */
import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import classNames from 'classnames';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import countryList from 'utils/countryList';
import { Button } from 'components/UI';
import Grid, { GridColumn } from 'components/Grid';
import { FormikCheckbox } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import ScheduleModal from 'modals/ScheduleModal';
// import {
//   GetRulesQuery,
// } from '../graphql';
import './Schedule.scss';

const entities = [
  {
    day: 'Monday',
    hours: {
      from: '10:00',
      to: '14: 00',
    },
    limit: 300,
    country: ['ru', 'az'],
  },
  {
    day: 'Tuesday',
    limit: 300,
    country: ['ru', 'az'],
  },
  {
    day: 'Wednesday',
    hours: {
      from: '10:00',
      to: '14: 00',
    },
    limit: 300,
    country: ['ru', 'az'],
  },
  {
    day: 'Thursday',
    hours: {
      from: '10:00',
      to: '14: 00',
    },
    limit: 300,
    country: ['ru', 'az'],
  },
  {
    day: 'Friday',
    limit: 300,
    country: ['ru', 'az'],
  },
  {
    day: 'Saturday',
  },
  {
    day: 'Sunday',
  },
];

class Schedule extends PureComponent {
  static propTypes = {
    rules: PropTypes.shape({
      rules: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.ruleType),
        error: PropTypes.object,
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    deleteRule: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      deleteModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    operators: PropTypes.query({
      operators: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.operatorsList,
        }),
      }),
    }).isRequired,
    partners: PropTypes.query({
      partners: PropTypes.shape({
        data: PropTypes.shape({
          content: PropTypes.partnersList,
        }),
      }),
    }).isRequired,
    permission: PropTypes.permission.isRequired,
    type: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
  };

  static defaultProps = {
    type: null,
  };

  state = {
    checkedCountries: {},
  }

  handleChange = setFieldValue => (e) => {
    const { name, checked } = e.target;

    this.setState(prevState => ({ checkedCountries: { ...prevState.checkedCountries, [name]: checked } }));

    setFieldValue(name, checked);
  }

  handleSubmit = (value) => {
    console.log('GOOD', value);
  }

  triggerEditScheduleModal = (currentDay) => {
    const {
      modals: { scheduleModal },
    } = this.props;

    scheduleModal.show({
      onSubmit: (values, setErrors) => this.handleAddRule(values, setErrors),
      currentDay,
    });
  };

  renderDay = ({ day }) => (
    <Choose>
      <When condition={day}>
        <div className="font-weight-700">{day}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderHours = ({ hours }) => (
    <Choose>
      <When condition={hours}>
        <div className="font-weight-700">
          {`${I18n.t('PARTNERS.SCHEDULE.FROM')} ${hours.from} ${I18n.t('PARTNERS.SCHEDULE.TO')} ${hours.to}`}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderLimit = ({ limit }) => (
    <Choose>
      <When condition={limit}>
        <div className="font-weight-700">{limit}</div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  )

  renderCountry = ({ country }) => (
    <Choose>
      <When condition={country}>
        <div className="font-weight-700">
          {country.map(item => <div>{countryList[item.toUpperCase()]}</div>)}
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

  renderActions = ({ day }) => (
    <Button
      transparent
    >
      <i
        onClick={() => this.triggerEditScheduleModal(day)}
        className="font-size-16 cursor-pointer fa fa-edit float-right"
      />
    </Button>
  )

  render() {
    const { checkedCountries } = this.state;

    return (
      <div className="Schedule card">
        <div className="card-body">
          <Formik
            initialValues={{
              Monday: false,
              Tuesday: false,
              Wednesday: false,
              Thursday: false,
              Friday: false,
            }}
            // validateOnChange={false}
            // validateOnBlur={false}
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
                <Grid
                  rowsClassNames={({ day }) =>
                    classNames({
                      'Schedule--is-disabled': !checkedCountries[day],
                  })}
                  data={entities}
                  handleRowClick={this.handleOfficeClick}
                  isLastPage
                  // withNoResults={!loading && entities.length === 0}
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
  // withNotifications,
  // withRequests({
  //   rules: GetRulesQuery,
  // }),
)(Schedule);
