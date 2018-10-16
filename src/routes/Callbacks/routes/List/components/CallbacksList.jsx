import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { I18n } from 'react-redux-i18n';
import CallbacksGridFilter from './CallbacksGridFilter';
import { callbacksStatusesColor } from '../../../../../constants/callbacks';
import Placeholder from '../../../../../components/Placeholder/index';
import GridView from '../../../../../components/GridView/index';
import GridViewColumn from '../../../../../components/GridView/GridViewColumn';

class CallbacksList extends Component {
  static propTypes = {
    callbacks: PropTypes.object.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    exportEntities: PropTypes.func.isRequired,
    locale: PropTypes.string,
  };

  static defaultProps = {
    locale: 'en',
  };

  componentDidMount() {
    this.props.fetchEntities();
  }

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };
    if (filters.playerOrOperator) {
      filters.id = filters.playerOrOperator;
      filters.userId = filters.playerOrOperator;
    }
    if (Array.isArray(filters.statuses)) {
      filters.statuses = filters.statuses.join(',');
    }
    this.props.fetchEntities(filters);
  };

  handleFilterReset = () => {
    this.props.fetchEntities();
  };

  handleExport = () => {
    this.props.exportEntities();
  };

  renderDateTime = time => (
    <div>
      <div>
        {moment(time).format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment(time).format('HH:mm:ss')}
      </div>
    </div>
  );

  renderStatus = ({ status }) => (
    <div className={classNames('font-weight-700 text-uppercase', callbacksStatusesColor[status].color)}>
      {I18n.t(leadStatuses[status].label)}
    </div>
  );

  render() {
    const { callbacks: {
      isLoading,
      entities: {
        content,
        totalElements,
        page,
        last,
      },
    },
    locale,
    } = this.props;

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
              disabled={!!totalElements}
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

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={content}
            onPageChange={this.handlePageChanged}
            activePage={page}
            last={last}
            lazyLoad
            multiselect
            locale={locale}
            showNoResults={!isLoading && content.length === 0}
          >
            <GridViewColumn
              name="id"
              header={I18n.t('CALLBACKS.GRID_HEADER.ID')}
            />
            <GridViewColumn
              name="userId"
              header={I18n.t('CALLBACKS.GRID_HEADER.CLIENT')}
            />
            <GridViewColumn
              name="callbackTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.TIME')}
              render={this.renderDateTime}
            />
            <GridViewColumn
              name="creationTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.CREATED')}
              render={this.renderDateTime}
            />
            <GridViewColumn
              name="updateTime"
              header={I18n.t('CALLBACKS.GRID_HEADER.MODIFIED')}
              render={this.renderDateTime}
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

export default CallbacksList;
