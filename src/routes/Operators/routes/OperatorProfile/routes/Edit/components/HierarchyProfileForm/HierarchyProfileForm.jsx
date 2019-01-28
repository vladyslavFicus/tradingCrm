import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Field } from 'redux-form';
import { omit } from 'lodash';
import PropTypes from 'constants/propTypes';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import ShortLoader from 'components/ShortLoader';
import { NasSelectField } from 'components/ReduxForm';
import AddBranchForm from './AddBranchForm';
import { attributeLabels, fieldNames } from './constants';

class HierarchyProfileForm extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    initialValues: {},
  }

  static contextTypes = {
    refetchHierarchy: PropTypes.func.isRequired,
  };

  state = {
    branchFormVisibility: false,
  };

  toggleBranchForm = () => {
    this.setState({
      branchFormVisibility: !this.state.branchFormVisibility,
    });
  }

  handleSubmitUserTypeChange = async ({ [fieldNames.USER_TYPE]: userType }) => {
    const {
      notify,
      updateOperatorHierarchy,
      match: { params: { id } },
    } = this.props;

    const { data: { hierarchy: { updateUser: { error } } } } = await updateOperatorHierarchy({
      variables: {
        operatorId: id,
        userType,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    } else {
      const { refetchHierarchy } = this.context;

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });
      refetchHierarchy();
    }
  };

  handleRemoveBranch = branchId => async () => {
    const {
      notify,
      updateOperatorHierarchy,
      initialValues: { parentBranches },
      match: { params: { id } },
    } = this.props;

    const { data: { hierarchy: { updateUser: { error } } } } = await updateOperatorHierarchy({
      variables: {
        operatorId: id,
        unassignFromBranch: branchId,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_REMOVE_BRANCH'),
      });
    } else {
      const { refetchHierarchy } = this.context;
      const { name } = parentBranches.find(({ uuid }) => uuid === branchId) || { name: '' };

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_REMOVE_BRANCH', { name }),
      });
      refetchHierarchy();
    }
  }

  render() {
    const {
      loading,
      handleSubmit,
      pristine,
      submitting,
      initialValues: {
        parentBranches,
      },
    } = this.props;

    const { branchFormVisibility } = this.state;

    return (
      <div className="card">
        <div className="card-body">
          <div className="personal-form-heading margin-bottom-20">
            {I18n.t('OPERATORS.PROFILE.HIERARCHY.LABEL')}
          </div>
          <Choose>
            <When condition={loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <form
                className="row align-items-center"
                onSubmit={handleSubmit(this.handleSubmitUserTypeChange)}
              >
                <Field
                  name={fieldNames.USER_TYPE}
                  label={I18n.t(attributeLabels.userType)}
                  component={NasSelectField}
                  className="col-4"
                >
                  {Object
                    .keys(omit(userTypes, [userTypes.CUSTOMER, userTypes.LEAD_CUSTOMER]))
                    .map(value => (
                      <option key={value} value={value}>
                        {I18n.t(userTypeLabels[value])}
                      </option>
                    ))
                  }
                </Field>
                <If condition={!pristine && !submitting}>
                  <div className="col-auto">
                    <button className="btn btn-sm btn-primary" type="submit">
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </button>
                  </div>
                </If>
              </form>
              <div className="personal-form-heading margin-bottom-10">
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCHES')}
              </div>
              <Choose>
                <When condition={Array.isArray(parentBranches) && parentBranches.length}>
                  {parentBranches.map(({ uuid, name, branchType }) => (
                    <div key={uuid} className="margin-bottom-10">
                      <strong>
                        {I18n.t(`COMMON.${branchType}`)}: {name}
                      </strong>
                      <strong className="margin-left-20">
                        <i
                          id={uuid}
                          onClick={this.handleRemoveBranch(uuid)}
                          className="fa fa-trash cursor-pointer color-danger"
                        />
                      </strong>
                    </div>
                  )) }
                </When>
                <Otherwise>
                  <div className="margin-bottom-10">
                    <strong>{I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}</strong>
                  </div>
                </Otherwise>
              </Choose>
              <button
                className="btn btn-sm margin-bottom-10"
                disabled={branchFormVisibility}
                onClick={this.toggleBranchForm}
              >
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
              </button>
              <If condition={branchFormVisibility}>
                <AddBranchForm
                  hideForm={this.toggleBranchForm}
                  currentBranches={
                    Array.isArray(parentBranches) ? parentBranches.map(({ uuid }) => uuid) : null
                  }
                />
              </If>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default HierarchyProfileForm;
