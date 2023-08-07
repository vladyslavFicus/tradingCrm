import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Input } from 'components';
import { Props } from '../types';
import useSelectTree from '../hooks/useSelectTree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import './SelectTree.scss';

const SelectTree = (props: Props) => {
  const {
    label,
    value = '',
    disabled,
    className,
    favorites = [],
    onChange = () => {},
    nodes,
  } = props;

  const {
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
  } = useSelectTree({ value, disabled, onChange, nodes });


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
          <When condition={!!search && !nodes.length}>
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
