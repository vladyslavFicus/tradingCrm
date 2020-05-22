import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import shallowEqual from '../../utils/shallowEqual';
import NotFoundContent from '../NotFoundContent';

class ListView extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    dataSource: PropTypes.array.isRequired,
    defaultFilters: PropTypes.object,
    onPageChange: PropTypes.func,
    activePage: PropTypes.number,
    totalPages: PropTypes.number,
    showNoResults: PropTypes.bool,
    last: PropTypes.bool,
  };

  static defaultProps = {
    defaultFilters: {},
    showNoResults: false,
    onPageChange: null,
    activePage: 0,
    totalPages: null,
    last: true,
  };

  state = {
    filters: this.props.defaultFilters || {},
  };

  shouldComponentUpdate(nextProps) {
    const {
      dataSource,
      showNoResults,
    } = this.props;

    return !shallowEqual(nextProps.dataSource, dataSource)
      || nextProps.showNoResults !== showNoResults;
  }

  handlePageChange = (eventKey) => {
    const {
      totalPages,
      activePage,
      onPageChange,
      last,
    } = this.props;

    const hasMore = totalPages && activePage ? totalPages > activePage : !last;

    if (typeof onPageChange === 'function' && hasMore) {
      onPageChange(eventKey, this.state.filters);
    }
  };

  renderItems = () => {
    const {
      dataSource,
      totalPages,
      activePage,
      last,
    } = this.props;

    const items = dataSource.map((data, key) => this.renderItem(key, data));
    const hasMore = totalPages && activePage ? totalPages > activePage : !last;

    return (
      <InfiniteScroll
        loadMore={() => this.handlePageChange(activePage + 1)}
        hasMore={hasMore}
      >
        {items}
      </InfiniteScroll>
    );
  };

  renderItem = (key, data) => {
    if (typeof this.props.render !== 'function') {
      return null;
    }

    const content = this.props.render.call(null, data, this.props, this.state.filters);

    return (
      <Fragment key={key}>
        {content}
      </Fragment>
    );
  };

  render() {
    const { showNoResults } = this.props;

    if (showNoResults) {
      return <NotFoundContent />;
    }

    return this.renderItems();
  }
}

export default ListView;
