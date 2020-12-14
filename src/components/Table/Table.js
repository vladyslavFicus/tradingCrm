/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
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
    stickyFromTop: PropTypes.number,
    stickyFirstColumn: PropTypes.bool,
  };

  static defaultProps = {
    onMore: () => {},
    hasMore: false,
    loading: false,
    notFound: null,
    scrollableTarget: undefined,
    customClassNameRow: null,
    stickyFromTop: null,
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
    <tr className="Table__head-row">
      {columns.map(({ props }, index) => (
        <th
          key={`head-${index}`}
          className={classNames(
            'Table__cell',
            'Table__head-cell',
            {
              'Table__cell--sticky': this.props.stickyFirstColumn && index === 0,
              'Table__cell--max-width': props.maxWidth,
            },
          )}
          style={{ maxWidth: `${props.maxWidth}px` }}
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
                'Table__cell--max-width': props.maxWidth,
              },
            )}
            style={{ maxWidth: `${props.maxWidth}px` }}
          >
            {props.render(item)}
          </td>
        ))}
      </tr>
    ));
  };

  render() {
    const { hasMore, onMore, items, scrollableTarget, stickyFromTop } = this.props;

    const columns = React.Children.toArray(this.props.children).filter(child => child.type === Column);

    return (
      <ScrollSync>
        <div className="Table">

          {/* Render table with hidden body to make header sticky and calculate right width of columns */}
          <ScrollSyncPane>
            <div className="Table__head--sticky" style={{ top: `${stickyFromTop}px` }}>
              <table className={classNames('Table__table', { 'Table--no-content': !items.length })}>
                <thead className="Table__head">{this.renderHead(columns)}</thead>
                <tbody className="Table__body Table__body--hidden">{this.renderBody(columns)}</tbody>
              </table>
            </div>
          </ScrollSyncPane>

          {/* Render table with hidden header to make body scrollable and calculate right width of columns */}
          <InfiniteScroll
            dataLength={items.length}
            next={onMore}
            hasMore={hasMore}
            scrollableTarget={scrollableTarget}
            loader={<ShortPreloader />}
          >
            <ScrollSyncPane>
              <div className="Table__body--scrollable">
                <table className={classNames('Table__table', { 'Table--no-content': !items.length })}>
                  <thead className="Table__head Table__head--hidden">{this.renderHead(columns)}</thead>
                  <tbody className="Table__body">{this.renderBody(columns)}</tbody>
                </table>
              </div>
            </ScrollSyncPane>
          </InfiniteScroll>
        </div>
      </ScrollSync>
    );
  }
}

export default Table;
