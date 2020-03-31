import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GridCheckbox from '../GridCheckbox';
import { ReactComponent as SortingArrows } from './SortingArrows.svg';
import './GridHeaderCell.scss';

class GridHeaderCell extends PureComponent {
  static propTypes = {
    columnIndex: PropTypes.number.isRequired,
    header: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    withMultiSelect: PropTypes.bool.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    handleAllRowsSelect: PropTypes.func.isRequired,
    onHandleSort: PropTypes.func.isRequired,
    sortingName: PropTypes.string,
    sortingDirection: PropTypes.string,
  };

  static defaultProps = {
    sortingName: '',
    sortingDirection: '',
  };

  renderHeaderCellContent = () => {
    const {
      header,
      sortingName,
      sortingDirection,
      onHandleSort,
    } = this.props;

    const renderHeader = typeof header === 'function' ? header() : header;

    return (
      <div
        className={
          classNames(
            'GridHeaderCell__content',
            {
              'GridHeaderCell__content--with-sorting': sortingName,
              'GridHeaderCell__content--sorted-by-asc': sortingDirection === 'ASC',
              'GridHeaderCell__content--sorted-by-desc': sortingDirection === 'DESC',
            },
          )
        }
        onClick={onHandleSort}
      >
        <div className="GridHeaderCell__title">{renderHeader}</div>

        <If condition={sortingName}>
          <div className="GridHeaderCell__sort">
            <SortingArrows />
          </div>
        </If>
      </div>
    );
  }

  handleAllRowsSelect = () => {
    const { allRowsSelected, handleAllRowsSelect } = this.props;

    handleAllRowsSelect(!allRowsSelected);
  };

  render() {
    const {
      columnIndex,
      withMultiSelect,
      touchedRowsIds,
      allRowsSelected,
    } = this.props;

    return (
      <Choose>
        <When condition={withMultiSelect && columnIndex === 0}>
          <th className="GridHeaderCell GridHeaderCell--with-multiselect">
            <GridCheckbox
              isActive={allRowsSelected}
              withoutCheckIcon={allRowsSelected && touchedRowsIds.length > 0}
              onChange={this.handleAllRowsSelect}
            />
            {this.renderHeaderCellContent()}
          </th>
        </When>
        <Otherwise>
          <th className="GridHeaderCell">
            {this.renderHeaderCellContent()}
          </th>
        </Otherwise>
      </Choose>
    );
  }
}

export default GridHeaderCell;
