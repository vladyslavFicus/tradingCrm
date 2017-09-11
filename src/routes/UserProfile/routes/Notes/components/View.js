import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Sticky from 'react-stickynode';
import NotesGridFilter from './NotesGridFilter';
import ListView from '../../../../../components/ListView';
import PropTypes from '../../../../../constants/propTypes';
import PopoverButton from '../../../../../components/PopoverButton';
import { entities, entitiesPrefixes } from '../../../../../constants/uuid';
import Uuid from '../../../../../components/Uuid';

class View extends Component {
  static propTypes = {
    view: PropTypes.pageableState(PropTypes.noteEntity),
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    noteTypes: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    size: 10,
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleNoteChanged);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
    this.context.cacheChildrenComponent(null);
  }

  handleNoteChanged = () => {
    this.setState({
      page: 0,
    }, this.handleRefresh());
  };

  handleRefresh = () => {
    this.props.fetchEntities({
      ...this.state.filters,
      page: this.state.page,
      size: this.state.size,
      playerUUID: this.props.params.id,
    });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleNoteClick = (target, data) => {
    if (data) {
      this.context.onEditNoteClick(target, data, { placement: 'left' });
    }
  };

  renderItem = data => (
    <div className="padding-bottom-20">
      <div className="feed-item">
        <div className="feed-item_avatar">
          <div className="feed-item_avatar-letter feed-item_avatar-letter_blue">o</div>
        </div>
        <div className="feed-item_info">
          <div className="feed-item_cheading">
            <div className="color-secondary">
              {
                data.author &&
                <span className="font-weight-700 feed-item_author">{`${data.author} - `}</span>
              }
              {
                data.lastEditorUUID &&
                <span>
                  <Uuid uuid={data.lastEditorUUID} uuidPrefix={entitiesPrefixes[entities.operator]} />
                </span>
              }
            </div>
            <div className="font-size-11 color-secondary">
              {
                data.lastEditionDate
                  ? moment(data.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
                  : I18n.t('COMMON.UNKNOWN_TIME')
              }
              {' '}
              {I18n.t('COMMON.TO')}
              {' '}
              <Uuid uuid={data.targetUUID} uuidPrefix={entitiesPrefixes[data.targetType]} />
            </div>
          </div>
          <div className="note panel margin-top-5">
            <div className="feed-item_content padding-10">
              <div className="row">
                <div className="col-md-11">
                  {data.content}
                  {
                    data.pinned &&
                    <div className="padding-top-10">
                      <span className="label label-info text-uppercase font-size-11">Pinned Note</span>
                    </div>
                  }
                </div>
                <div className="col-md-1 text-right">
                  <PopoverButton
                    id={`note-item-${data.uuid}`}
                    onClick={id => this.handleNoteClick(id, data)}
                  >
                    <i className="note-icon note-with-text" />
                  </PopoverButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      view: {
        entities: { content, number, totalPages },
        noResults,
      },
      noteTypes: {
        data: availableTypes,
      },
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
          <div className="tab-header">
            <div className="tab-header__heading">Notes</div>
          </div>
        </Sticky>

        <NotesGridFilter
          onSubmit={this.handleFiltersChanged}
          availableTypes={availableTypes}
        />

        <div className="tab-content">
          <ListView
            dataSource={content}
            itemClassName="note-item"
            onPageChange={this.handlePageChanged}
            render={this.renderItem}
            activePage={number + 1}
            totalPages={totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
          />
        </div>
      </div>
    );
  }
}

export default View;
