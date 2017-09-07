import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../constants/propTypes';
import ListView from '../../../../../components/ListView';
import FeedItem from '../../../../../components/FeedItem';
import FeedFilterForm from './FeedFilterForm';

class View extends Component {
  static propTypes = {
    feed: PropTypes.pageableState(PropTypes.auditEntity).isRequired,
    feedTypes: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    fetchFeed: PropTypes.func.isRequired,
    exportFeed: PropTypes.func.isRequired,
    params: PropTypes.object,
    locale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleFiltersChanged();
    this.context.cacheChildrenComponent(this);
  }

  componentWillUnmount() {
    this.context.cacheChildrenComponent(null);
  }

  handleRefresh = () => {
    this.props.fetchFeed(this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  handlePageChanged = (page) => {
    if (!this.props.feed.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({
      filters,
      page: 0,
    }, () => this.handleRefresh());
  };

  handleExportClick = () => {
    this.props.exportFeed(this.props.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  render() {
    const {
      feed: { entities, exporting, noResults },
      feedTypes: { data: availableTypes },
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="1">
          <div className="tab-header">
            <div className="tab-header__heading">Feed</div>
            <div className="tab-header__actions">
              <button disabled={exporting} className="btn btn-sm btn-default-outline" onClick={this.handleExportClick}>
                Export
              </button>
            </div>
          </div>
        </Sticky>

        <FeedFilterForm
          availableTypes={availableTypes}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="margin-top-20 tab-content">
          <div className="padding-bottom-20">
            <div className="feed-item">
              <div className="feed-item_avatar">
                <div className="feed-item_avatar-letter">s</div>
              </div>
              <div className="feed-item_info">
                <div className="feed-item_info-status feed-item_info-status__green">
                  Login automatically unlocked
                  <span className="pull-right">AU-24525wetw</span>
                </div>
                <div className="feed-item_info-name">
                  <span className="audit-name">System</span>
                </div>
                <div className="feed-item_info-date">
                  07.09.2017 08:10:54
                </div>
              </div>
            </div>
          </div>

          <div className="padding-bottom-20">
            <div className="feed-item">
              <div className="feed-item_avatar">
                <div className="feed-item_avatar-letter feed-item_avatar-letter_orange">HC</div>
              </div>
              <div className="feed-item_info">
                <div className="feed-item_info-status feed-item_info-status__green">
                  Login manually unlocked
                  <span className="pull-right">AU-24525wetw</span>
                </div>
                <div className="feed-item_info-name">
                  <span className="audit-name blue">Helen Cassar</span>
                  {' - '}
                  <span className="copy-clipboard-container">OP-444442ye</span>
                </div>
                <div className="feed-item_info-date">
                  07.09.2017 08:10:54
                </div>
              </div>
            </div>
          </div>

          <div className="padding-bottom-20">
            <div className="feed-item">
              <div className="feed-item_avatar">
                <div className="feed-item_avatar-letter">s</div>
              </div>
              <div className="feed-item_info">
                <div className="feed-item_info-status feed-item_info-status__red">
                  Login locked
                  <span className="pull-right">AU-24525wetw</span>
                </div>
                <div className="feed-item_info-name">
                  <span className="audit-name">System</span>
                </div>
                <div className="feed-item_info-date">
                  07.09.2017 08:10:54
                  <button className="feed-item_info-date_btn-hide btn-transparent">
                    <span>Hide details <i className="fa fa-caret-down" /></span>
                  </button>
                </div>
                <div className="feed-item_info-details">
                  <div>Reason: <span className="feed-item_info-details_value">5 failed login attempts</span></div>
                  <div>Locked until: <span className="feed-item_info-details_value">2016-10-20 17:50:07</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="padding-bottom-20">
            <div className="feed-item">
              <div className="feed-item_avatar">
                <div className="feed-item_avatar-letter">s</div>
              </div>
              <div className="feed-item_info">
                <div className="feed-item_info-status feed-item_info-status__red">
                  Failed login attempt registered
                  <span className="pull-right">AU-24525wetw</span>
                </div>
                <div className="feed-item_info-name">
                  <span className="audit-name">System</span>
                </div>
                <div className="feed-item_info-date">
                  07.09.2017 08:10:54 from 14.161.121.243
                  <button className="feed-item_info-date_btn-hide btn-transparent">
                    <span>Hide details <i className="fa fa-caret-down" /></span>
                  </button>
                </div>
                <div className="feed-item_info-details">
                  <div>IP: <span className="feed-item_info-details_value">14.161.121.243 - Ukraine</span></div>
                  <div>Attempt date & time: <span className="feed-item_info-details_value">19.10.2016 at 10:15:36</span></div>
                  <div>Device: <span className="feed-item_info-details_value">Desktop (macOS 10.12.3, Chrome V56.0.2924.87 64bit English, 2880x1800px )</span></div>
                </div>
              </div>
            </div>
          </div>

          <ListView
            dataSource={entities.content}
            itemClassName="padding-bottom-20"
            onPageChange={this.handlePageChanged}
            render={(item, key) => {
              const options = {
                color: 'blue',
                letter: item.authorFullName.split(' ').splice(0, 2).map(word => word[0]).join(''),
              };

              if (item.authorUuid !== item.targetUuid) {
                if (item.authorUuid) {
                  options.color = 'orange';
                } else {
                  options.color = '';
                  options.letter = 's';
                }
              }

              return (
                <FeedItem
                  key={key}
                  data={item}
                  {...options}
                />
              );
            }}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
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
