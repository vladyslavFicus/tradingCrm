import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import ListView from '../../../../../components/ListView';
import FeedItem from './FeedItem';

class View extends Component {
  static propTypes = {
    feed: PropTypes.pageableState().isRequired,
    fetchFeed: PropTypes.func.isRequired,
    params: PropTypes.object,
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

  render() {
    const {
      feed: {
        entities,
      },
    } = this.props;

    return (
      <div className={classNames('tab-pane fade in active profile-tab-container')}>
        <div className="row margin-bottom-20">
          <div className="col-md-3">
            <span className="font-size-20">Feed</span>
          </div>

          <div className="col-md-3 col-md-offset-6 text-right">
            <button disabled className="btn btn-default-outline">
              Export
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <ListView
              dataSource={entities.content}
              itemClassName="padding-bottom-20"
              onPageChange={this.handlePageChanged}
              render={(item, key) => <FeedItem key={key} data={item} letter="o" letterColor="green" />}
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
