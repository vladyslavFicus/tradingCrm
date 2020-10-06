import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import {
  statusColorNames,
  statusesLabels,
} from 'constants/operators';
import { Link } from 'components/Link';
import Grid, { GridColumn } from 'components/Grid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import MiniProfile from 'components/MiniProfile';
import Uuid from 'components/Uuid';
import './OperatorsGrid.scss';

class OperatorsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    operatorsQuery: PropTypes.shape({
      operators: PropTypes.pageable(PropTypes.any),
      loadMore: PropTypes.func,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  handlePageChanged = () => {
    this.props.operatorsQuery.loadMore();
  };

  handleSort = (sortData) => {
    const { history } = this.props;
    const query = get(history, 'location.query') || {};

    let nameDirection = null;

    let sorts = Object.keys(sortData)
      .filter(sortingKey => sortData[sortingKey])
      .map((sortingKey) => {
        if (sortingKey === 'name') {
          nameDirection = sortData[sortingKey];
        }

        return {
          column: sortingKey,
          direction: sortData[sortingKey],
        };
      });

    if (nameDirection) {
      sorts = sorts
        .filter(({ column }) => column !== 'name')
        .concat([
          {
            column: 'firstName',
            direction: nameDirection,
          },
          {
            column: 'lastName',
            direction: nameDirection,
          },
        ]);
    } else {
      sorts = sorts.filter(({ column }) => column !== 'firstName' && column !== 'lastName');
    }

    history.replace({
      query: {
        ...query,
        sorts,
      },
    });
  };

  renderStatus = data => (
    <div>
      <div
        className={
          classNames(statusColorNames[data.operatorStatus], 'text-uppercase font-weight-700')
        }
      >
        {I18n.t(statusesLabels[data.operatorStatus]) || data.operatorStatus}
      </div>
      {
        data.statusChangeDate
        && (
          <div className="font-size-11">
            {I18n.t('COMMON.SINCE', { date: moment.utc(data.statusChangeDate).local().format('DD.MM.YYYY') })}
          </div>
        )
      }
    </div>
  );

  renderOperator = ({ uuid, fullName }) => (
    <div>
      <div className="font-weight-700" id={`operator-list-${uuid}-main`}>
        <Link to={`/operators/${uuid}/profile`}>{fullName}</Link>
      </div>
      <div className="font-size-11" id={`operator-list-${uuid}-additional`}>
        <MiniProfile
          type="operator"
          id={uuid}
        >
          <Uuid uuid={uuid} />
        </MiniProfile>
      </div>
    </div>
  );

  renderCountry = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRegistered = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.registrationDate).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(data.registrationDate).local().format('HH:mm')}
      </div>
    </div>
  );

  render() {
    const {
      operatorsQuery,
      operatorsQuery: { loading },
    } = this.props;

    const { last, content } = get(operatorsQuery, 'operators') || { content: [] };

    return (
      <div className="OperatorsGrid">
        <Grid
          data={content}
          handleSort={this.handleSort}
          handlePageChanged={this.handlePageChanged}
          isLoading={loading}
          isLastPage={last}
        >
          <GridColumn
            sortBy="name"
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
