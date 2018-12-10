import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import PropTypes from '../../../../../constants/propTypes';
import history from '../../../../../router/history';
import { shortify } from '../../../../../utils/uuid';
import withPlayerClick from '../../../../../utils/withPlayerClick';
import { callbacksStatusesColor } from '../../../../../constants/callbacks';
import Placeholder from '../../../../../components/Placeholder';
import GridView from '../../../../../components/GridView';
import GridViewColumn from '../../../../../components/GridView/GridViewColumn';
import Uuid from '../../../../../components/Uuid';
import CallbacksGridFilter from './CallbacksGridFilter';

class CallbacksList extends Component {
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    modals: PropTypes.shape({
      callbackDetails: PropTypes.modalType,
    }).isRequired,
    onPlayerClick: PropTypes.func.isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
  };

  onPageChange = () => {
    const {
      callbacks: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (filters.playerOrOperator) {
      filters.id = filters.playerOrOperator;
      filters.userId = filters.playerOrOperator;
    }

    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }

    history.replace({ query: { filters } });
  };

  handleFilterReset = () => {
    history.replace({ query: { filters: {} } });
  };

  handleOpenDetailModal = (callback) => {
    this.props.modals.callbackDetails.show({ callback, initialValues: callback });
  };

  handleClientClick = ({ userId, client: { fullName } }) => (e) => {
    e.stopPropagation();

    this.props.onPlayerClick({
      playerUUID: userId,
      auth: this.props.auth,
      firstName: fullName,
    });
  };

  renderId = item => (
    <div>
      <div className="font-weight-700">
        {shortify(item.callbackId, 'CB')}
      </div>
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={item.operatorId} />
      </div>
    </div>
  );

  renderOperator = item => (
    <div>
      <div className="font-weight-700">
        {item.operator.fullName}
      </div>
      <div className="font-size-11">
        <Uuid uuid={item.operatorId} />
      </div>
    </div>
  );

  renderUser = item => (
    <div>
      <button className="font-weight-700" onClick={this.handleClientClick(item)}>
        {item.client.fullName}
      </button>
      <div className="font-size-11">
        <Uuid uuid={item.userId} />
      </div>
    </div>
  );

  renderDateTime = (item, field) => (
    <div>
      <div className="font-weight-700">
        {moment(item[field]).format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment(item[field]).format('HH:mm:ss')}
      </div>
    </div>
  );

  renderStatus = ({ status }) => (
    <div className={classNames('font-weight-700 text-uppercase', callbacksStatusesColor[status])}>
      {status}
    </div>
  );

  render() {
    const {
      callbacks,
      callbacks: { loading },
    } = this.props;

    const entities = get(callbacks, 'callbacks.data') || { content: [] };

    return (
      <div className="card">
        <div className="card-heading justify-content-between">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!entities.totalElements}>
                <span className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{entities.totalElements} </strong>
                    {I18n.t('CALLBACKS.CALLBACKS')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('CALLBACKS.CALLBACKS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
          <Link to="/callbacks/calendar">
            <i className="font-size-20 fa fa-calendar" />
          </Link>
        </div>

        <CallbacksGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
        />

        <div className="card-body card-grid">
          <GridView
            loading={loading}
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.onPageChange}
            activePage={entities.number + 1}
            onRowClick={this.handleOpenDetailModal}
            last={entities.last}
            lazyLoad
            showNoResults={entities.content.length === 0}
          >
            <GridViewColumn
              name="id"
              header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
              render={this.renderId}
            />
            <GridViewColumn
              name="operatorId"
              header={I18n.t('CALLBACKS.GRID_HEADER.OPERATOR')}
              render={this.renderOperator}
            />
            <GridViewColumn
              name="userId"
              header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
              render={this.renderUser}
            />
            <GridViewColumn
              name="callbackTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
              render={data => this.renderDateTime(data, 'callbackTime')}
            />
            <GridViewColumn
              name="creationTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
              render={data => this.renderDateTime(data, 'creationTime')}
            />
            <GridViewColumn
              name="updateTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
              render={data => this.renderDateTime(data, 'updateTime')}
            />
            <GridViewColumn
              name="status"
              header={I18n.t('CALLBACKS.GRID_HEADER.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default withPlayerClick(CallbacksList);
