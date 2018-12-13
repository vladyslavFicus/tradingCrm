import React, { PureComponent } from 'react';
import SortableTree from 'react-sortable-tree';
import PropTypes from 'prop-types';
import 'react-sortable-tree/style.css';
import NodeContentRenderer from './NodeContentRenderer';

/**
 * @see react-sortable-tree for documentation
 */
class Tree extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
  };

  state = {
    treeData: this.props.treeData,
  };

  onChange = (treeData) => {
    this.setState({ treeData });

    this.props.onChange(treeData);
  };

  render() {
    return (
      <SortableTree
        nodeContentRenderer={NodeContentRenderer}
        {...this.props}
        treeData={this.state.treeData}
        onChange={this.onChange}
      />
    );
  }
}

export default Tree;
