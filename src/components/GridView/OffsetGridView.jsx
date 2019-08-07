import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PermissionContent from '../PermissionContent';
import GridViewRow from './GridViewRow';
import GridViewColumn from './GridViewColumn';
import GridViewLoader from './GridViewLoader';
import GridViewHeader from './GridViewHeader';

class OffsetGridView extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    rows: PropTypes.array,
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    limit: PropTypes.number,
    offset: PropTypes.number,
    onLoadMore: PropTypes.func,
    tableClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    hasMore: PropTypes.bool,
  };

  static defaultProps = {
    rows: [],
    rowClassName: null,
    limit: 20,
    offset: 0,
    onLoadMore: null,
    tableClassName: null,
    headerClassName: null,
    hasMore: false,
  };

  constructor(props) {
    super(props);

    const columns = React.Children
      .toArray(props.children)
      .filter(child => child.type === GridViewColumn || child.type === PermissionContent);

    this.state = {
      columns,
    };
  }

  handleMoveToNextOffset = () => {
    const { limit, offset } = this.props;

    this.props.onLoadMore({
      offset: offset + limit,
      limit,
    });
  };

  render() {
    const { columns } = this.state;
    const {
      keyName,
      rows,
      rowClassName,
      tableClassName,
      headerClassName,
      hasMore,
    } = this.props;

    const children = rows.map(data => (
      <GridViewRow
        key={data[keyName]}
        className={rowClassName}
        columns={columns}
        data={data}
      />
    ));

    return (
      <div className="table-responsive">
        <table className={classNames('table data-grid-layout', tableClassName)}>
          <thead className={headerClassName}>
            <tr>
              {columns.map((item, key) => (
                <GridViewHeader key={key} {...item} />
              ))}
            </tr>
          </thead>
          <Choose>
            <When condition={hasMore && rows.length === 0}>
              {children}
            </When>
            <Otherwise>
              <InfiniteScroll
                loadMore={this.handleMoveToNextOffset}
                element="tbody"
                hasMore={hasMore}
                loader={<GridViewLoader key="loader" className="infinite-preloader" colSpan={columns.length} />}
              >
                {children}
              </InfiniteScroll>
            </Otherwise>
          </Choose>
        </table>
      </div>
    );
  }
}

export default OffsetGridView;
