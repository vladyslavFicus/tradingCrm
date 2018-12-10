import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';
import withPlayerClick from '../../utils/withPlayerClick';
import { callbacksStatusesColor } from '../../constants/callbacks';
import GridView, { GridViewColumn } from '../GridView';
import Uuid from '../Uuid';

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
    userId: PropTypes.string,
    onCallbacksQuery: PropTypes.func,
  };

  static defaultProps = {
    userId: null,
    onCallbacksQuery: () => {},
  };

  componentDidUpdate() {
    const { onCallbacksQuery, callbacks } = this.props;

    onCallbacksQuery(callbacks);
  }

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
      userId,
    } = this.props;

    const entities = get(callbacks, 'callbacks.data') || { content: [] };

    return (
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
        {!userId &&
          <GridViewColumn
            name="userId"
            header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
            render={this.renderUser}
          />
        }
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
    );
  }
}

export default withPlayerClick(CallbacksList);
