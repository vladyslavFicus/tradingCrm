import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import ListView from '../../../../../../../components/ListView';
import FeedItem from '../../../../../../../components/FeedItem';
import FeedFilterForm from './FeedFilterForm';

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
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.props.fetchFeed(this.props.match.params.id);
    this.handleFiltersChanged();
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
    this.setState({
      filters,
      page: 0,
    }, () => this.handleRefresh());
  };

  handleExportClick = () => {
    this.props.exportFeed(this.props.match.params.id, {
      ...this.state.filters,
      page: this.state.page,
    });
  };

  render() {
    const {
      feed: {
        entities,
        exporting,
        noResults,
      },
      feedTypes: {
        data: availableTypes,
      },
      locale,
    } = this.props;

    return (
      <Fragment>
        <div className="row no-gutters tab-header">
          <div className="col tab-header__title">
            {I18n.t('OPERATOR_PROFILE.FEED.TITLE')}
          </div>
          <div className="col-auto">
            <button
              type="button"
              disabled={exporting}
              className="btn btn-default-outline btn-sm"
              onClick={this.handleExportClick}
            >
              {I18n.t('COMMON.EXPORT')}
            </button>
          </div>
        </div>

        <FeedFilterForm
          availableTypes={availableTypes}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="tab-wrapper">
          <ListView
            dataSource={entities.content}
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
