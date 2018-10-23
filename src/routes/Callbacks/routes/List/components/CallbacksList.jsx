import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { I18n } from 'react-redux-i18n';
import CallbacksGridFilter from './CallbacksGridFilter';
import { shortify } from '../../../../../utils/uuid';
import { callbacksStatusesColor } from '../../../../../constants/callbacks';
import Placeholder from '../../../../../components/Placeholder/index';
import GridView from '../../../../../components/GridView/index';
import GridViewColumn from '../../../../../components/GridView/GridViewColumn';
import CallbackDetailsModal from '../../../../../components/CallbackDetailsModal';

const MODAL_CALLBACK_DETAIL = 'callback-detail';
const defaultModalState = {
  name: null,
  params: {},
};

class CallbacksList extends Component {
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    exportEntities: PropTypes.func.isRequired,
    updateEntity: PropTypes.func.isRequired,
    locale: PropTypes.string,
    fetchOperators: PropTypes.func.isRequired,
  };

  static defaultProps = {
    locale: 'en',
  };

  static contextTypes = {
    notes: PropTypes.shape({
      onAddNote: PropTypes.func.isRequired,
      onEditNote: PropTypes.func.isRequired,
      onAddNoteClick: PropTypes.func.isRequired,
      onEditNoteClick: PropTypes.func.isRequired,
      setNoteChangedCallback: PropTypes.func.isRequired,
      hidePopover: PropTypes.func.isRequired,
    }),
  };

  state = {
    modal: { ...defaultModalState },
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.props.fetchEntities();
  }

  onPageChange = (page) => {
    this.setState({ page: page - 1 });
    this.props.fetchEntities({ ...this.state.filters, page: page - 1 });
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
    this.setState({ filters });
    this.props.fetchEntities(filters);
  };

  handleFilterReset = () => {
    this.setState({ filters: {} });
    this.props.fetchEntities();
  };

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handleExport = () => {
    this.props.exportEntities();
  };

  handleOpenDetailModal = async (params) => {
    this.setState({
      modal: {
        ...defaultModalState,
        name: MODAL_CALLBACK_DETAIL,
        params,
      },
    });
  };

  handleCloseModal = (refetch) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (refetch === true) {
        this.handleRefresh();
      }
    });
  };

  handleNoteClick = (target, note, data) => {
    const { notes: { onEditNoteClick, onAddNoteClick } } = this.context;

    if (note) {
      onEditNoteClick(target, note, { placement: 'left' });
    } else {
      onAddNoteClick(target, data.callbackId, { placement: 'left' });
    }
  };

  renderId = item => (
    <div>
      <div className="font-weight-700">
        {shortify(item.callbackId, 'CB')}
      </div>
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')} {shortify(item.operatorId, 'OP') || 'n/a'}
      </div>
    </div>
  );

  renderUser = item => (
    <div className="font-weight-700">
      {shortify(item.userId)}
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
    const { callbacks: {
      isLoading,
      entities: {
        content,
        totalElements,
        totalPages,
        last,
        number,
      },
    },
    locale,
    fetchOperators,
    updateEntity,
    } = this.props;
    const { modal } = this.state;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!isLoading && !!content}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <Choose>
              <When condition={!!totalElements}>
                <span className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{totalElements} </strong>
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

          <div className="ml-auto">
            <button
              disabled={!totalElements}
              className="btn btn-default-outline margin-left-15"
              onClick={this.handleExport}
              type="button"
            >
              {I18n.t('COMMON.EXPORT')}
            </button>
          </div>
        </div>

        <CallbacksGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
        />

        <div className="card-body card-grid">
          <GridView
            tableClassName="table-hovered"
            dataSource={content}
            onPageChange={this.onPageChange}
            activePage={number + 1}
            totalPages={totalPages}
            onRowClick={this.handleOpenDetailModal}
            last={last}
            lazyLoad
            locale={locale}
            showNoResults={!isLoading && content.length === 0}
          >
            <GridViewColumn
              name="id"
              header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
              render={this.renderId}
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
        {
          modal.name === MODAL_CALLBACK_DETAIL &&
            <CallbackDetailsModal
              callback={modal.params}
              isOpen
              onClose={this.handleCloseModal}
              onSubmit={updateEntity}
              onNoteClick={this.handleNoteClick}
              initialValues={modal.params}
              fetchOperators={fetchOperators}
            />
        }
      </div>
    );
  }
}

export default CallbacksList;
