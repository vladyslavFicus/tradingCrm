import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { withGridContext } from '../GridProvider';
import GridLoader from '../GridLoader';
import GridRow from '../GridRow';

class GridBody extends PureComponent {
  static propTypes = {
    gridData: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLastPage: PropTypes.bool.isRequired,
    handlePageChanged: PropTypes.func.isRequired,
    withLazyLoad: PropTypes.bool.isRequired,
    scrollParentRef: PropTypes.object,
    initialLoad: PropTypes.bool,
    useWindow: PropTypes.bool,
    threshold: PropTypes.number,
    sorts: PropTypes.object,
  };

  static defaultProps = {
    scrollParentRef: null,
    initialLoad: false,
    useWindow: true,
    threshold: 250,
    sorts: null,
  };

  state = {
    isLoadMore: false,
    isSort: false,
    sorts: this.props.sorts, // eslint-disable-line
  };

  static getDerivedStateFromProps = (props, state) => ({
    isLoadMore: props.isLoading && state.isLoadMore,
    isSort: props.sorts !== state.sorts,
    sorts: props.sorts,
  });

  handlePageChanged = () => {
    const { handlePageChanged, isLastPage, isLoading } = this.props;

    if (!isLastPage && !isLoading) {
      handlePageChanged();
    }

    this.setState({ isLoadMore: true });
  };

  render() {
    const {
      gridData,
      isLoading,
      isLastPage,
      withLazyLoad,
      scrollParentRef,
      initialLoad,
      threshold,
      useWindow,
    } = this.props;

    const {
      isLoadMore,
      isSort,
    } = this.state;

    const gridRows = gridData.map((gridRowData, index) => (
      <GridRow key={index} rowIndex={index} gridRowData={gridRowData} />
    ));

    return (
      <Choose>
        <When condition={isLoading && !isLoadMore && !isSort}>
          <tbody>
            <GridLoader />
          </tbody>
        </When>
        <When condition={withLazyLoad}>
          <InfiniteScroll
            element="tbody"
            hasMore={!isLastPage}
            loader={<GridLoader key="grid-loader" />}
            loadMore={this.handlePageChanged}
            initialLoad={initialLoad}
            useWindow={useWindow}
            getScrollParent={scrollParentRef && (() => scrollParentRef)}
            threshold={threshold}
          >
            {gridRows}
          </InfiniteScroll>
        </When>
        <Otherwise>
          <tbody>{gridRows}</tbody>
        </Otherwise>
      </Choose>
    );
  }
}

export default withGridContext(GridBody);
