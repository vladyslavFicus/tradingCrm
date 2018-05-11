import React from 'react';
import PropTypes from 'prop-types';
import CmsGridViewRowColumn from './CmsGridViewRowColumn';

const CmsGridViewRow = (props) => {
  const {
    className,
    columns,
    data,
    onRowClick,
  } = props;

  let rowClassName = className;
  let handleRowClick = null;

  if (typeof className === 'function') {
    rowClassName = className(data);
  }

  if (onRowClick) {
    handleRowClick = () => {
      if (typeof onRowClick === 'function') {
        onRowClick(data);
      }
    };
  }

  return (
    <tr className={rowClassName} onClick={handleRowClick}>
      <For each="column" index="columnKey" of={columns}>
        <CmsGridViewRowColumn
          key={columnKey}
          column={column}
          data={data}
        />
      </For>
    </tr>
  );
};

CmsGridViewRow.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  columns: PropTypes.arrayOf(PropTypes.element).isRequired,
  data: PropTypes.object.isRequired,
  onRowClick: PropTypes.func,
};
CmsGridViewRow.defaultProps = {
  className: null,
  onRowClick: null,
};

export default CmsGridViewRow;
