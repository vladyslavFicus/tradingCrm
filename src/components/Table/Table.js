import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import ShortPreloader from 'components/ShortLoader';
import Column from './Column';
import { ReactComponent as SortingArrows } from './img/SortingArrows.svg';
import './Table.scss';

class Table extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array.isRequired, // Array of table items
    totalCount: PropTypes.number, // Total count of items (used only to calculate selected items under the select.all)
    onMore: PropTypes.func, // Callback when table scrolled to load more position
    hasMore: PropTypes.bool, // Flag to detect if more data exists to execute onMore callback and render loader
    loading: PropTypes.bool, // Flag to render loader while data loading from server, etc...
    notFound: PropTypes.node, // Custom not found react element
    scrollableTarget: PropTypes.string, // Selector to right working infinite scroll inside custom div or modal
    customClassNameRow: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // Custom class for row in table body
    stickyFromTop: PropTypes.number, // Number of pixels from top to stick header
    onSort: PropTypes.func, // Callback when sorting changed inside table
    onSelect: PropTypes.func, // Callback when select rows changed inside table
    onSelectError: PropTypes.func, // Callback when select rows executed error when maximum selecting exceeded
    withMultiSelect: PropTypes.bool, // Flag to enable multi-select functionality
    maxSelectCount: PropTypes.number, // Maximum of selected rows
  };

  static defaultProps = {
    totalCount: Infinity,
    onMore: () => {},
    hasMore: false,
    loading: false,
    notFound: null,
    scrollableTarget: undefined,
    customClassNameRow: null,
    stickyFromTop: null,
    onSort: () => {},
    onSelect: () => {},
    onSelectError: () => {},
    withMultiSelect: false,
    maxSelectCount: Infinity,
  };

  static getDerivedStateFromProps(props, state) {
    // If sorts controlled from top level component --> use outside data if not --> use local state data
    const sorts = state.prevSorts !== props.sorts ? props.sorts : state.sorts;

    return {
      sorts: sorts || [],
      prevSorts: props.sorts,
    };
  }

  /**
   * Method provided to onSelect callback to reset selection in future
   */
  handleSelectReset = () => {
    this.setState(({ select }) => ({
      select: {
        ...select,
        all: false,
        touched: [],
        selected: 0,
      },
    }), () => this.props.onSelect(this.state.select));
  };

  state = {
    sorts: [],
    select: {
      all: false,
      touched: [],
      selected: 0,
      max: this.props.maxSelectCount,
      reset: this.handleSelectReset,
    },
  };

  /**
   * Handle click on head column who supports sorting
   *
   * @param sortBy
   *
   * @return {Promise<void>}
   */
  handleSortBy = async (sortBy) => {
    if (!sortBy) return;

    const { sorts: prevSorts } = this.state;

    // Create new array of sorts
    const sorts = [...prevSorts];

    // Find sort column if it was applied before
    const sortColumnIndex = prevSorts.findIndex(({ column }) => column === sortBy);

    // Sorting steps 'ASC' => 'DESC' => without sorting
    // where 'ASC' - sorting from A-Z
    // 'DESC' - sorting from Z-A
    switch (sorts[sortColumnIndex]?.direction) {
      case 'ASC': {
        // Changed column direction from ASC to DESC and same position
        sorts[sortColumnIndex] = { column: sortBy, direction: 'DESC' };
        break;
      }
      case 'DESC': {
        // Remove column from sorts if direction was DESC
        sorts.splice(sortColumnIndex, 1);
        break;
      }
      default: {
        // Add column to sorts if no sorting was applied before
        sorts.push({ column: sortBy, direction: 'ASC' });
        break;
      }
    }

    this.setState({ sorts }, () => this.props.onSort(sorts));
  };

  /**
   * Toggle select.all if select all checkbox clicked
   */
  handleSelectAll = () => {
    const {
      totalCount,
      maxSelectCount,
      onSelect,
      onSelectError,
    } = this.props;

    this.setState(({ select }) => ({
      select: {
        ...select,
        all: !select.all,
        touched: [],
        selected: !select.all ? Math.min(this.props.totalCount, this.props.maxSelectCount) : 0,
      },
    }), () => {
      const { select } = this.state;

      // Make an error when total count more than max select count
      if (select.all && totalCount > maxSelectCount) {
        onSelectError(select);
      }

      onSelect(select);
    });
  };

  /**
   * Mark individual row as touched or remove from select.touched list if it's already presented
   *
   * @param rowIndex
   */
  handleSelectSingle = (rowIndex) => {
    this.setState(({ select }) => {
      const isTouched = select.touched.includes(rowIndex);

      // If adding element to touched list and it's not a select.all unselecting
      if (!select.all && !isTouched && select.selected + 1 > select.max) {
        this.props.onSelectError(select);

        return {};
      }

      const touched = isTouched ? select.touched.filter(index => index !== rowIndex) : [...select.touched, rowIndex];

      // Make state calculation if select.all enabled
      if (select.all) {
        // Clear state below if all select.all items was unselected
        const isAllUnselected = !isTouched && select.selected === 1;

        return {
          select: {
            ...select,
            all: !isAllUnselected ? select.all : false,
            touched: !isAllUnselected ? touched : [],
            selected: !isAllUnselected ? select.selected + (isTouched ? 1 : -1) : 0,
          },
        };
      }

      return {
        select: {
          ...select,
          touched,
          selected: select.selected + (isTouched ? -1 : 1),
        },
      };
    }, () => this.props.onSelect(this.state.select));
  };

  /**
   * Check if row selected
   *
   * If select.all === true and row touched then row unselected
   * If select.all === false and row touched then row selected
   *
   * @param rowIndex
   *
   * @return {boolean}
   */
  isRowSelected = (rowIndex) => {
    const { select } = this.state;

    const isTouched = select.touched.includes(rowIndex);

    // If all rows selected and current row is touched -> then row is unselected
    if (select.all && isTouched) {
      return false;
    }

    // Check if all rows selected or current row is touched
    return (select.all && rowIndex < select.max) || isTouched;
  };

  /**
   * Render head of table (render headers)
   *
   * @param columns
   *
   * @return {*}
   */
  renderHead = (columns) => {
    const { stickyFromTop, withMultiSelect, items } = this.props;
    const { select } = this.state;

    return (
      <tr className="Table__head-row">
        {/* Adding multi select column if it's available */}
        <If condition={withMultiSelect && items.length}>
          <th
            className={classNames(
              'Table__cell',
              'Table__head-cell',
              {
                'Table__cell--multiselect': withMultiSelect,
                'Table__head-cell--sticky': stickyFromTop || stickyFromTop === 0,
              },
            )}
            style={{ top: `${stickyFromTop}px`, width: '46px' }}
          >
            <div
              className={
                classNames(
                  'Table__checkbox',
                  {
                    'Table__checkbox--is-active': select.all,
                    'Table__checkbox--is-disabled': !select.all,
                    'Table__checkbox--without-check': select.all && select.touched.length,
                  },
                )
              }
              onClick={this.handleSelectAll}
            />
          </th>
        </If>
        {columns.map(({ props }, index) => {
          const { width, sortBy, header } = props;

          const sortColumn = this.state.sorts.find(({ column }) => column === props.sortBy);

          return (
            <th
              key={`head-${index}`}
              className={classNames(
                'Table__cell',
                'Table__head-cell',
                {
                  'Table__head-cell--sticky': stickyFromTop || stickyFromTop === 0,
                  'Table__head-cell--with-sorting': sortBy,
                  'Table__head-cell--sorted-by-asc': sortColumn?.direction === 'ASC',
                  'Table__head-cell--sorted-by-desc': sortColumn?.direction === 'DESC',
                },
              )}
              style={{
                width: `${width}px`,
                top: `${stickyFromTop}px`,
              }}
              onClick={() => this.handleSortBy(sortBy)}
            >
              <div className="Table__head-cell-content">
                {header}

                <If condition={sortBy}>
                  <div className="Table__head-cell-sort">
                    <SortingArrows />
                  </div>
                </If>
              </div>
            </th>
          );
        })}
      </tr>
    );
  }

  /**
   * Render body of table (render rows and columns)
   *
   * @param columns
   *
   * @return {*}
   */
  renderBody = (columns) => {
    const {
      items,
      loading,
      notFound,
      withMultiSelect,
      customClassNameRow,
    } = this.props;

    if (loading) {
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

    return items.map((item, rowIndex) => {
      const isSelected = this.isRowSelected(rowIndex);

      const customClassName = typeof customClassNameRow === 'function' ? customClassNameRow(item) : customClassNameRow;

      return (
        <tr
          key={rowIndex}
          className={classNames('Table__body-row', customClassName, { 'Table__body-row--selected': isSelected })}
        >
          {/* Adding multi select column if it's available */}
          <If condition={withMultiSelect && items.length}>
            <td className={classNames(
              'Table__cell',
              'Table__body-cell',
              'Table__body-cell--checkbox',
              {
                'Table__cell--multiselect': withMultiSelect,
              },
            )}
            >
              <div
                className={
                  classNames(
                    'Table__checkbox',
                    {
                      'Table__checkbox--is-active': isSelected,
                      'Table__checkbox--is-disabled': !isSelected,
                    },
                  )
                }
                onClick={() => this.handleSelectSingle(rowIndex)}
              />
            </td>
          </If>
          {columns.map(({ props }, columnIndex) => (
            <td
              key={`column-${rowIndex}-${columnIndex}`}
              className={classNames(
                'Table__cell',
                'Table__body-cell',
              )}
              style={{ width: `${props.width}px` }}
            >
              {props.render(item)}
            </td>
          ))}
        </tr>
      );
    });
  };

  render() {
    const { loading, hasMore, onMore, items, scrollableTarget } = this.props;

    const columns = React.Children.toArray(this.props.children).filter(child => child.type === Column);

    return (
      <div className="Table">
        <InfiniteScroll
          dataLength={items.length}
          next={onMore}
          hasMore={!loading && hasMore}
          scrollableTarget={scrollableTarget}
          loader={<ShortPreloader className="Table--loader" />}
          style={{ overflow: 'unset' }}
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
