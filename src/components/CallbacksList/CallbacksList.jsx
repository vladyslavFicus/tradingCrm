import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { callbacksStatusesColor } from 'constants/callbacks';
import NoteButton from 'components/NoteButton';
import Grid, { GridColumn } from 'components/Grid';
import Uuid from 'components/Uuid';
import { shortify } from 'utils/uuid';

class CallbacksList extends Component {
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    modals: PropTypes.shape({
      callbackDetails: PropTypes.modalType,
    }).isRequired,
    withoutClientColumn: PropTypes.bool,
  };

  static defaultProps = {
    withoutClientColumn: false,
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

  handleOpenDetailModal = ({ callbackId }) => {
    this.props.modals.callbackDetails.show({ callbackId });
  };

  handleClientClick = ({ userId }) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    window.open(`/clients/${userId}/profile`, '_blank');
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
      <If condition={item.operator}>
        <div className="font-weight-700">
          {item.operator.fullName}
        </div>
      </If>
      <div className="font-size-11">
        <Uuid uuid={item.operatorId} />
      </div>
    </div>
  );

  renderUser = item => (
    <div>
      <If condition={item.client}>
        <button type="button" className="font-weight-700" onClick={this.handleClientClick(item)}>
          {item.client.fullName}
        </button>
      </If>
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

  renderActions = ({ callbackId, userId, note }) => (
    <NoteButton
      key={callbackId}
      targetType={targetTypes.CALLBACK}
      targetUUID={callbackId}
      playerUUID={userId}
      note={note}
    />
  );

  render() {
    const {
      callbacks,
      callbacks: { loading },
      withoutClientColumn,
    } = this.props;

    const entities = get(callbacks, 'callbacks.data') || { content: [] };

    return (
      <Grid
        data={entities.content}
        handleRowClick={this.handleOpenDetailModal}
        handlePageChanged={this.onPageChange}
        isLoading={loading && !entities.content.length}
        isLastPage={entities.last}
        withRowsHover
        withLazyLoad
        withNoResults={entities.content.length === 0}
      >
        <GridColumn
          name="id"
          header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
          render={this.renderId}
        />
        <GridColumn
          name="operatorId"
          header={I18n.t('CALLBACKS.GRID_HEADER.OPERATOR')}
          render={this.renderOperator}
        />
        <If condition={!withoutClientColumn}>
          <GridColumn
            name="userId"
            header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
            render={this.renderUser}
          />
        </If>
        <GridColumn
          name="callbackTime"
          header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
          render={data => this.renderDateTime(data, 'callbackTime')}
        />
        <GridColumn
          name="creationTime"
          header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
          render={data => this.renderDateTime(data, 'creationTime')}
        />
        <GridColumn
          name="updateTime"
          header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
          render={data => this.renderDateTime(data, 'updateTime')}
        />
        <GridColumn
          name="status"
          header={I18n.t('CALLBACKS.GRID_HEADER.STATUS')}
          render={this.renderStatus}
        />
        <GridColumn
          name="actions"
          header=""
          render={this.renderActions}
        />
      </Grid>
    );
  }
}

export default CallbacksList;
