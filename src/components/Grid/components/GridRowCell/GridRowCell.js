import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import GridCheckbox from '../GridCheckbox';
import './GridRowCell.scss';

class GridRowCell extends PureComponent {
  static propTypes = {
    columnData: PropTypes.object,
    gridRowData: PropTypes.object,
    withCheckbox: PropTypes.bool.isRequired,
    isCheckboxActive: PropTypes.bool.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    columnData: {},
    gridRowData: {},
  };

  render() {
    const {
      columnData,
      gridRowData,
      withCheckbox,
      isCheckboxActive,
      handleCheckboxChange,
    } = this.props;

    const cellContentData = get(columnData, 'props.render');
    const renderCellContent = typeof cellContentData === 'function'
      ? cellContentData(gridRowData)
      : cellContentData;

    return (
      <Choose>
        <When condition={withCheckbox}>
          <td className="GridRowCell GridRowCell--with-checkbox">
            <GridCheckbox
              isActive={isCheckboxActive}
              onChange={handleCheckboxChange}
            />
            {renderCellContent}
          </td>
        </When>
        <Otherwise>
          <td className="GridRowCell">
            {renderCellContent}
          </td>
        </Otherwise>
      </Choose>
    );
  }
}

export default GridRowCell;
