import React, { Component } from 'react';
import classNames from 'classnames';
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
    params: PropTypes.object,
  };
  static defaultProps = {
    isLoading: false,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.handleFiltersChanged();
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
      },
      feedTypes: {
        data: availableTypes,
      },
    } = this.props;

    return (
      <div className={classNames('tab-pane fade in active profile-tab-container')}>
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">{I18n.t('OPERATOR_PROFILE.FEED.TITLE')}</span>
          </div>

          <div className="col-sm-9 col-xs-6 text-right">
            <button disabled={exporting} className="btn btn-sm btn-default-outline" onClick={this.handleExportClick}>
              {I18n.t('COMMON.EXPORT')}
            </button>
          </div>
        </div>

        <FeedFilterForm
          availableTypes={availableTypes}
          onSubmit={this.handleFiltersChanged}
        />

        <div className="row">
          <div className="col-md-12 margin-top-20">
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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default View;
