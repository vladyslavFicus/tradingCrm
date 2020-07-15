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
  };

  static defaultProps = {
    scrollParentRef: null,
    initialLoad: false,
    useWindow: true,
    threshold: 250,
  };

  handlePageChanged = () => {
    const { handlePageChanged, isLastPage, isLoading } = this.props;

    if (!isLastPage && !isLoading) {
      handlePageChanged();
    }
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

    const gridRows = gridData.map((gridRowData, index) => (
      <GridRow key={index} rowIndex={index} gridRowData={gridRowData} />
    ));

    return (
      <Choose>
        <When condition={isLoading && !gridData.length}>
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
