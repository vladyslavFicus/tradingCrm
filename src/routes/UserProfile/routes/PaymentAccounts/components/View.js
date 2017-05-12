import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { I18n } from 'react-redux-i18n';
import { targetTypes as noteTargetTypes } from '../../../../../constants/note';
import PropTypes from '../../../../../constants/propTypes';
import { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import PopoverButton from '../../../../../components/PopoverButton';
import CollapseGridView from '../../../../../components/GridView/CollapseGridView';
import CommonFileGridView from '../../../components/CommonFileGridView';
import { targetTypes as fileTargetTypes } from '../../../../../components/Files/constants';
import Amount from '../../../../../components/Amount';

class View extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    paymentAccounts: PropTypes.object,
    fetchEntities: PropTypes.func.isRequired,
    changeFileStatusByAction: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    fetchFilesAndNotes: PropTypes.func.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    onUploadFileClick: PropTypes.func.isRequired,
    setFileChangedCallback: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
  };
  state = {
    openUUID: null,
  };

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
    this.context.setFileChangedCallback(this.handleRefreshFiles);
    this.handleRefresh();
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.setFileChangedCallback(null);
  }

  handleRefresh = () => {
    return this.props.fetchEntities(this.props.params.id);
  };

  handleRefreshFiles = () => {
    const targetUUIDs = Object.keys(this.props.paymentAccounts);
    this.props.fetchFilesAndNotes(this.props.params.id, targetUUIDs);
  };

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, { placement: 'left' });
    } else {
      this.context.onAddNoteClick(data.uuid, noteTargetTypes.PAYMENT_ACCOUNT)(target, { placement: 'left' });
    }
  };

  handleStatusActionClick = (uuid, action) => {
    this.props.changeFileStatusByAction(uuid, action);
  };

  handleDownloadFileClick = (e, data) => {
    e.preventDefault();

    this.props.downloadFile(data);
  };

  handleDeleteFileClick = (e, data) => {
    this.context.onDeleteFileClick(e, data);
  }

  toggleAccountFiles = (openUUID) => {
    this.setState({
      openUUID: openUUID === this.state.openUUID ? null : openUUID,
    });
  };

  handleUploadFileClick = (data) => {
    this.context.onUploadFileClick({
      targetUuid: data.uuid,
      targetType: fileTargetTypes.PAYMENT_ACCOUNT,
      fileInitialValues: {
        category: fileTargetTypes.PAYMENT_ACCOUNT,
      },
    });
  };

  renderPaymentAccount = (data) => {
    return (
      <div>
        <div className="font-weight-700 text-uppercase">{data.paymentMethod}</div>
        <div className="text-muted font-size-10">{shortify(data.details)}</div>
      </div>
    );
  };

  renderAddDate = (data) => {
    return (
      <div>
        <div className="font-weight-700">
          {moment(data.creationDate).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.creationDate).format('HH:mm:ss')}
        </span>
      </div>
    );
  };

  renderLastPaymentDate = (data) => {
    if (!(data.lastPayment && data.lastPayment.creationTime)) {
      return null;
    }

    return (
      <div>
        <div className="font-weight-700">
          {moment(data.lastPayment.creationTime).format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {moment(data.lastPayment.creationTime).format('HH:mm:ss')}
        </span>
      </div>
    );
  };

  renderAggregateAmount = (data, column) => {
    const aggregate = data[column.name];
    if (!aggregate) {
      return null;
    }

    return (
      <div>
        <div className="font-weight-700">
          <Amount {...aggregate.total} />
        </div>
        <span className="font-size-10 color-default">
          {I18n.t('COMMON.COUNT')}: {aggregate.count}
        </span>
      </div>
    );
  };

  renderNotes = (data) => {
    return (
      <div>
        <PopoverButton
          id={`payment-account-item-note-button-${data.uuid}`}
          className="cursor-pointer margin-right-5"
          onClick={id => this.handleNoteClick(id, data)}
        >
          {data.note
            ? <i className="fa fa-sticky-note" />
            : <i className="fa fa-sticky-note-o" />
          }
        </PopoverButton>
      </div>
    );
  };

  renderFiles = (data) => {
    const filesCount = _.size(data.files);

    if (!filesCount) {
      return (
        <button
          className="btn-transparent"
          onClick={() => this.handleUploadFileClick(data)}
        >
          <span className="margin-right-5">+</span>
          <i className="fa fa-paperclip" aria-hidden="true" />
        </button>
      );
    }

    return (
      <button
        className="btn-transparent"
        onClick={() => this.toggleAccountFiles(data.uuid)}
      >
        <span className="margin-right-5">{filesCount}</span>
        <i className="fa fa-paperclip" aria-hidden="true" />
      </button>
    );
  };

  renderCollapseBlock = (data) => {
    return (
      <div>
        <div className="row margin-bottom-10">
          <div className="col-sm-4 col-xs-6">
            <span className="font-size-16">
              {I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.ATTACHED_FILES')}
            </span>
          </div>
          <div className="col-sm-8 col-xs-6 text-right">
            <button
              className="btn btn-sm btn-primary-outline"
              onClick={() => this.handleUploadFileClick(data)}
            >
              + {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
            </button>
          </div>
        </div>

        <CommonFileGridView
          dataSource={_.values(data.files)}
          tableClassName="table table-hovered data-grid-layout payment-account-attached"
          headerClassName="text-uppercase"
          totalPages={1}
          onStatusActionClick={this.handleStatusActionClick}
          onDownloadFileClick={this.handleDownloadFileClick}
          onDeleteFileClick={this.handleDeleteFileClick}
        />
      </div>
    );
  };

  render() {
    const { paymentAccounts } = this.props;
    const { openUUID } = this.state;

    return (
      <div className={'tab-pane fade in active profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">
              {I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.TITLE')}
            </span>
          </div>
        </div>

        <CollapseGridView
          dataSource={_.values(paymentAccounts)}
          openUUID={openUUID}
          collapsedDataFieldName="files"
          tableClassName="table table-hovered data-grid-layout"
          headerClassName="text-uppercase"
          renderCollapseBlock={this.renderCollapseBlock}
          collapseClassName="payment-account-attached"
        >
          <GridColumn
            name="paymentMethod"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.PAYMENT_ACCOUNT')}
            render={this.renderPaymentAccount}
          />
          <GridColumn
            name="dateAdded"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.DATE_ADDED')}
            render={this.renderAddDate}
          />
          <GridColumn
            name="lastPayment"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.LAST_PAYMENT')}
            render={this.renderLastPaymentDate}
          />
          <GridColumn
            name="withdraws"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.WITHDRAWS')}
            render={this.renderAggregateAmount}
          />
          <GridColumn
            name="deposits"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.DEPOSITS')}
            render={this.renderAggregateAmount}
          />
          <GridColumn
            name="Files"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.FILES')}
            headerClassName="text-uppercase"
            render={this.renderFiles}
          />
          <GridColumn
            name="notes"
            header={I18n.t('PLAYER_PROFILE.PAYMENT_ACCOUNT.COLUMN.NOTE')}
            headerClassName="text-uppercase"
            render={this.renderNotes}
          />
        </CollapseGridView>
      </div>
    );
  }
}

export default View;
