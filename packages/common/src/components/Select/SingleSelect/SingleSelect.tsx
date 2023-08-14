import React, { useState, useMemo, useRef, useEffect, RefObject } from 'react';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { isEqual } from 'lodash';
import classNames from 'classnames';
// import { TradingAccount } from '__generated__/types';
import { ShortLoader, CircleLoader, Input } from 'components';
import { useOutsideClick, useKeyDown } from '../../../hooks';
import './SingleSelect.scss';

type SingleOption = {
  onClick: () => void,
  account: any,
  forwardedRef: RefObject<HTMLDivElement>,
};

type WithGroup = {
  firstTitle?: string,
  secondTitle?: string,
};

type Option<OptionValue> = {
  label: string,
  value?: OptionValue,
  className?: string,
  disabled?: boolean,
  isFavourite?: boolean,
  'data-account'?: SingleOption,
};

export type Props<OptionValue> = {
  label?: string,
  className?: string,
  placeholder?: string,
  options: Array<Option<OptionValue>>,
  value: OptionValue,
  error?: React.ReactNode,
  onChange?: (value: OptionValue) => void,
  singleOptionComponent?: (singleOption: SingleOption) => React.ReactElement,
  focused?: boolean,
  disabled?: boolean,
  loading?: boolean,
  searchable?: boolean,
  isFavourite?: boolean,
  withAnyOption?: boolean,
  withGroup?: WithGroup,
  'data-testid'?: string,
};

