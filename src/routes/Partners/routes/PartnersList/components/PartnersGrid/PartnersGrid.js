import React, { PureComponent, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import Uuid from 'components/Uuid';
import './PartnersGrid.scss';
import { statuses, affiliateTypes } from '../../../../constants';

class PartnersGrid extends PureComponent {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    partners: PropTypes.partnersList.isRequired,
    onPageChange: PropTypes.func.isRequired,
  };

  renderPartnerColumn = ({ uuid, fullName }) => (
    <Fragment>
      <Link className="PartnersGrid__name" to={`/partners/${uuid}/profile`}>{fullName}</Link>
      <div className="PartnersGrid__uuid">
        <Uuid uuid={uuid} />
      </div>
    </Fragment>
  );

  renderPartnerTypeColumn = ({ affiliateType }) => (
    <div
      className={
        classNames(
          'PartnersGrid__partner-type',
          { 'PartnersGrid__partner-type--nullpoint': affiliateType === affiliateTypes.NULLPOINT },
          { 'PartnersGrid__partner-type--affiliate': affiliateType === affiliateTypes.AFFILIATE },
        )
      }
    >
      {affiliateType ? I18n.t(`PARTNERS.TYPES.${affiliateType}`) : null}
    </div>
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
    const { partners, isLoading, isLastPage, onPageChange } = this.props;

    return (
      <div className="PartnersGrid">
        <Grid
          data={partners}
          handleRowClick={this.handleOfficeClick}
          handlePageChanged={onPageChange}
          isLoading={isLoading}
          isLastPage={isLastPage}
          withLazyLoad
          withNoResults={!isLoading && partners.length === 0}
        >
          <GridColumn
            name="uuid"
            header={I18n.t('PARTNERS.GRID_HEADER.PARTNER')}
            render={this.renderPartnerColumn}
          />
          <If condition={getActiveBrandConfig().regulation.isActive}>
            <GridColumn
              name="affiliateType"
              header={I18n.t('PARTNERS.GRID_HEADER.PARTNER_TYPE')}
              render={this.renderPartnerTypeColumn}
            />
          </If>
          <GridColumn
            name="externalAffiliateId"
            header={I18n.t('PARTNERS.GRID_HEADER.EXTERNAL_ID')}
            render={this.renderExternalAffiliateIdColumn}
          />
          <GridColumn
            name="country"
            header={I18n.t('PARTNERS.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <GridColumn
            name="registered"
            header={I18n.t('PARTNERS.GRID_HEADER.REGISTERED')}
            render={this.renderRegisteredColumn}
          />
          <GridColumn
            name="status"
            header={I18n.t('PARTNERS.GRID_HEADER.STATUS')}
            render={this.renderStatusColumn}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(PartnersGrid);
