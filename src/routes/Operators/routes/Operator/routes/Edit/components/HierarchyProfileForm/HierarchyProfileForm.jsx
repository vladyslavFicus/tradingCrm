import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Field } from 'redux-form';
import { omit } from 'lodash';
import classNames from 'classnames';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { userTypes, userTypeLabels } from 'constants/hierarchyTypes';
import permissions from 'config/permissions';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import ShortLoader from 'components/ShortLoader';
import { NasSelectField } from 'components/ReduxForm';
import PermissionContent from 'components/PermissionContent';
import AddBranchForm from './AddBranchForm';
import { attributeLabels, fieldNames } from './constants';
import './HierarchyProfileForm.scss';

class HierarchyProfileForm extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    updateOperatorHierarchy: PropTypes.func.isRequired,
    removeOperatorFromBranch: PropTypes.func.isRequired,
    refetchUserHierarchy: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    operatorFullName: PropTypes.string.isRequired,
    allowUpdateHierarchy: PropTypes.bool.isRequired,
    userBranchesTreeUp: PropTypes.shape({
      refetch: PropTypes.func,
      loading: PropTypes.bool,
      error: PropTypes.string,
      userBranchesTreeUp: PropTypes.arrayOf({
        data: PropTypes.arrayOf(PropTypes.shape({
          uuid: PropTypes.string,
          name: PropTypes.string,
          branchType: PropTypes.string,
          parentBranch: PropTypes.object,
        })),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    initialValues: {},
  };

  state = {
    branchFormVisibility: false,
  };

  toggleBranchForm = () => {
    this.setState(({ branchFormVisibility }) => ({
      branchFormVisibility: !branchFormVisibility,
    }));
  };

  handleSubmitUserTypeChange = async ({ [fieldNames.USER_TYPE]: userType }) => {
    const {
      notify,
      updateOperatorHierarchy,
      match: { params: { id } },
      userBranchesTreeUp,
      refetchUserHierarchy,
    } = this.props;

    try {
      await updateOperatorHierarchy({
        variables: {
          operatorId: id,
          userType,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_UPDATE_TYPE'),
      });
      userBranchesTreeUp.refetch();
      refetchUserHierarchy();
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_UPDATE_TYPE'),
      });
    }
  };

  handleRemoveBranch = (branchId, name) => () => {
    const {
      notify,
      removeOperatorFromBranch,
      userBranchesTreeUp,
      match: { params: { id } },
      reset,
      initialValues: { subordinatesCount },
      operatorFullName,
      modals: {
        confirmActionModal,
      },
    } = this.props;

    const removeBranch = async () => {
      try {
        await removeOperatorFromBranch({
          variables: {
            operatorId: id,
            branchId,
          },
        });

        notify({
          level: 'success',
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_REMOVE_BRANCH', { name }),
        });

        await userBranchesTreeUp.refetch();
        reset();
      } catch {
        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_REMOVE_BRANCH'),
        });
      }

      confirmActionModal.hide();
    };

    if (subordinatesCount >= 10000) {
      confirmActionModal.show({
        onSubmit: removeBranch,
        modalTitle: I18n.t('MODALS.UNASSIGN_BRANCH.TITLE'),
        actionText: I18n.t('MODALS.UNASSIGN_BRANCH.DESCRIPTION', {
          operator: operatorFullName,
          clients: subordinatesCount,
          branch: name,
        }),
        submitButtonLabel: I18n.t('ACTIONS_LABELS.IGNORE'),
      });

      return;
    }

    removeBranch();
  };

  buildUserBranchChain = ({ name, parentBranch }, branchChain) => {
    const _branchChain = `${name} → ${branchChain}`;

    if (parentBranch.branchType !== 'COMPANY') {
      return this.buildUserBranchChain(parentBranch, _branchChain);
    }

    return _branchChain;
  };

  renderHierarchyTree = () => {
    const {
      allowUpdateHierarchy,
      userBranchesTreeUp: {
        userBranchesTreeUp,
        loading,
        error,
      },
    } = this.props;

    if (loading || error) {
      return null;
    }

    if (userBranchesTreeUp.length) {
      return userBranchesTreeUp.map(({ uuid, parentBranch, branchType, name }) => {
        // There is no need to view the Company of operator
        if (!parentBranch) {
          return null;
        }
        const isParentBranchTypeCompany = parentBranch.branchType === 'COMPANY';

        const branchChain = !isParentBranchTypeCompany ? this.buildUserBranchChain(parentBranch, '') : '';

        return (
          <div className="margin-bottom-10" key={uuid}>
            <div className="hierarchy__tree font-weight-bold">
              {`${I18n.t(`COMMON.${branchType}`)}: ${branchChain}`}
              <span className={classNames({
                'color-info': !isParentBranchTypeCompany,
              })}
              >
                {name}
              </span>
              <If condition={userBranchesTreeUp.length > 1 && allowUpdateHierarchy}>
                <i
                  onClick={this.handleRemoveBranch(uuid, name)}
                  className="fa fa-trash cursor-pointer color-danger margin-20"
                />
              </If>
            </div>
          </div>
        );
      });
    }

    return (
      <div className="margin-bottom-10 font-weight-bold">
        {I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}
      </div>
    );
  };

  render() {
    const {
      loading,
      handleSubmit,
      pristine,
      submitting,
      allowUpdateHierarchy,
      initialValues: {
        parentBranches,
        subordinatesCount,
      },
      userBranchesTreeUp: {
        refetch,
      },
      operatorFullName,
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
                  disabled={!allowUpdateHierarchy}
                >
                  {Object
                    .keys(omit(userTypes, [
                      userTypes.CUSTOMER,
                      userTypes.LEAD_CUSTOMER,
                      userTypes.AFFILIATE_PARTNER,
                    ]))
                    .map(value => (
                      <option key={value} value={value}>
                        {I18n.t(userTypeLabels[value])}
                      </option>
                    ))
                  }
                </Field>
                <If condition={!pristine && !submitting && allowUpdateHierarchy}>
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

              {this.renderHierarchyTree()}

              <PermissionContent permissions={permissions.HIERARCHY.UPDATE_USER_BRANCH}>
                <button
                  type="button"
                  className="btn btn-sm margin-top-10 margin-bottom-10"
                  disabled={branchFormVisibility && !allowUpdateHierarchy}
                  onClick={this.toggleBranchForm}
                >
                  {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
                </button>
              </PermissionContent>

              <If condition={branchFormVisibility && allowUpdateHierarchy}>
                <AddBranchForm
                  refetchUserBranchesTreeUp={refetch}
                  hideForm={this.toggleBranchForm}
                  operatorFullName={operatorFullName}
                  subordinatesCount={subordinatesCount}
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

export default withModals({
  confirmActionModal: ConfirmActionModal,
})(HierarchyProfileForm);
