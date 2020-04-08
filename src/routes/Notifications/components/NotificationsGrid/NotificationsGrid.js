import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import MiniProfile from 'components/MiniProfile';
import { notificationCenterSubTypesLabels } from 'constants/notificationCenter';

const prioritiesColor = {
  MEDIUM: 'Notifications__columns-priority-text--medium',
  HIGH: 'Notifications__columns-priority-text--high',
  LOW: 'Notifications__columns-priority-text--low',
};

class NotificationsGrid extends PureComponent {
  static propTypes = {
    handlePageChanged: PropTypes.func.isRequired,
    searchLimit: PropTypes.number.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    entities: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        priority: PropTypes.string.isRequired,
        agent: PropTypes.shape({
          uuid: PropTypes.string.isRequired,
          fullName: PropTypes.string.isRequired,
        }),
        client: PropTypes.shape({
          uuid: PropTypes.string.isRequired,
          fullName: PropTypes.string.isRequired,
          languageCode: PropTypes.string,
        }),
        createdAt: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        details: PropTypes.shape({
          platformType: PropTypes.string,
          amount: PropTypes.string,
          currency: PropTypes.string,
          login: PropTypes.string,
        }),
        subtype: PropTypes.string.isRequired,
      }),
    ).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  renderNotificationId = ({ uuid }) => (
    <div>
      <span className="font-weight-700">{ uuid }</span>
    </div>
  );

  renderPriority = ({ priority }) => (
    <div className={classNames(
      prioritiesColor[priority],
      'font-weight-700 text-uppercase',
    )}
    >
      {priority}
    </div>
  );

  renderAgent = ({ agent }) => (
    <Choose>
      <When condition={agent}>
        <div className="font-weight-700">
          {agent.fullName}
        </div>
        <div className="font-size-11">
          <MiniProfile id={agent.uuid} type="operator">
            <Uuid uuid={agent.uuid} />
          </MiniProfile>
        </div>
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  );

  renderClient = ({ client }) => (
    <Choose>
      <When condition={client}>
        <Link to={`/clients/${client.uuid}/profile`}>
          <div className="font-weight-700">
            {client.fullName}
          </div>
          <div className="font-size-11">
            <MiniProfile id={client.uuid} type="player">
              <Uuid uuid={client.uuid} />
            </MiniProfile>
            {!!client.languageCode && <span> - {client.languageCode}</span>}
          </div>
        </Link>
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  );

  renderNotificationDate = ({ createdAt }) => (
    <Fragment>
      <div className="font-weight-700">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  renderNotificationType = ({ type }) => (
    <div>
      <span className="font-weight-700">{type}</span>
    </div>
  );

  renderNotificationTypeDetails = ({ type, details, subtype }) => (
    <Fragment>
      <Choose>
        <When
          condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}
        >
          <span className="font-weight-700">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
          <div className="font-size-11">{details.amount} {details.currency}</div>
        </When>
        <When condition={type === 'ACCOUNT'}>
          <span className="font-weight-700">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
          <div className="font-size-11">{details.platformType} - {details.login}</div>
        </When>
        <When condition={type === 'KYC'}>
          <span className="font-weight-700">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
        </When>
      </Choose>
    </Fragment>
  );

  render() {
    const {
      handlePageChanged,
      searchLimit,
      isLastPage,
      entities,
      loading,
    } = this.props;

    return (
      <Grid
        data={entities}
        isLastPage={isLastPage}
        withNoResults={!loading && entities.length === 0}
        withLazyLoad={!searchLimit || searchLimit !== entities.length}
        handlePageChanged={handlePageChanged}
        rowsClassNames={
          ({ priority }) => classNames({
            'Notifications__columns-color--high': priority === 'HIGH',
            'Notifications__columns-color--medium': priority === 'MEDIUM',
            'Notifications__columns-color--low': priority === 'LOW',
          })
        }
      >
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_ID')}
          render={this.renderNotificationId}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
          render={this.renderPriority}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.AGENT')}
          render={this.renderAgent}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
          render={this.renderClient}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
          render={this.renderNotificationDate}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
          render={this.renderNotificationType}
        />
        <GridColumn
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
          render={this.renderNotificationTypeDetails}
        />
      </Grid>
    );
  }
}

export default NotificationsGrid;
