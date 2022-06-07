import { Node } from './SelectTree';

/**
 * [MUTABLE]
 * Modify object to remove checkbox on each node
 *
 * @param nodes
 * @param search
 *
 * @return Array<Node>
 */
export const withFilter = (nodes: Node[], search: string): Node[] => nodes.filter((node) => {
  // If node is leaf -> match label by search value
  if (!node.children) {
    return node.label.toLowerCase().includes(search.toLowerCase());
  }

  //  Otherwise -> filter nodes inside children
  node.children = withFilter(node.children, search); // eslint-disable-line

  return !!node.children.length;
});

/**
 * Get all parent paths which has a children
 *
 * @param nodes
 *
 * @return Array<string>
 */
export const getAllParentPaths = (nodes: Node[]) => {
  const paths: string[] = [];

  const traverseTree = (_nodes: Node[]) => {
    _nodes.forEach((node) => {
      if (node.children && node.children.length) {
        paths.push(node.value);

        traverseTree(node.children);
      }
    });
  };

  traverseTree(nodes);

  return paths;
};

/**
 * Find node by provided value
 *
 * @param nodes
 * @param value
 *
 * @return Node|null
 */
export const findNodeByValue = (nodes: Node[], value: string): Node | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // If children exist -> find inside children
    if (node.children) {
      const _node = findNodeByValue(node.children, value);

      if (_node) {
        return _node;
      }
    }

    // Match node value with provided value
    if (node.value === value) {
      return node;
    }
  }

  return null;
};
