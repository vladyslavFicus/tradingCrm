import React, { Component } from 'react';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { withModals } from 'hoc';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import PropTypes from 'constants/propTypes';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import { branchField, fieldNames } from './utils';

class AddBranchForm extends Component {
  static propTypes = {
    hideForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    addOperatorToBranch: PropTypes.func.isRequired,
    currentBranches: PropTypes.array.isRequired,
    subordinatesCount: PropTypes.number.isRequired,
    operatorFullName: PropTypes.string.isRequired,
    branchHierarchy: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      teams: PropTypes.array,
      desks: PropTypes.array,
      offices: PropTypes.array,
      brands: PropTypes.array,
      branchTypes: PropTypes.array,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    refetchUserBranchesTreeUp: PropTypes.func.isRequired,
  };

  state = {
    selectedBranchType: '',
    branches: null,
  };

  getHierarchyTreeSequence = (type, parentBranch, name, brandId) => {
    const { branchHierarchy } = this.props;
    const parentBranchUuid = parentBranch && parentBranch.uuid;

    switch (type) {
      case branchNames.TEAM: {
        const desk = branchHierarchy[branchNames.DESK].find(({ uuid }) => (uuid === parentBranchUuid));

        if (!desk) {
          return null;
        }

        const { name: deskName, parentBranch: { uuid: officeUuid } } = desk;

        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === officeUuid));

        if (!office) {
          return null;
        }

        return [brandId, office.name, deskName, name];
      }
      case branchNames.DESK: {
        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === parentBranchUuid));

        if (!office) {
          return null;
        }

        return [brandId, office.name, name];
      }
      case branchNames.OFFICE: {
        return [brandId, name];
      }
      default: {
        return [name];
      }
    }
  };

  handleSubmit = ({ [fieldNames.BRANCH]: branchId }) => {
    const {
      operatorFullName,
      subordinatesCount,
      modals: {
        confirmActionModal,
      },
    } = this.props;

    if (subordinatesCount >= 10000) {
      const { branchHierarchySequence } = this.state.branches.find(({ value }) => value === branchId);

      confirmActionModal.show({
        onSubmit: () => this.handleAddBranch(branchId),
        modalTitle: I18n.t('MODALS.ASSIGN_BRANCH.TITLE'),
        actionText: I18n.t('MODALS.ASSIGN_BRANCH.DESCRIPTION', {
          operator: operatorFullName,
          clients: subordinatesCount,
          branch: branchHierarchySequence.join(' → '),
        }),
        submitButtonLabel: I18n.t('ACTIONS_LABELS.IGNORE'),
      });

      return;
    }

    this.handleAddBranch(branchId);
  }

  handleAddBranch = async (branchId) => {
    const {
      notify,
      hideForm,
      addOperatorToBranch,
      match: { params: { id } },
      refetchUserBranchesTreeUp,
    } = this.props;

    try {
      await addOperatorToBranch({ variables: { branchId, operatorId: id } });

      const { branches } = this.state;
      const { search } = branches.find(({ value }) => value === branchId) || { label: '' };

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCH_ADDED', { name: search }),
      });

      hideForm();
      refetchUserBranchesTreeUp();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.FAILED.OPERATOR_ADDED'),
        message: error.message || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  handleSelectChange = async (selectedBranchType) => {
    const {
      currentBranches,
      branchHierarchy,
    } = this.props;

    let branches;

    branches = branchHierarchy[selectedBranchType].map((
      {
        uuid,
        name,
        brandId,
        parentBranch,
      },
    ) => {
      const branchHierarchySequence = this.getHierarchyTreeSequence(selectedBranchType, parentBranch, name, brandId);

      return ({
        value: uuid,
        label: this.renderBranchLabel(branchHierarchySequence),
        search: name,
        branchHierarchySequence,
      });
    });

    if (Array.isArray(currentBranches) && currentBranches.length) {
      branches = branches.filter(({ value }) => !currentBranches.includes(value));
    }

    this.setState({
      selectedBranchType,
      branches,
    });
  }

  renderBranchLabel = (branchTree) => {
    if (branchTree.length === 1) {
      return <div className="hierarchy__tree">{branchTree[0]}</div>;
    }

    // Building component like this -> "branchName → branchName → branchName → branchName"
    return (
      <div className="hierarchy__tree">
        {branchTree.slice(0, branchTree.length - 1).join(' → ')}
        &nbsp; →&nbsp;
        <span className="color-info">{branchTree[branchTree.length - 1]}</span>
      </div>
    );
  }

  render() {
    const {
      selectedBranchType,
      branches,
    } = this.state;

    const {
      submitting,
      pristine,
      hideForm,
      handleSubmit,
      branchHierarchy: {
        loading,
        branchTypes,
      },
    } = this.props;

    return (
      <form className="row" onSubmit={handleSubmit(this.handleSubmit)}>
        <Choose>
          <When condition={loading}>
            <div className="width-full">
              <ShortLoader />
            </div>
          </When>
          <Otherwise>
            <div className="form-group col-md-4">
              <label>{I18n.t('COMMON.BRANCH_TYPE')}</label>
              <Select
                value={selectedBranchType}
                placeholder={branchTypes.length === 0
                  ? I18n.t('COMMON.SELECT_OPTION.NO_ITEMS')
                  : I18n.t('COMMON.SELECT_OPTION.DEFAULT')
                }
                disabled={branchTypes.length === 0}
                onChange={this.handleSelectChange}
              >
                {branchTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Select>
            </div>
            {reduxFieldsConstructor([
              branchField(
                selectedBranchType,
                branches,
                true,
              )])}
            <div className="filter-row__button-block">
              <button
                disabled={submitting || pristine}
                className="btn btn-primary"
                type="submit"
              >
                {I18n.t('COMMON.SAVE')}
              </button>
              <button
                onClick={hideForm}
                className="btn btn-default"
                type="button"
              >
                {I18n.t('COMMON.CANCEL')}
              </button>
            </div>
          </Otherwise>
        </Choose>
      </form>
    );
  }
}

export default withModals({
  confirmActionModal: ConfirmActionModal,
})(AddBranchForm);
