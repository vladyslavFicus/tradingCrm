import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import Select from 'components/Select';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import { getBranchHierarchy } from 'graphql/queries/hierarchy';
import PropTypes from 'constants/propTypes';
import { branchTypes, branchField, fieldNames } from './constants';

class AddBranchForm extends Component {
  static propTypes = {
    hideForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    operatorId: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    addOperatorToBranch: PropTypes.func.isRequired,
    currentBranches: PropTypes.array.isRequired,
  };

  static contextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  state = {
    selectedBranchType: '',
    branchesLoading: false,
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
    this.setState({ branchesLoading: true });
    const {
      client,
      notify,
      operatorId,
      currentBranches,
    } = this.props;

    const branchType = selectedBranchType.toLowerCase();
    const { data: { hierarchy: { branchHierarchy: { data, error } } } } = await client.query({
      query: getBranchHierarchy,
      variables: {
        operatorId,
        branchType,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.ERROR_LOADING_BRANCHES'),
      });
    } else {
      let branches = data;

      if (Array.isArray(currentBranches) && currentBranches.length) {
        branches = data.filter(({ [branchType]: { uuid } }) => !currentBranches.includes(uuid));
      }

      branches = branches.map(({ [branchType]: { uuid, name } }) => ({ value: uuid, label: name }));

      this.setState({
        selectedBranchType,
        branches,
        branchesLoading: false,
      });
    }
  }

  render() {
    const {
      selectedBranchType,
      branchesLoading,
      branches,
    } = this.state;

    const {
      submitting,
      pristine,
      hideForm,
      handleSubmit,
    } = this.props;

    return (
      <form className="row" onSubmit={handleSubmit(this.handleAddBranch)}>
        <div className="form-group col-md-4">
          <label>{I18n.t('COMMON.BRANCH_TYPE')}</label>
          <Select
            value={selectedBranchType}
            placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
            branchesLoading,
            branches,
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
      </form>
    );
  }
}

export default AddBranchForm;
