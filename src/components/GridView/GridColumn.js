import React, { Component, PropTypes } from 'react';

class GridColumn extends Component {
  render() {
    const { name, header, headerClassName, filter, fil, render } = this.props;

    return (
      <td>
        { this.props.children }
      </td>
    );
  }
}

GridColumn.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string,
  headerClassName: PropTypes.string,
  filter: PropTypes.func,
  filterClassName: PropTypes.string,
  render: PropTypes.func,
};

export default GridColumn;
