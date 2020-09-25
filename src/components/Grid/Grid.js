import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NotFoundContent from 'components/NotFoundContent';
import GridColumn from './components/GridColumn';
import GridHeader from './components/GridHeader';
import GridBody from './components/GridBody';
import GridProvider from './components/GridProvider';
import './Grid.scss';

class Grid extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
    isLastPage: PropTypes.bool,
    className: PropTypes.string,
    rowsClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    sorts: PropTypes.object,
    handleSort: PropTypes.func,
    handleRowClick: PropTypes.func,
    handleSelectRow: PropTypes.func,
    handlePageChanged: PropTypes.func,
    handleAllRowsSelect: PropTypes.func,
    allRowsSelected: PropTypes.bool,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number),
    withLazyLoad: PropTypes.bool,
    withRowsHover: PropTypes.bool,
    withNoResults: PropTypes.any,
    withMultiSelect: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    rowsClassNames: '',
    allRowsSelected: false,
    touchedRowsIds: [],
    isLoading: false,
    isLastPage: true,
    withLazyLoad: true,
    withRowsHover: false,
    withNoResults: null,
    withMultiSelect: false,
    sorts: null,
    handleSort: () => {},
    handleRowClick: () => {},
    handleSelectRow: () => {},
    handlePageChanged: () => {},
    handleAllRowsSelect: () => {},
  };

  render() {
    const {
      data,
      children,
      className,
      isLoading,
      withNoResults,
      ...props
    } = this.props;

    if (withNoResults || (!isLoading && !data.length)) {
      return (
        <NotFoundContent />
      );
    }

    const gridColumns = React.Children
      .toArray(children)
      .filter(child => child.type === GridColumn && !child.props.isHidden);

    const providerProps = {
      ...props,
      gridData: data,
      gridColumns,
    };

    return (
      <GridProvider {...providerProps}>
        <table className={classNames('Grid', className)}>
          <GridHeader />
          <GridBody isLoading={isLoading} />
        </table>
      </GridProvider>
    );
  }
}

export default Grid;
