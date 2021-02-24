import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import { Table, Column } from 'components/Table';
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

    const page = data?.partners?.number || 0;

    loadMore({
      page: {
        ...variables.page,
        from: page + 1,
      },
    });
  };

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
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
      location: { state },
    } = this.props;

    const { content, last } = partnersData?.partners || { content: [], last: true };

    return (
      <div className="PartnersGrid">
        <Table
          stickyFirstColumn
          stickyFromTop={138}
          items={content}
          sorts={state?.sorts}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
          onSort={this.handleSort}
        >
          <Column
            sortBy="firstName"
            header={I18n.t('PARTNERS.GRID_HEADER.PARTNER')}
            render={this.renderPartnerColumn}
          />
          <Column
            header={I18n.t('PARTNERS.GRID_HEADER.EXTERNAL_ID')}
            render={this.renderExternalAffiliateIdColumn}
          />
          <Column
            sortBy="country"
            header={I18n.t('PARTNERS.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <Column
            sortBy="createdAt"
            header={I18n.t('PARTNERS.GRID_HEADER.REGISTERED')}
            render={this.renderRegisteredColumn}
          />
          <Column
            sortBy="status"
            header={I18n.t('PARTNERS.GRID_HEADER.STATUS')}
            render={this.renderStatusColumn}
          />
        </Table>
      </div>
    );
  }
}

export default withRouter(PartnersGrid);
