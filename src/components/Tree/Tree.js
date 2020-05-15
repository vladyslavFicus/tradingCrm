import React, { PureComponent } from 'react';
import SortableTree, { toggleExpandedForAll, changeNodeAtPath, defaultGetNodeKey } from 'react-sortable-tree';
import PropTypes from 'constants/propTypes';
import 'react-sortable-tree/style.css';
import NodeContentRenderer from './NodeContentRenderer';

/**
 * @see react-sortable-tree for documentation
 */
class Tree extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    generateNodeProps: PropTypes.func.isRequired,
    treeData: PropTypes.arrayOf(PropTypes.treeData).isRequired,
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

  expandAllNodes = (node, path) => (e) => {
    const [newNode] = toggleExpandedForAll({ treeData: [node], expanded: true });

    this.setState(({ treeData }) => ({
      treeData: changeNodeAtPath({ treeData, path, getNodeKey: defaultGetNodeKey, newNode }),
    }));

    if (e) {
      e.stopPropagation();
    }
  };

  render() {
    return (
      <SortableTree
        nodeContentRenderer={NodeContentRenderer}
        {...this.props}
        treeData={this.state.treeData}
        onChange={this.onChange}
        generateNodeProps={({ ...args }) => this.props.generateNodeProps({
          ...args,
          expandAllNodes: this.expandAllNodes(args.node, args.path),
        })}
      />
    );
  }
}

export default Tree;
