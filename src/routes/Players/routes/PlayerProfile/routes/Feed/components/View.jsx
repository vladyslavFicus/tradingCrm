import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import ListView from '../../../../../../../components/ListView';
import FeedItem from '../../../../../../../components/FeedItem';
import FeedFilterForm from './FeedFilterForm';
import TabHeader from '../../../../../../../components/TabHeader';

class View extends Component {
  static propTypes = {
    feed: PropTypes.pageableState(PropTypes.auditEntity).isRequired,
    feedTypes: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    fetchFeed: PropTypes.func.isRequired,
    exportFeed: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
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
    this.props.fetchFeed(this.props.match.params.id, {
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
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleExportClick = () => {
    this.props.exportFeed(this.props.match.params.id, {
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
      <Fragment>
        <TabHeader title="Feed">
          <button
            disabled={exporting}
            className="btn btn-sm btn-default-outline"
            onClick={this.handleExportClick}
          >
            {I18n.t('COMMON.EXPORT')}
          </button>
        </TabHeader>
        <FeedFilterForm
          availableTypes={availableTypes}
          onSubmit={this.handleFiltersChanged}
        />
        <div className="tab-wrapper">
          <ListView
            dataSource={entities.content}
            itemClassName="mb-4"
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
      </Fragment>
    );
  }
}

export default View;
