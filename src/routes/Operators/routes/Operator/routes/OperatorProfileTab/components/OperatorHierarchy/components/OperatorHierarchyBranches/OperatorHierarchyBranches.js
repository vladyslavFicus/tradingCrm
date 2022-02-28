import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withModals, withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import { branchTypes } from 'constants/hierarchyTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import OperatorHierarchyQuery from './graphql/OperatorHierarchyQuery';
import HierarchyUserBranchesQuery from './graphql/HierarchyUserBranchesQuery';
import AddOperatorToBranchMutation from './graphql/AddOperatorToBranchMutation';
import RemoveOperatorFromBranchMutation from './graphql/RemoveOperatorFromBranchMutation';
import './OperatorHierarchyBranches.scss';

const attributeLabels = {
  branchType: 'COMMON.BRANCH_TYPE',
  branch: 'COMMON.BRANCH',
};

class OperatorHierarchyBranches extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    allowToUpdateHierarchy: PropTypes.bool.isRequired,
    addOperatorToBranch: PropTypes.func.isRequired,
    removeOperatorFromBranch: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    operatorQuery: PropTypes.query({
      operator: PropTypes.operator,
    }).isRequired,
    operatorHierarchyQuery: PropTypes.query({
      userHierarchyById: PropTypes.shape({
        statistics: PropTypes.shape({
          totalSubordinatesCount: PropTypes.number,
        }),
        parentBranches: PropTypes.arrayOf(PropTypes.branchHierarchyType),
      }),
    }).isRequired,
    hierarchyUserBranchesQuery: PropTypes.query({
      userBranches: PropTypes.shape({
        BRAND: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        OFFICE: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        DESK: PropTypes.arrayOf(PropTypes.branchHierarchyType),
        TEAM: PropTypes.arrayOf(PropTypes.branchHierarchyType),
      }),
    }).isRequired,
  }

  state = {
    isVisibleAddBranchForm: false,
  }

  toggleAddBranchFormVisibility = () => {
    this.setState(({ isVisibleAddBranchForm }) => ({
      isVisibleAddBranchForm: !isVisibleAddBranchForm,
    }));
  }

  handleConfirmAction = (branch, action, actionType) => {
    const {
      operatorQuery,
      operatorHierarchyQuery,
      modals: { confirmActionModal },
    } = this.props;

    const operator = operatorQuery.data?.operator || {};
    const totalSubordinatesCount = operatorHierarchyQuery.data?.userHierarchyById?.statistics?.totalSubordinatesCount;

    const actionKey = actionType === 'ASSIGN' ? 'ASSIGN_BRANCH' : 'UNASSIGN_BRANCH';

    if (totalSubordinatesCount >= 10000) {
      confirmActionModal.show({
        modalTitle: I18n.t(`MODALS.${actionKey}.TITLE`),
        actionText: I18n.t(`MODALS.${actionKey}.DESCRIPTION`, {
          operator: operator.fullName,
          clients: totalSubordinatesCount,
          branch: `${this.buildParentsBranchChain(branch)} ${branch.name}`,
        }),
        submitButtonLabel: I18n.t('ACTIONS_LABELS.IGNORE'),
        onSubmit: () => {
          action();
          confirmActionModal.hide();
        },
      });

      return;
    }

    action();
  }

  handleAddBranch = ({ branchUuid, branchType }) => {
    const {
      notify,
      operatorQuery,
      addOperatorToBranch,
      operatorHierarchyQuery,
      hierarchyUserBranchesQuery,
    } = this.props;

    const operatorUuid = operatorQuery.data?.operator?.uuid;
    const branchesByType = hierarchyUserBranchesQuery.data?.userBranches || {};
    const branch = branchesByType[branchType].find(_branch => _branch.uuid === branchUuid);

    this.handleConfirmAction(branch, async () => {
      try {
        await addOperatorToBranch({
          variables: {
            branchId: branchUuid,
            operatorId: operatorUuid,
          },
        });

        notify({
          level: 'success',
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCH_ADDED', { name: branch.name }),
        });

        this.toggleAddBranchFormVisibility();
        operatorHierarchyQuery.refetch();
      } catch (e) {
        const error = parseErrors(e);

        notify({
          level: 'error',
          title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.FAILED.OPERATOR_ADDED'),
          message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
        });
      }
    }, 'ASSIGN');
  }

  handleRemoveBranch = (branch) => {
    const {
      notify,
      operatorQuery,
      operatorHierarchyQuery,
      removeOperatorFromBranch,
    } = this.props;

    const operatorUuid = operatorQuery.data?.operator?.uuid;

    const { name, uuid } = branch;

    this.handleConfirmAction(branch, async () => {
      try {
        await removeOperatorFromBranch({
          variables: {
            branchId: uuid,
            operatorId: operatorUuid,
          },
        });

        notify({
          level: 'success',
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_REMOVE_BRANCH', { name }),
        });

        operatorHierarchyQuery.refetch();
      } catch (e) {
        const error = parseErrors(e);

        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: error.message || I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_REMOVE_BRANCH'),
        });
      }
    });
  }

  // # As result it must return a chain like: brand -> office -> desk -> ...
  buildParentsBranchChain = (branch, parentsBranchChain = '') => {
    const { hierarchyUserBranchesQuery } = this.props;

    const branchesByType = hierarchyUserBranchesQuery.data?.userBranches || {};

    const { branchType, uuid } = branch;

    const { parentBranch } = branchesByType[branchType]?.find(_branch => _branch.uuid === uuid) || {};

    return parentBranch && parentBranch.branchType !== 'COMPANY'
      ? this.buildParentsBranchChain(parentBranch, `${parentBranch.name} → ${parentsBranchChain}`)
      : parentsBranchChain;
  };

  render() {
    const {
      hierarchyUserBranchesQuery,
      allowToUpdateHierarchy,
      operatorHierarchyQuery,
    } = this.props;

    const { isVisibleAddBranchForm } = this.state;

    const branchesByType = hierarchyUserBranchesQuery.data?.userBranches || {};
    const operatorBranches = operatorHierarchyQuery.data?.userHierarchyById?.parentBranches || [];
    const operatorBranchesUuids = operatorBranches.map(({ uuid }) => uuid);
    const branchTypesOptions = Object.keys(omit(branchTypes, 'COMPANY'));

    return (
      <div className="OperatorHierarchyBranches">
        {/* Branches list */}
        <div className="OperatorHierarchyBranches__branches">
          <Choose>
            <When condition={operatorBranches.length}>
              {operatorBranches.map(branch => (
                <div className="OperatorHierarchyBranches__branch" key={branch.uuid}>
                  <div className="OperatorHierarchyBranches__branch-title">
                    {`${I18n.t(`COMMON.${branch.branchType}`)}: ${this.buildParentsBranchChain(branch)}`}

                    <span className="OperatorHierarchyBranches__branch-name">{branch.name}</span>
                  </div>

                  <If condition={operatorBranches.length > 1 && allowToUpdateHierarchy}>
                    <i
                      onClick={() => this.handleRemoveBranch(branch)}
                      className="fa fa-trash OperatorHierarchyBranches__branch-remove"
                    />
                  </If>
                </div>
              ))}
            </When>
            <Otherwise>
              <div className="OperatorHierarchyBranches__no-branches">
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.NO_BRANCHES')}
              </div>
            </Otherwise>
          </Choose>
        </div>

        {/* Open form action button && Add branch form */}
        <If condition={allowToUpdateHierarchy}>
          <Choose>
            <When condition={!isVisibleAddBranchForm}>
              <Button
                small
                commonOutline
                className="OperatorHierarchyBranches__add-button"
                onClick={this.toggleAddBranchFormVisibility}
              >
                {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
              </Button>
            </When>
            <Otherwise>
              <hr />

              <Formik
                initialValues={{}}
                validate={
                  createValidator({
                    branchType: ['required'],
                    branchUuid: ['required'],
                  }, translateLabels(attributeLabels))
                }
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={this.handleAddBranch}
              >
                {({ isSubmitting, values }) => {
                  const availableBranches = values.branchType
                    ? branchesByType[values.branchType].filter(({ uuid }) => !operatorBranchesUuids.includes(uuid))
                    : [];

                  return (
                    <Form className="OperatorHierarchyBranches__form">
                      <Field
                        name="branchType"
                        className="OperatorHierarchyBranches__form-field"
                        label={I18n.t(attributeLabels.branchType)}
                        placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                        component={FormikSelectField}
                        disabled={isSubmitting}
                        searchable
                      >
                        {branchTypesOptions.map(branchType => (
                          <option key={branchType} value={branchType}>
                            {I18n.t(`COMMON.${branchType}`)}
                          </option>
                        ))}
                      </Field>

                      <Field
                        name="branchUuid"
                        label={I18n.t(attributeLabels.branch)}
                        className="OperatorHierarchyBranches__form-field"
                        component={FormikSelectField}
                        placeholder={I18n.t(
                          !availableBranches.length
                            ? 'COMMON.SELECT_OPTION.NO_ITEMS'
                            : 'COMMON.SELECT_OPTION.DEFAULT',
                        )}
                        disabled={!availableBranches.length}
                        searchable
                      >
                        {availableBranches.map(branch => (
                          <option key={branch.uuid} value={branch.uuid} search={branch.name}>
                            {this.buildParentsBranchChain(branch)}
                            <span className="OperatorHierarchyBranches__branch-name">{branch.name}</span>
                          </option>
                        ))}
                      </Field>

                      <div className="OperatorHierarchyBranches__form-buttons">
                        <Button
                          primary
                          className="OperatorHierarchyBranches__form-button"
                          disabled={isSubmitting}
                          type="submit"
                        >
                          {I18n.t('COMMON.SAVE')}
                        </Button>

                        <Button
                          common
                          className="OperatorHierarchyBranches__form-button"
                          onClick={this.toggleAddBranchFormVisibility}
                        >
                          {I18n.t('COMMON.CANCEL')}
                        </Button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </Otherwise>
          </Choose>
        </If>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  withRequests({
    operatorHierarchyQuery: OperatorHierarchyQuery,
    addOperatorToBranch: AddOperatorToBranchMutation,
    hierarchyUserBranchesQuery: HierarchyUserBranchesQuery,
    removeOperatorFromBranch: RemoveOperatorFromBranchMutation,
  }),
)(OperatorHierarchyBranches);
