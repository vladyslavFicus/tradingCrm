import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroller';
import shallowEqual from '../../utils/shallowEqual';
import NotFoundContent from '../NotFoundContent';

class ListView extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    lazyLoad: PropTypes.bool,
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
    lazyLoad: true,
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
      lazyLoad,
      dataSource,
      showNoResults,
    } = this.props;

    if (!lazyLoad) {
      return true;
    }

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
      lazyLoad,
      totalPages,
      activePage,
      last,
    } = this.props;

    const items = dataSource.map((data, key) => this.renderItem(key, data));
    const hasMore = totalPages && activePage ? totalPages > activePage : !last;

    return (
      <Choose>
        <When condition={lazyLoad}>
          <InfiniteScroll
            loadMore={() => this.handlePageChange(activePage + 1)}
            hasMore={hasMore}
          >
            {items}
          </InfiniteScroll>
        </When>
        <Otherwise>
          {items}
        </Otherwise>
      </Choose>
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

  renderPagination() {
    const { activePage, totalPages } = this.props;

    if (totalPages < 2) {
      return null;
    }

    return (
      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        items={totalPages}
        maxButtons={5}
        activePage={activePage}
        onSelect={this.handlePageChange}
        className="b3-pagination"
      />
    );
  }

  render() {
    const {
      showNoResults,
      lazyLoad,
    } = this.props;

    if (showNoResults) {
      return <NotFoundContent />;
    }

    return (
      <Fragment>
        {this.renderItems()}
        {!lazyLoad && this.renderPagination()}
      </Fragment>
    );
  }
}

export default ListView;
