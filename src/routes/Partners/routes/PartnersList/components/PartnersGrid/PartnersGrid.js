import React, { PureComponent, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Uuid from 'components/Uuid';
import './PartnersGrid.scss';
import { statuses } from '../../../../constants';

class PartnersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partner),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      partnersQuery: {
        variables,
        loadMore,
        data,
      },
    } = this.props;

    const page = get(data, 'partners.number') || 0;

    loadMore({
      page: {
        ...variables.page,
        from: page + 1,
      },
    });
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

  renderPartnerColumn = ({ uuid, fullName }) => (
    <Fragment>
      <Link className="PartnersGrid__name" to={`/partners/${uuid}/profile`}>{fullName}</Link>
      <div className="PartnersGrid__uuid">
        <Uuid uuid={uuid} />
      </div>
    </Fragment>
  );

  renderExternalAffiliateIdColumn = ({ externalAffiliateId }) => (
    <If condition={externalAffiliateId}>
      <div>{externalAffiliateId}</div>
    </If>
  );

  renderCountryColumn = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag code={country} height="14" />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRegisteredColumn = ({ createdAt }) => (
    <Fragment>
      <div className="PartnersGrid__registration-date">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="PartnersGrid__registration-time">
        {moment.utc(createdAt).local().format('HH:mm')}
      </div>
    </Fragment>
  );

  renderStatusColumn = ({ status, statusChangeDate }) => (
    <Fragment>
      <div
        className={
          classNames(
            'PartnersGrid__status-name',
            { 'PartnersGrid__status-name--active': status === statuses.ACTIVE },
            { 'PartnersGrid__status-name--closed': status === statuses.CLOSED },
            { 'PartnersGrid__status-name--inactive': status === statuses.INACTIVE },
          )
        }
      >
        {status}
      </div>
      <If condition={statusChangeDate}>
        <div className="PartnersGrid__status-date">
          {I18n.t('COMMON.SINCE', { date: moment.utc(statusChangeDate).local().format('DD.MM.YYYY') })}
        </div>
      </If>
    </Fragment>
  );

  render() {
    const {
      partnersQuery: {
        loading,
        data: partnersData,
      },
    } = this.props;

    const { last, content } = get(partnersData, 'partners') || { content: [] };

    return (
      <div className="PartnersGrid">
        <Grid
          data={content}
          handleSort={this.handleSort}
          handlePageChanged={this.handlePageChanged}
          isLoading={loading}
          isLastPage={last}
          withLazyLoad
        >
          <GridColumn
            sortBy="name"
            header={I18n.t('PARTNERS.GRID_HEADER.PARTNER')}
            render={this.renderPartnerColumn}
          />
          <GridColumn
            header={I18n.t('PARTNERS.GRID_HEADER.EXTERNAL_ID')}
            render={this.renderExternalAffiliateIdColumn}
          />
          <GridColumn
            sortBy="country"
            header={I18n.t('PARTNERS.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <GridColumn
            sortBy="createdAt"
            header={I18n.t('PARTNERS.GRID_HEADER.REGISTERED')}
            render={this.renderRegisteredColumn}
          />
          <GridColumn
            sortBy="status"
            header={I18n.t('PARTNERS.GRID_HEADER.STATUS')}
            render={this.renderStatusColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(PartnersGrid);
