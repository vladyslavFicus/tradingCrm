import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import PropTypes from 'constants/propTypes';
import { branchTypes as branchNames } from 'constants/hierarchyTypes';
import { branchField, fieldNames } from './utils';

class AddBranchForm extends Component {
  static propTypes = {
    hideForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addOperatorToBranch: PropTypes.func.isRequired,
    currentBranches: PropTypes.array.isRequired,
    branchHierarchy: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      teams: PropTypes.array,
      desks: PropTypes.array,
      offices: PropTypes.array,
      brands: PropTypes.array,
      branchTypes: PropTypes.array,
    }).isRequired,
  };

  static contextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  state = {
    selectedBranchType: '',
    branches: null,
  };

  handleAddBranch = async ({ [fieldNames.BRANCH]: branchId }) => {
    const {
      notify,
      hideForm,
      addOperatorToBranch,
      match: { params: { id } },
    } = this.props;

    const {
      data: {
        hierarchy: {
          addOperatorToBranch: {
            error,
          },
        },
      },
    } = await addOperatorToBranch({ variables: { branchId, operatorId: id } });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.FAILED.OPERATOR_ADDED'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      const { branches } = this.state;
      const { refetchHierarchy } = this.context;
      const { label } = branches.find(({ value }) => value === branchId) || { label: '' };

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCH_ADDED', { name: label }),
      });
      hideForm();
      refetchHierarchy();
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
        parentBranch: { uuid: parentBranchUuid },
      }
    ) => (
      {
        value: uuid,
        label: this.hierarchyTree(selectedBranchType, parentBranchUuid, name, brandId),
      }
    ));

    if (Array.isArray(currentBranches) && currentBranches.length) {
      branches = branches.filter(({ value }) => !currentBranches.includes(value));
    }

    this.setState({
      selectedBranchType,
      branches,
    });
  }

  hierarchyTree = (type, parentBranchUuid, name, brandId) => {
    const { branchHierarchy } = this.props;
    const NOT_FOUND = 'Not Found';
    let hierarchyTree;

    switch (type) {
      case (branchNames.TEAM): {
        const desk = branchHierarchy[branchNames.DESK].find(({ uuid }) => (uuid === parentBranchUuid));
        const { name: deskName, parentBranch: { uuid: officeUuid } } = desk || {};

        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === officeUuid));
        const { name: officeName } = office || {};

        hierarchyTree = (
          <div>{brandId} &rarr; {officeName || NOT_FOUND} &rarr; {deskName || NOT_FOUND} &rarr;&nbsp;
            <span className="color-info">{name}</span>
          </div>
        );

        break;
      }
      case (branchNames.DESK): {
        const office = branchHierarchy[branchNames.OFFICE].find(({ uuid }) => (uuid === parentBranchUuid));
        const { name: officeName } = office || {};

        hierarchyTree = (
          <div>{brandId} &rarr; {officeName || NOT_FOUND} &rarr; <span className="color-info">{name}</span></div>
        );

        break;
      }
      case (branchNames.OFFICE): {
        hierarchyTree = <div>{brandId} &rarr; <span className="color-info">{name}</span></div>;

        break;
      }
      default: {
        hierarchyTree = <div>{name}</div>;
      }
    }

    return hierarchyTree;
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
      <form className="row" onSubmit={handleSubmit(this.handleAddBranch)}>
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
                type="reset"
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

export default AddBranchForm;