const SingleSelect = <OptionValue, >(props: Props<OptionValue>) => {
  const {
    label,
    className,
    placeholder,
    options,
    value,
    error,
    onChange = () => null,
    singleOptionComponent = null,
    focused = false,
    disabled = false,
    loading = false,
    searchable = false,
    withAnyOption = false,
    withGroup,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Determine current selected option depends on provided value
  const [currentOption, setCurrentOption] = useState<Option<OptionValue> | undefined>(
    options?.find(option => isEqual(value, option.value)),
  );

  const idRef = useRef(`select-${v4()}`);
  const selectRef = useRef<HTMLDivElement>(null);
  const customOptionRef = useRef<HTMLDivElement>(null);

  // Set current option depends on props.value
  useEffect(() => {
    setCurrentOption(options.find(option => isEqual(value, option.value)));
  }, [value, options]);

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

  // Toggle select visibility only if select isn't disabled
  const toggleIsOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchValue('');
    }
  };

  // Handle option click to invoke onChange callback and toggle select
  const handleOptionClick = (option: Option<OptionValue>) => {
    if (!option.disabled) {
      setCurrentOption(option);

      onChange(option.value as OptionValue);

      toggleIsOpen();
    }
  };

  // Add "Any" option if props "withAnyOption" has been provided
  const _options = useMemo(() => [
    ...(withAnyOption
      ? [{ label: I18n.t('COMMON.SELECT.ANY'),
        value: undefined,
        className: '',
        isFavourite: undefined }] : []),
    ...options,
  ], [withAnyOption, options]);

  // Get filtered options depends on search input
  const filteredOptions = _options.filter(
    option => option.label.toString().toLowerCase().includes(searchValue.toLowerCase()),
  );

  const getFilterOptionsWithFavourite = (isFavouriteFilter = true) => _options.filter(option => (
    isFavouriteFilter ? !!option.isFavourite : !option.isFavourite
  ));

  const renderOptions = (listOptions: Array<Option<OptionValue>>) => (
    listOptions?.map((option: Option<OptionValue>, index: number) => (
      <div
        key={index}
        tabIndex={0}
        role="button"
        className={classNames('SingleSelect__menu-item', {
          'SingleSelect__menu-item--active': isEqual(currentOption, option),
          'SingleSelect__menu-item--disabled': option.disabled,
        }, option.className)}
        onClick={() => handleOptionClick(option as Option<OptionValue>)}
      >
        {option.label}
      </div>
    ))
  );

  const renderCustomOptions = () => {
    const renderedOptions = _options.map((option) => {
      const accountOption = {
        account: option['data-account'],
        onClick: () => handleOptionClick(option as Option<OptionValue>),
        forwardedRef: customOptionRef,
      };

      return (
        singleOptionComponent ? singleOptionComponent(accountOption as SingleOption) : null);
    });

    return renderedOptions;
  };

  return (
    <div
      ref={selectRef}
      className={classNames('SingleSelect', className)}
    >
      <If condition={!!label}>
        <label className="SingleSelect__label" htmlFor={idRef.current}>{label}</label>
      </If>

      {/* Render control element */}
      <div
        tabIndex={disabled ? -1 : 0}
        onClick={toggleIsOpen}
        className={classNames('SingleSelect__control', {
          'SingleSelect__control--disabled': disabled,
          'SingleSelect__control--focused': focused,
        })}
      >
        <div className="SingleSelect__control-label">
          <Choose>
            {/* Render control label with "loading" state */}
            <When condition={loading}>
              <CircleLoader size={18} className="SingleSelect__control-label-loader" />
              <div className="SingleSelect__control-label-title">{I18n.t('COMMON.SELECT_OPTION.LOADING')}</div>
            </When>

            {/* Render control label with option.label if it was chosen */}
            <When condition={currentOption?.label !== undefined}>
              <div className="SingleSelect__control-label-title">{currentOption?.label}</div>
            </When>

            {/* Render control label with placeholder if it provided */}
            <When condition={placeholder !== undefined}>
              <div className="SingleSelect__control-label-title">{placeholder}</div>
            </When>

            {/* In all other cases -> render Any */}
            <Otherwise>
              <div className="SingleSelect__control-label-title">{I18n.t('COMMON.SELECT.ANY')}</div>
            </Otherwise>
          </Choose>
        </div>

        <i className={classNames('SingleSelect__control-icon', 'icon icon-arrow-down', {
          'SingleSelect__control-icon--opened': isOpen,
        })}
        />
      </div>

      {/* Render menu element if "isOpen" is equal true */}
      <If condition={isOpen}>
        <div className="SingleSelect__menu" data-testid="single-select-menu">
          {/* Render "search" element */}
          <If condition={searchable}>
            <Input
              autoFocus
              name="searchValue"
              className="SingleSelect__menu-search"
              addition={<i className="icon icon-search" />}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              placeholder={I18n.t('COMMON.SELECT.SEARCH_PLACEHOLDER')}
              data-testid="single-select-menu-search-input"
            />
          </If>

          {/* Render menu items */}
          <div className="SingleSelect__menu-items">
            <Choose>
              <When condition={loading}>
                <ShortLoader />
              </When>

              {/* Render notification that options not found for provided search value */}
              <When condition={searchValue !== '' && !filteredOptions.length}>
                <div className="SingleSelect__menu-items-not-found">
                  {I18n.t('COMMON.SELECT.OPTIONS_NOT_FOUND', { search: searchValue })}
                </div>
              </When>

              {/* Render nothing found if options weren't provided */}
              <When condition={!filteredOptions.length}>
                <div className="SingleSelect__menu-nothing-found">
                  {I18n.t('COMMON.SELECT.NOTHING_FOUND')}
                </div>
              </When>

              <Otherwise>
                <Choose>
                  <When condition={!withGroup && !!singleOptionComponent}>
                    {renderCustomOptions()}
                  </When>

                  <When condition={!withGroup}>
                    {renderOptions(filteredOptions)}
                  </When>

                  <Otherwise>
                    <p className="SingleSelect__menu-items__title">{I18n.t(withGroup?.firstTitle as string)}</p>
                    {renderOptions(getFilterOptionsWithFavourite(true))}

                    <hr className="SingleSelect__menu__hr" />

                    <p className="SingleSelect__menu-items__title">{I18n.t(withGroup?.secondTitle as string)}</p>
                    {renderOptions(getFilterOptionsWithFavourite(false))}
                  </Otherwise>
                </Choose>
              </Otherwise>
            </Choose>
          </div>
        </div>
      </If>

      {/* Render error if it provided */}
      <If condition={!!error}>
        <div className="SingleSelect__error">
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
        value={currentOption?.value !== undefined ? String(currentOption?.value) : ''}
        style={{ display: 'none' }}
        data-testid={props['data-testid']}
      />
    </div>
  );
};

export default React.memo(SingleSelect) as typeof SingleSelect;
