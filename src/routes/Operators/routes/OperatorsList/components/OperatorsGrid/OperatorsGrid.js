import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { statusesLabels } from 'constants/operators';
import { Link } from 'components/Link';
import MiniProfile from 'components/MiniProfile';
import Grid, { GridColumn } from 'components/Grid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Uuid from 'components/Uuid';
import './OperatorsGrid.scss';

class OperatorsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    operatorsQuery: PropTypes.query({
      operators: PropTypes.pageable(PropTypes.operator),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      operatorsQuery: {
        variables,
        loadMore,
        data,
      },
    } = this.props;

    const page = data?.operators?.number || 0;

    loadMore({
      page: {
        ...variables.page,
        from: page + 1,
      },
    });
  };

  handleSort = (sortData, sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
        sortData,
      },
    });
  };

  renderOperator = ({ uuid, fullName }) => (
    <>
      <Link className="OperatorsGrid__name" to={`/operators/${uuid}/profile`}>{fullName}</Link>
      <div className="OperatorsGrid__uuid">
        <MiniProfile type="operator" id={uuid}>
          <Uuid uuid={uuid} />
        </MiniProfile>
      </div>
    </>
  );

  renderCountry = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag code={country} height="14" />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRegistered = ({ registrationDate }) => (
    <>
      <div className="OperatorsGrid__registration-date">
        {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
      </div>
      <div className="OperatorsGrid__registration-time">
        {moment.utc(registrationDate).local().format('HH:mm')}
      </div>
    </>
  );

  renderStatus = ({ operatorStatus, statusChangeDate }) => (
    <>
      <div
        className={
          classNames(
            'OperatorsGrid__status-name',
            { 'OperatorsGrid__status-name--active': operatorStatus === 'ACTIVE' },
            { 'OperatorsGrid__status-name--closed': operatorStatus === 'CLOSED' },
            { 'OperatorsGrid__status-name--inactive': operatorStatus === 'INACTIVE' },
          )
        }
      >
        {I18n.t(statusesLabels[operatorStatus])}
      </div>
      <If condition={statusChangeDate}>
        <div className="OperatorsGrid__status-date">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
        </div>
      </If>
    </>
  );

  render() {
    const {
      operatorsQuery,
      location: { state },
    } = this.props;

    const { last, content } = operatorsQuery.data?.operators || {};

    return (
      <div className="OperatorsGrid">
        <Grid
          data={content || []}
          sorts={state?.sortData}
          handleSort={this.handleSort}
          handlePageChanged={this.handlePageChanged}
          headerStickyFromTop={138}
          isLoading={operatorsQuery.loading}
          isLastPage={last}
          withLazyLoad
        >
          <GridColumn
            sortBy="firstName"
            header={I18n.t('OPERATORS.GRID_HEADER.OPERATOR')}
            render={this.renderOperator}
          />
          <GridColumn
            sortBy="country"
            header={I18n.t('OPERATORS.GRID_HEADER.COUNTRY')}
            render={this.renderCountry}
          />
          <GridColumn
            sortBy="registrationDate"
            header={I18n.t('OPERATORS.GRID_HEADER.REGISTERED')}
            render={this.renderRegistered}
          />
          <GridColumn
            sortBy="operatorStatus"
            header={I18n.t('OPERATORS.GRID_HEADER.STATUS')}
            render={this.renderStatus}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(OperatorsGrid);
