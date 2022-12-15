import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { v4 } from 'uuid';
import I18n from 'i18n-js';
import { cloneDeep } from 'lodash';
import classNames from 'classnames';
import Input from 'components/Input';
import {
  withFilter,
  getAllParentPaths,
  findNodeByValue,
} from './utils';
import './SelectTree.scss';

export type Node = {
  value: string,
  label: string,
  children?: Node[],
  showCheckbox?: boolean,
};

export type Props = {
  label?: string,
  value?: string,
  disabled?: boolean,
  className?: string,
  onChange?: (value: string | string[]) => void,
  nodes: Node[],
  favorites?: string[],
};

const SelectTree = (props: Props) => {
  const {
    label,
    value = '',
    disabled,
    className,
    favorites = [],
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
  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setExpanded([]);
      setSearch('');
    }
  };

  const handleClick = (node: any) => {
    // If node is leaf --> set as current value and close dropdown
    if (node.isLeaf) {
      setCurrentValue(node.value);
      onChange(node.value);

      handleToggleDropdown();
    }
  };

  // ===== Renderers ===== //;
  const renderInput = () => (
    <div className={className}>
      {/* Label for input */}
      <If condition={!!label}>
        <label
          role="none"
          htmlFor={idRef.current}
          className="SelectTree__label"
          onClick={handleToggleDropdown}
        >
          {label}
        </label>
      </If>

      {/* Input with selected value */}
      <div
        onClick={handleToggleDropdown}
        tabIndex={disabled ? -1 : 0}
        className={classNames('SelectTree__input', {
          'SelectTree__input--disabled': disabled,
        })}
      >
        <i className="SelectTree__icon icon icon-arrow-down" />
        {currentNode?.label || I18n.t('COMMON.SELECT_TREE.PLACEHOLDER')}
      </div>
      <div className="SelectTree__favorites">
        {favorites.map(item => (
          <div
            key={item}
            className={classNames('SelectTree__favorite-btn', {
              'SelectTree__favorite-btn--active': item === currentValue,
            })}
            onClick={() => onChange(item)}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Hidden input for tests */}
      <input
        id={idRef.current}
        type="text"
        disabled={disabled}
        onChange={() => {}}
        value={currentValue}
        style={{ display: 'none' }}
      />
    </div>
  );

  // Render dropdown
  const renderDropdown = () => (
    <If condition={isOpen}>
      <div className="SelectTree__dropdown">
        <Input
          autoFocus
          name="search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder={I18n.t('COMMON.SELECT_TREE.SEARCH_PLACEHOLDER')}
          className="SelectTree__search-input"
          addition={<i className="icon icon-search" />}
        />

        <Choose>
          {/* If search text exist and nothing found inside tree */}
          <When condition={!!search && nodes.length === 0}>
            <div className="SelectTree__not-found">
              {I18n.t('COMMON.SELECT_TREE.OPTIONS_NOT_FOUND', { search })}
            </div>
          </When>
          <Otherwise>
            <div className="SelectTree__dropdown-content">
              <CheckboxTree
                expandOnClick
                expanded={expanded}
                nodes={nodes}
                onExpand={setExpanded}
                onClick={handleClick}
                icons={{
                  leaf: <i className="fa fa-gg" />,
                  expandClose: <i className="fa fa-plus-square-o" />,
                  expandOpen: <i className="fa fa-minus-square-o" />,
                }}
              />
            </div>
          </Otherwise>
        </Choose>
      </div>
    </If>
  );

  return (
    <div className="SelectTree" ref={controlRef}>
      {renderInput()}
      {renderDropdown()}
    </div>
  );
};

export default React.memo(SelectTree);
