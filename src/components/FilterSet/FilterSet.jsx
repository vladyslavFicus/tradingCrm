import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'constants/propTypes';
import { I18n } from 'react-redux-i18n';
import { Dropdown, DropdownToggle, DropdownMenu, Tooltip } from 'reactstrap';
import classNames from 'classnames';
import history from 'router/history';
import { filterSetByIdQuery } from 'graphql/queries/filterSet';
import { filterActionOptions, divider, actionTypes } from './attributes';
import FilterSelectOption from './FilterSelectOption';
import './FilterSet.scss';

class FilterSet extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      actionFilterModal: PropTypes.modalType,
    }).isRequired,
    currentFormValues: PropTypes.object,
    errorLoading: PropTypes.object,
    toggleVisibility: PropTypes.func.isRequired,
    filtersLoading: PropTypes.bool.isRequired,
    favourite: PropTypes.arrayOf(PropTypes.object).isRequired,
    common: PropTypes.arrayOf(PropTypes.object).isRequired,
    filtersRefetch: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    resetFilterSet: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitFilters: PropTypes.func.isRequired,
    apolloRequestInProgress: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentFormValues: null,
    errorLoading: null,
  };

  state = {
    filterSetLoading: false,
    filtersVisible: true,
    selectValue: '',
    searchInputValue: '',
    tooltipOpen: {},
  };

  componentDidMount() {
    this.props.resetFilterSet(this.handleResetFilter);
  }

  handleResetFilter = () => this.setState({ selectValue: '' });

  handleHistoryReplace = (filterSetValues) => {
    let { location: { query } } = history;

    if (!filterSetValues) {
      query = null;
    }

    return history.replace({
      // Prevent location query from override if exist
      query,
      filterSetValues,
    });
  }

  handleSaveNewFilter = () => {
    const {
      modals: { actionFilterModal },
      currentFormValues,
    } = this.props;

    this.setState({
      dropdownOpen: false,
    });

    actionFilterModal.show({
      action: actionTypes.CREATE,
      fields: currentFormValues,
      onSuccess: this.handleApplyNewFilter,
    });
  };

  handleApplyNewFilter = async (closeModal, { uuid }) => {
    const { filtersRefetch } = this.props;

    await filtersRefetch();

    this.setState({
      selectValue: uuid,
    }, () => closeModal());
  }

  handleSetFilterValues = async (uuid) => {
    const { client, notify, submitFilters } = this.props;

    this.setState({
      filterSetLoading: true,
      dropdownOpen: false,
    });

    const { data: { filterSet: { data, error } } } = await client.query({
      query: filterSetByIdQuery,
      variables: { uuid },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });

      return;
    }

    // INFO: setting filter set history data
    this.handleHistoryReplace(data);
    // Submit query
    submitFilters(data);

    this.setState({
      filterSetLoading: false,
      selectValue: uuid,
    });
  }

  handleUpdateExistFilter = () => {
    const {
      modals: { actionFilterModal },
      currentFormValues,
      favourite,
      common,
    } = this.props;

    const { selectValue } = this.state;

    this.setState({
      dropdownOpen: false,
    });

    actionFilterModal.show({
      fields: currentFormValues,
      onSuccess: this.handleApplyFilterUpdate,
      filterId: selectValue,
      initialValues: { name: [...favourite, ...common].find(({ uuid }) => uuid === selectValue).name },
      action: actionTypes.UPDATE,
    });
  }

  handleApplyFilterUpdate = async (closeModal) => {
    const { filtersRefetch } = this.props;

    await filtersRefetch();

    closeModal();
  }

  handleUpdateFavourite = async (uuid, newValue) => {
    const { updateFavourite, notify, filtersRefetch } = this.props;

    this.setState({
      filterSetLoading: true,
    });

    const { data: { filterSet: { updateFavourite: { error } } } } = await updateFavourite({
      variables: {
        uuid,
        favourite: newValue,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    await filtersRefetch();

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
    });

    this.setState({
      filterSetLoading: false,
    });
  };

  handleRemoveFilter = async () => {
    const { deleteFilter, notify, filtersRefetch, resetForm } = this.props;
    const { selectValue } = this.state;

    this.setState({
      filterSetLoading: true,
      dropdownOpen: false,
    });

    const { data: { filterSet: { delete: { error } } } } = await deleteFilter({
      variables: { uuid: selectValue },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.REMOVE_FILTER.ERROR'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
    });

    await filtersRefetch();

    this.setState({
      selectValue: '',
      filterSetLoading: false,
    }, () => {
      resetForm();
      this.handleHistoryReplace(null);
    });
  }

  handleSelectChange = selectValue => this.setState({ selectValue });

  handleToggleTooltip = (e) => {
    const { tooltipOpen } = this.state;
    const copyObj = { ...tooltipOpen };
    const { target: { id: targetId, parentNode: { id: parentId } } } = e;
    const id = (targetId || parentId).replace('favourite-', '');

    if (copyObj[id]) {
      delete copyObj[id];
    } else {
      copyObj[id] = id;
    }

    this.setState({ tooltipOpen: copyObj });
  }

  handleToggleFiltersVisibility = () => (
    this.setState(({ filtersVisible }) => ({
      filtersVisible: !filtersVisible,
    }), () => this.props.toggleVisibility())
  )

  handleResetFormAndFilters = (e) => {
    e.stopPropagation();

    this.setState({
      selectValue: '',
    }, () => {
      this.props.resetForm();
      this.handleHistoryReplace(null);
    });
  };

  handleToggleDropdown = () => {
    this.setState(({ dropdownOpen }) => ({
      dropdownOpen: !dropdownOpen,
    }));
  }

  handleSearchFilters = (e) => {
    const { value } = e.target;

    this.setState({
      searchInputValue: value,
    });
  }

  render() {
    const {
      errorLoading,
      filtersLoading,
      currentFormValues,
      favourite,
      common,
      apolloRequestInProgress,
    } = this.props;

    const {
      dropdownOpen,
      filterSetLoading,
      selectValue,
      filtersVisible,
      searchInputValue,
    } = this.state;

    const isFilterLength = !!(favourite.length || common.length);

    const disabled = filtersLoading || errorLoading || filterSetLoading || (!isFilterLength && !currentFormValues);

    const dropdownOptions = searchInputValue
      ? [...favourite, ...common].filter(({ name }) => name.includes(searchInputValue))
      : [
        ...favourite,
        ...(favourite.length && common.length ? [divider()] : []),
        ...common,
        ...filterActionOptions(
          currentFormValues,
          selectValue,
          this.handleSaveNewFilter,
          this.handleUpdateExistFilter,
          this.handleRemoveFilter,
        ),
      ];

    const activeFilter = [...favourite, ...common].find(({ uuid }) => uuid === selectValue);
    const activeFilterName = activeFilter ? activeFilter.name : '';

    return (
      <div className="filter-set-row row">
        <div
          className={classNames(
            'col-8',
            'favourite-wrapper',
            { disabled: disabled || apolloRequestInProgress },
          )}
        >
          {favourite.map(({ uuid, name }) => (
            <Fragment key={uuid}>
              <div
                id={`favourite-${uuid}`}
                className={classNames(
                  'favourite-item',
                  { active: selectValue === uuid },
                )}
                onClick={() => this.handleSetFilterValues(uuid)}
              >
                <span className="favoutire-item__text">{name}</span>
              </div>
              <Tooltip
                placement="top"
                target={`favourite-${uuid}`}
                isOpen={!!this.state.tooltipOpen[uuid]}
                delay={{ show: 500, hide: 250 }}
                toggle={this.handleToggleTooltip}
              >
                {name}
              </Tooltip>
            </Fragment>
          ))}
        </div>
        <div className="col-4 dropdown-wrapper">
          <Dropdown
            className={classNames('favourite-dropdown', { disabled: disabled || apolloRequestInProgress })}
            isOpen={dropdownOpen}
            toggle={this.handleToggleDropdown}
          >
            <DropdownToggle disabled={disabled || apolloRequestInProgress} tag="div">
              <Choose>
                <When condition={selectValue}>
                  <div className="selected-item-wrapper">
                    <div className="value">
                      {activeFilterName}
                    </div>
                    <div className="close-cross" onClick={this.handleResetFormAndFilters} />
                  </div>
                </When>
                <Otherwise>
                  <div className="dropdown-placeholder" />
                </Otherwise>
              </Choose>
            </DropdownToggle>
            <DropdownMenu right>
              <div className="select-search-box">
                <i className="icon icon-search select-search-box__icon-left" />
                <input
                  type="text"
                  className="form-control"
                  placeholder={I18n.t('common.select.default_placeholder')}
                  onChange={this.handleSearchFilters}
                  value={searchInputValue}
                  disabled={disabled || apolloRequestInProgress}
                />
                <If condition={searchInputValue}>
                  <i
                    className="icon icon-times select-search-box__icon-right"
                    onClick={() => this.handleSearchFilters({ target: { value: '' } })}
                  />
                </If>
              </div>
              <Choose>
                <When condition={dropdownOptions.length}>
                  {dropdownOptions
                    .filter(item => item)
                    .map(filter => (
                      <FilterSelectOption
                        key={filter.uuid}
                        onClick={this.handleSetFilterValues}
                        onUpdateFavourite={this.handleUpdateFavourite}
                        filter={filter}
                        activeId={selectValue}
                      />
                    ))
                  }
                </When>
                <Otherwise>
                  <div className="text-muted">
                    {I18n.t('common.select.options_not_found', { query: searchInputValue })}
                  </div>
                </Otherwise>
              </Choose>
            </DropdownMenu>
          </Dropdown>
          <div
            className={classNames(
              'filter-switcher',
              { minimize: filtersVisible },
            )}
            onClick={this.handleToggleFiltersVisibility}
          />
        </div>
      </div>
    );
  }
}

export default FilterSet;
