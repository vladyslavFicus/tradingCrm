import React, { Component } from 'react';
import { getGridColumn } from './utils';

class GridViewHeader extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      tagProps: this.parseHeadProps(props),
    };
  }

  parseHeadProps = (props) => {
    const gridColumn = getGridColumn(props);

    const headProps = {
      children: typeof gridColumn.header === 'function'
        ? gridColumn.header()
        : gridColumn.header,
    };

    if (gridColumn.headerClassName) {
      headProps.className = gridColumn.headerClassName;
    }

    if (gridColumn.headerStyle) {
      headProps.style = gridColumn.headerStyle;
    }

    return headProps;
  };

  render() {
    return <th {...this.state.tagProps} />;
  }
}

export default GridViewHeader;
