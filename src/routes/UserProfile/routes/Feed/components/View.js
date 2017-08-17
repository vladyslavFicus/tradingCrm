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
      feed: {
        entities,
        exporting,
        isLoading,
        receivedAt,
      },
      feedTypes: {
        data: availableTypes,
      },
      locale,
    } = this.props;

    return (
      <div className="profile-tab-container">
        <Sticky top={76} bottomBoundary={0}>
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
            notFound={entities.content.length === 0 && isLoading === false && !!receivedAt}
          />
        </div>
      </div>
    );
  }
}

export default View;
