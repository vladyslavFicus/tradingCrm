import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { actionTypes } from './attributes';
import './FilterSetButtons.scss';

class FilterSetButtons extends Component {
  static propTypes = {
    favourite: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleSelectFilterDropdownItem: PropTypes.func.isRequired,
    common: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleHistoryReplace: PropTypes.func.isRequired,
    filtersLoading: PropTypes.bool.isRequired,
    selectValue: PropTypes.string.isRequired,
    resetForm: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    errorLoading: PropTypes.bool,
    modals: PropTypes.shape({
      actionFilterModal: PropTypes.modalType,
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    filtersRefetch: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    filterSetType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    currentValues: null,
    errorLoading: false,
  };

  handleSaveNewFilter = () => {
    const {
      filterSetType,
      currentValues,
      modals: { actionFilterModal },
    } = this.props;

    actionFilterModal.show({
      filterSetType,
      fields: currentValues,
      action: actionTypes.CREATE,
      onSuccess: this.handleApplyNewFilter,
    });
  };

  handleApplyNewFilter = async (closeModal, { uuid }) => {
    const { filtersRefetch, handleSelectFilterDropdownItem } = this.props;

    await filtersRefetch();

    handleSelectFilterDropdownItem(uuid);
    closeModal();
  };

  handleUpdateExistFilter = () => {
    const {
      modals: { actionFilterModal },
      currentValues,
      selectValue,
      favourite,
      common,
    } = this.props;

    actionFilterModal.show({
      onSuccess: this.handleApplyFilterUpdate,
      action: actionTypes.UPDATE,
      fields: currentValues,
      filterId: selectValue,
      name: [...favourite, ...common].find(
        ({ uuid }) => uuid === selectValue,
      ).name,
    });
  };

  handleApplyFilterUpdate = async (closeModal) => {
    const { filtersRefetch } = this.props;

    await filtersRefetch();

    closeModal();
  };

  handleRemoveFilterClick = () => {
    const {
      modals: { confirmActionModal },
      selectValue,
      favourite,
      common,
    } = this.props;

    const selectedValueTitle = [...favourite, ...common].find(
      ({ uuid }) => uuid === selectValue,
    ).name;

    confirmActionModal.show({
      uuid: selectValue,
      onSubmit: this.handleRemoveFilter,
      modalTitle: I18n.t('FILTER_SET.REMOVE_MODAL.TITLE'),
      actionText: I18n.t('FILTER_SET.REMOVE_MODAL.TEXT'),
      fullName: selectedValueTitle,
      submitButtonLabel: I18n.t('FILTER_SET.REMOVE_MODAL.BUTTON_ACTION'),
    });
  }

  handleRemoveFilter = async () => {
    const {
      modals: { confirmActionModal },
      handleSelectFilterDropdownItem,
      handleHistoryReplace,
      filtersRefetch,
      deleteFilter,
      selectValue,
      resetForm,
      notify,
    } = this.props;

    const {
      data: {
        filterSet: {
          delete: { error },
        },
      },
    } = await deleteFilter({ variables: { uuid: selectValue } });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.REMOVE_FILTER.ERROR'),
        message:
          error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('FILTER_SET.REMOVE_FILTER.SUCCESS'),
    });

    confirmActionModal.hide();
    await filtersRefetch();

    handleSelectFilterDropdownItem('');
    resetForm();
    handleHistoryReplace();
  };

  render() {
    const { selectValue, currentValues, filtersLoading, errorLoading } = this.props;

    return (
      <If condition={currentValues}>
        <div
          className={
            classNames('filter__form-buttons-group', { 'is-disabled': filtersLoading || errorLoading })
          }
        >
          <button
            className="filter-button filter-button--blue"
            onClick={this.handleSaveNewFilter}
            type="button"
          >
            {
              selectValue
                ? I18n.t('FILTER_SET.BUTTONS.SAVE_AS')
                : I18n.t('FILTER_SET.BUTTONS.SAVE')
            }
          </button>

          <If condition={selectValue}>
            <button
              className="filter-button filter-button--blue"
              onClick={this.handleUpdateExistFilter}
              type="button"
            >
              {I18n.t('FILTER_SET.BUTTONS.SAVE')}
            </button>

            <button
              className="filter-button filter-button--red"
              onClick={this.handleRemoveFilterClick}
              type="button"
            >
              {I18n.t('FILTER_SET.BUTTONS.DELETE')}
            </button>
          </If>
        </div>
      </If>
    );
  }
}

export default FilterSetButtons;
