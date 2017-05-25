import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GridColumn extends Component {
  render() {
    return (
      <td>
        {this.props.children}
      </td>
    );
  }
}

GridColumn.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string,
  headerClassName: PropTypes.string,
  headerStyle: PropTypes.object,
  filter: PropTypes.func,
  filterClassName: PropTypes.string,
  filterStyle: PropTypes.object,
  render: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
};

export default GridColumn;
