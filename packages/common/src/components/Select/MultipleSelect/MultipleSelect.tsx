import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { ShortLoader, CircleLoader, Input, Checkbox } from 'components';
import { useOutsideClick, useKeyDown } from '../../../hooks';
import './MultipleSelect.scss';

type Option<OptionValue> = {
  label: string,
  value: OptionValue,
  className?: string,
};

export type Props<OptionValue> = {
  label?: string,
  className?: string,
  placeholder?: string,
  options: Array<Option<OptionValue>>,
  value?: Array<OptionValue>,
  error?: React.ReactNode,
  onChange?: (value: Array<OptionValue>) => void,
  focused?: boolean,
  disabled?: boolean,
  loading?: boolean,
  searchable?: boolean,
  'data-testid'?: string,
};

const MultipleSelect = <OptionValue, >(props: Props<OptionValue>) => {
  const {
    label,
    className,
    placeholder,
    options,
    value,
    error,
    onChange = () => null,
    focused = false,
    disabled = false,
    loading = false,
    searchable = false,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Just options for render in "Selected options" block
  const [selectedOptions, setSelectedOptions] = useState<Array<Option<OptionValue>>>([]);

  // Real checked options to provide to onChange method
  const [checkedOptions, setCheckedOptions] = useState<Array<Option<OptionValue>>>([]);

  const idRef = useRef(`select-${v4()}`);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Transfer all checked options to selected options and clear search value when select is closed
    if (!isOpen) {
      setSelectedOptions(checkedOptions);
      setSearchValue('');
    }

    // If props.value is differ than checked options list -> fill out checked options list and selected options list
    if (Array.isArray(value) && !isEqual(checkedOptions.map(v => v.value), value)) {
      // Looking for checked options depends on provided value
      const _options = options.filter(option => !!value.find(val => isEqual(val, option.value)));

      setCheckedOptions(_options);
      setSelectedOptions(_options);
    }
  }, [value, options, isOpen]);

  // Handle outside click to close select
  useOutsideClick((e: MouseEvent) => {
    if (isOpen) {
      setIsOpen(false);

      // Fix if select opened inside modal to prevent event propagation for close modal if clicked on overlay
      const modalElement = [...document.querySelectorAll('[aria-modal=true]')].at(-1) as HTMLElement | undefined;
      const isOverlayClicked = (e.target as Element).className.includes('Modal__overlay');

      if (modalElement && isOverlayClicked) {
        e.stopPropagation();
        modalElement.focus();
      }
    }
  }, selectRef.current, [isOpen]);

  // Handle keydown event to check if Escape was pressed to close select
  useKeyDown((e: KeyboardEvent) => {
    if (isOpen && e.code === 'Escape') {
      setIsOpen(false);

      // Fix if select opened inside modal to prevent event propagation for close modal
      const modalElement = [...document.querySelectorAll('[aria-modal=true]')].at(-1) as HTMLElement | undefined;

      if (modalElement) {
        e.stopPropagation();
        modalElement.focus();
      }
    }
  }, [isOpen]);

  /**
   * Check is provided option exist in checked options list
   */
  const isExistInCheckedOptions = useCallback((option: Option<OptionValue>) => (
    checkedOptions.some(checkedOption => isEqual(checkedOption, option))
  ), [checkedOptions]);

  /**
   * Check is provided option exist in selected options list
   */
  const isExistInSelectedOptions = useCallback((option: Option<OptionValue>) => (
    selectedOptions.some(selectedOption => isEqual(selectedOption, option))
  ), [selectedOptions]);

  // Get filtered selected options depends on search input
  const filteredSelectedOptions = useMemo(() => selectedOptions.filter(
    option => option.label.toString().toLowerCase().includes(searchValue.toLowerCase()),
  ), [searchValue, selectedOptions]);

  // Get filtered available options depends on search input and except options that exists in selected options
  const filteredAvailableOptions = useMemo(() => options.filter(option => (
    !isExistInSelectedOptions(option) && option.label.toString().toLowerCase().includes(searchValue.toLowerCase())
  )), [searchValue, selectedOptions, options]);

  // Toggle select visibility only if select isn't disabled
  const toggleIsOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  /**
   * Notify parent about checked options
   *
   * @param _options
   */
  const notifyParent = (_options: Array<Option<OptionValue>>) => {
    onChange(_options.map(option => option.value));
  };

  // Handle option click to invoke onChange callback
  const handleOptionClick = (option: Option<OptionValue>) => {
    let newCheckedOptions: Array<Option<OptionValue>> = [];

    // Remove option from checked options when it already exists there
    if (isExistInCheckedOptions(option)) {
      newCheckedOptions = checkedOptions.filter(checkedOption => !isEqual(checkedOption, option));
      //  Add option to checked options if it absent there
    } else {
      newCheckedOptions = [...checkedOptions, option];
    }

    setCheckedOptions(newCheckedOptions);

    // If option exist in selected options - then remove this option from selected options list
    if (isExistInSelectedOptions(option)) {
      setSelectedOptions(selectedOptions.filter(selectedOption => !isEqual(selectedOption, option)));
    }

    notifyParent(newCheckedOptions);
  };

  // Clear all checked and selected options and clear search value
  const handleClickClearAll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setCheckedOptions([]);
    setSelectedOptions([]);
    setSearchValue('');

    notifyParent([]);
  };

  // Clear available checked options
  const handleClickClearAvailable = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Should be used all previous checked options except all filtered available options
    const newCheckedOptions = checkedOptions.filter(
      option => !filteredAvailableOptions.find(val => isEqual(val, option)),
    );

    setCheckedOptions(newCheckedOptions);

    notifyParent(newCheckedOptions);
  };

  // Select all options
  const handleClickAll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    // Should be used all previous checked options and new filtered available options that still unchecked
    const newCheckedOptions = [
      ...checkedOptions,
      ...filteredAvailableOptions.filter(option => !isExistInCheckedOptions(option)),
    ];

    setCheckedOptions(newCheckedOptions);

    notifyParent(newCheckedOptions);
  };

  return (
    <div ref={selectRef} className={classNames('MultipleSelect', className)}>
      <If condition={!!label}>
        <label className="MultipleSelect__label" htmlFor={idRef.current}>{label}</label>
      </If>

      {/* Render control element */}
      <div
        data-testid="multiple-select-control"
        tabIndex={disabled ? -1 : 0}
        onClick={toggleIsOpen}
        className={classNames('MultipleSelect__control', {
          'MultipleSelect__control--disabled': disabled,
          'MultipleSelect__control--focused': focused,
        })}
      >
        <div className="MultipleSelect__control-label">
          <Choose>
            {/* Render control label with "loading" state */}
            <When condition={loading}>
              <CircleLoader size={18} className="MultipleSelect__control-label-loader" />
              <div className="MultipleSelect__control-label-title">{I18n.t('COMMON.LOADING')}</div>
            </When>

            {/* Render control label with option.label if it was chosen */}
            <When condition={checkedOptions.length === 1}>
              <div className="MultipleSelect__control-label-title">{checkedOptions[0].label}</div>
            </When>

            <When condition={checkedOptions.length > 1}>
              <div className="MultipleSelect__control-label-title">
                <div className="MultipleSelect__control-label-title">
                  {I18n.t('COMMON.SELECT.N_OPTIONS_SELECTED', { count: checkedOptions.length })}
                </div>
              </div>
            </When>

            {/* Render control label with placeholder if it provided */}
            <When condition={placeholder !== undefined}>
              <div className="MultipleSelect__control-label-title">{placeholder}</div>
            </When>

            {/* In all other cases -> render Any */}
            <Otherwise>
              <div className="MultipleSelect__control-label-title">{I18n.t('COMMON.SELECT.ANY')}</div>
            </Otherwise>
          </Choose>
        </div>

        <i className={classNames('MultipleSelect__control-icon', 'icon icon-arrow-down', {
          'MultipleSelect__control-icon--opened': isOpen,
        })}
        />
      </div>

      {/* Render menu element if "isOpen" is equal true */}
      <If condition={isOpen}>
        <div className="MultipleSelect__menu" data-testid="multiple-select-menu">
          {/* Render "search" element */}
          <If condition={searchable}>
            <Input
              autoFocus
              name="searchValue"
              className="MultipleSelect__menu-search"
              addition={<i className="icon icon-search" />}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              placeholder={I18n.t('COMMON.SELECT.SEARCH_PLACEHOLDER')}
              data-testid="multiple-select-menu-search-input"
            />
          </If>

          {/* Render menu items */}
          <div className="MultipleSelect__menu-items">
            <Choose>
              <When condition={loading}>
                <ShortLoader />
              </When>

              {/* Render notification that options not found for provided search value */}
              <When
                condition={
                  searchValue !== ''
                  && !filteredSelectedOptions.length
                  && !filteredAvailableOptions.length
                }
              >
                <div className="MultipleSelect__menu-items-not-found">
                  {I18n.t('COMMON.SELECT.OPTIONS_NOT_FOUND', { search: searchValue })}
                </div>
              </When>

              {/* Render nothing found if options weren't provided */}
              <When condition={!filteredSelectedOptions.length && !filteredAvailableOptions.length}>
                <div className="SingleSelect__menu-nothing-found">
                  {I18n.t('COMMON.SELECT.NOTHING_FOUND')}
                </div>
              </When>

              <Otherwise>
                {/* Render selected options block only if options exists in filteredSelectedOptions array */}
                <If condition={filteredSelectedOptions.length > 0}>
                  <div data-testid="multiple-select-selected-options">
                    <div className="MultipleSelect__menu-items-header">
                      <div>{I18n.t('COMMON.SELECT.SELECTED_OPTIONS')}</div>
                      <div className="MultipleSelect__menu-items-clear" onClick={handleClickClearAll}>
                        <i className="icon icon-times" />{I18n.t('COMMON.SELECT.CLEAR')}
                      </div>
                    </div>
                    {filteredSelectedOptions.map((option, index) => (
                      <Checkbox
                        name=""
                        key={index}
                        className={classNames('MultipleSelect__menu-item', {
                          'MultipleSelect__menu-item--active': isExistInCheckedOptions(option),
                        }, option.className)}
                        label={option.label}
                        value={isExistInCheckedOptions(option)}
                        onChange={() => handleOptionClick(option)}
                      />
                    ))}
                  </div>
                </If>

                {/* Render available options block only if options exists in filteredAvailableOptions array */}
                <If condition={filteredAvailableOptions.length > 0}>
                  <div data-testid="multiple-select-available-options">
                    <div className="MultipleSelect__menu-items-header">
                      <div>{I18n.t('COMMON.SELECT.AVAILABLE_OPTIONS')}</div>
                      <Choose>
                        {/* Show "Clear" button if all options was checked */}
                        <When condition={filteredAvailableOptions.every(isExistInCheckedOptions)}>
                          <div className="MultipleSelect__menu-items-clear" onClick={handleClickClearAvailable}>
                            <i className="icon icon-times" />{I18n.t('COMMON.SELECT.CLEAR')}
                          </div>
                        </When>
                        {/* Show "Add" button in other cases */}
                        <Otherwise>
                          <div className="MultipleSelect__menu-items-all" onClick={handleClickAll}>
                            <i className="fa fa-check-square" />{I18n.t('COMMON.SELECT.ALL')}
                          </div>
                        </Otherwise>
                      </Choose>
                    </div>
                    {filteredAvailableOptions.map((option, index) => (
                      <Checkbox
                        name=""
                        key={index}
                        className={classNames('MultipleSelect__menu-item', {
                          'MultipleSelect__menu-item--active': isExistInCheckedOptions(option),
                        }, option.className)}
                        label={option.label}
                        value={isExistInCheckedOptions(option)}
                        onChange={() => handleOptionClick(option)}
                      />
                    ))}
                  </div>
                </If>
              </Otherwise>
            </Choose>
          </div>
        </div>
      </If>

      {/* Render error if it provided */}
      <If condition={!!error}>
        <div className="MultipleSelect__error">
          <i className="icon icon-alert" />
          {error}
        </div>
      </If>

      {/* Hidden input for tests */}
      <input
        id={idRef.current}
        type="text"
        disabled={disabled}
        onClick={toggleIsOpen}
        onChange={() => null}
        value={checkedOptions.map(checkedOption => checkedOption.value).join(', ')}
        style={{ display: 'none' }}
        data-testid={props['data-testid']}
      />
    </div>
  );
};

export default React.memo(MultipleSelect) as typeof MultipleSelect;
