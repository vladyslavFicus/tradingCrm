import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import ShortPreloader from 'components/ShortLoader';
import Column from './Column';
import './Table.scss';

class Table extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array.isRequired,
    onMore: PropTypes.func,
    hasMore: PropTypes.bool,
    loading: PropTypes.bool,
    notFound: PropTypes.node,
    scrollableTarget: PropTypes.string,
    customClassNameRow: PropTypes.string,
    stickyFirstColumn: PropTypes.bool,
  };

  static defaultProps = {
    onMore: () => {},
    hasMore: false,
    loading: false,
    notFound: null,
    scrollableTarget: undefined,
    customClassNameRow: null,
    stickyFirstColumn: false,
  };

  /**
   * Render head of table (render headers)
   *
   * @param columns
   *
   * @return {*}
   */
  renderHead = columns => (
    <tr>
      {columns.map(({ props }, index) => (
        <th
          key={`head-${index}`}
          className={classNames(
            'Table__cell',
            'Table__head-cell',
            {
              'Table__cell--sticky': this.props.stickyFirstColumn && index === 0,
            },
          )}
        >
          {props.header}
        </th>
      ))}
    </tr>
  );

  /**
   * Render body of table (render rows and columns)
   *
   * @param columns
   *
   * @return {*}
   */
  renderBody = (columns) => {
    const { items, loading, notFound } = this.props;

    if (loading && !items.length) {
      return (
        <tr className="Table__body-row">
          <td colSpan={columns.length} className="Table__cell Table__body-cell">
            <ShortPreloader />
          </td>
        </tr>
      );
    }

    if (!items.length) {
      return (
        <tr className="Table__body-row">
          <td colSpan={columns.length} className="Table__cell Table__body-cell">
            {notFound || I18n.t('COMMON.NO_ITEMS')}
          </td>
        </tr>
      );
    }

    return items.map((item, rowIndex) => (
      <tr key={rowIndex} className={classNames('Table__body-row', this.props.customClassNameRow)}>
        {columns.map(({ props }, columnIndex) => (
          <td
            key={`column-${rowIndex}-${columnIndex}`}
            className={classNames(
              'Table__cell',
              'Table__body-cell',
              {
                'Table__cell--sticky': this.props.stickyFirstColumn && columnIndex === 0,
              },
            )}
          >
            {props.render(item)}
          </td>
        ))}
      </tr>
    ));
  };

  render() {
    const { hasMore, onMore, items, scrollableTarget } = this.props;

    const columns = React.Children.toArray(this.props.children).filter(child => child.type === Column);

    return (
      <div className="Table">
        <InfiniteScroll
          dataLength={items.length}
          next={onMore}
          hasMore={hasMore}
          scrollableTarget={scrollableTarget}
          loader={<ShortPreloader />}
        >
          <table className={classNames('Table__table', { 'Table--no-content': !items.length })}>
            <thead className="Table__head">{this.renderHead(columns)}</thead>
            <tbody className="Table__body">{this.renderBody(columns)}</tbody>
          </table>
        </InfiniteScroll>
      </div>
    );
  }
}

export default Table;
