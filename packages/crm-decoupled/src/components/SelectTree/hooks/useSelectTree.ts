import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { Node } from '../types';
import { findNodeByValue, getAllParentPaths, withFilter } from '../utils';

type Props = {
  value?: string,
  disabled?: boolean,
  onChange?: (value: string | string[]) => void,
  nodes: Node[],
};

const useSelectTree = (props: Props) => {
  const {
    value = '',
    disabled,
    onChange = () => {},
  } = props;

  const idRef = useRef(v4());
  const controlRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value);
  const [search, setSearch] = useState<string>('');
  const [expanded, setExpanded] = useState<string[]>([]);

  // Get filtered and mutated nodes
  const nodes = useMemo(() => {
    // If search text provided -> filter tree
    if (search) {
      return withFilter(cloneDeep(props.nodes), search);
    }

    return props.nodes;
  }, [props.nodes, search]);

  // Get current node entity
  const currentNode = useMemo(() => findNodeByValue(props.nodes, currentValue), [props.nodes, currentValue]);

  // Handle outside click to close dropdown
  useEffect(() => {
    let isMounted = true;

    const handleOutsideClick = (e: MouseEvent) => {
      // Close dropdown only if component still mounted and it's open and clicked outside of entire content
      if (isMounted && isOpen && !controlRef.current?.contains(e.target as HTMLElement)) {
        setIsOpen(false);
        setExpanded([]);
        setSearch('');
      }
    };

    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      isMounted = false;

      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  // Set value each time when value changed from props
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Expand/collapse list when search text exist or cleared
  useEffect(() => {
    if (search) {
      setExpanded(getAllParentPaths(nodes));
    } else {
      setExpanded([]);
    }
  }, [search]);

  // ====== Handlers ====== //
  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(prevState => !prevState);
      setExpanded([]);
      setSearch('');
    }
  }, [disabled]);

  const handleClick = useCallback((node: any) => {
    // If node is leaf --> set as current value and close dropdown
    if (node.isLeaf) {
      setCurrentValue(node.value);
      onChange(node.value);

      handleToggleDropdown();
    }
  }, []);

  return {
    idRef,
    expanded,
    currentNode,
    currentValue,
    isOpen,
    search,
    setSearch,
    setExpanded,
    controlRef,
    handleToggleDropdown,
    handleClick,
  };
};

export default useSelectTree;
