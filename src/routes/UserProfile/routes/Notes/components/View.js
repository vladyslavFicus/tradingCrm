import React, { Component } from 'react';
import moment from 'moment';
import NotesGridFilter from './NotesGridFilter';
import ListView from '../../../../../components/ListView';
import PropTypes from '../../../../../constants/propTypes';
import NoteButton from '../../../../../components/NoteButton';
import { entities, entitiesPrefixes } from '../../../../../constants/uuid';
import { shortify } from '../../../../../utils/uuid';
import './NoteItem.scss';

class View extends Component {
  static propTypes = {
    view: PropTypes.pageableState(PropTypes.noteEntity),
    isLoading: PropTypes.bool,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    fetchEntities: PropTypes.func.isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
    size: 10,
  };

  componentDidMount() {
    this.handleRefresh();
    this.context.setNoteChangedCallback(this.handleNoteChanged);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
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

  handleFilterSubmit = (filters = {}) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleNoteClick = (target, data) => {
    if (data) {
      this.setState({
        page: 0,
      }, this.context.onEditNoteClick(target, data, { placement: 'left' }));
    }
  };

  renderItem = (data) => {
    return (
      <div className="padding-bottom-20">
        <div className="user-wall-item clearfix">
          <div className="s1">
            <span className="avatar" />
          </div>
          <div className="s2">
            <div className="user-wall-item-head">
              <div className="display-block color-secondary font-size-12">
                {
                  data.author &&
                  <span className="font-weight-700 note-author">{`${data.author} - `}</span>
                }
                <span>
                  {shortify(data.lastEditorUUID, entitiesPrefixes[entities.operator])}
                </span>
              </div>
              <span className="display-block font-size-10 color-secondary">
                {
                  data.lastEditionDate
                    ? moment(data.lastEditionDate).format('DD.MM.YYYY HH:mm:ss')
                    : 'Unknown time'
                } to {shortify(data.targetUUID, entitiesPrefixes[data.targetType])}
              </span>
            </div>
            <div className="note panel panel-with-borders">
              <div className="note-content panel-yellow padding-10 font-size-12">
                <div className="row">
                  <div className="col-md-11">
                    { data.content }
                    {
                      data.pinned &&
                      <div className="row padding-left-10 padding-top-10">
                        <span className="label label-info text-uppercase note-label">Pinned Note</span>
                      </div>
                    }
                  </div>
                  <div className="col-md-1">
                    <NoteButton
                      id={`note-item-${data.uuid}`}
                      onClick={id => this.handleNoteClick(id, data)}
                    >
                      <i className="fa fa-edit fa-2x float-right" />
                    </NoteButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { filters } = this.state;
    const {
      view: {
        entities: { content, number, totalPages },
      },
    } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <NotesGridFilter
          onSubmit={this.handleFilterSubmit}
          initialValues={filters}
        />

        <div className="padding-top-20 margin-top-20">
          <div className="user-wall">
            <ListView
              dataSource={content}
              itemClassName="padding-bottom-20"
              onPageChange={this.handlePageChanged}
              render={this.renderItem}
              activePage={number + 1}
              totalPages={totalPages}
              lazyLoad
            />
          </div>
        </div>
      </div>
    );
  }
}

export default View;
