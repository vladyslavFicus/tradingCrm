import React, { useState } from 'react';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { parseErrors } from 'apollo';
import { Operator, HierarchyBranch } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { branchTypes } from 'constants/hierarchyTypes';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { createValidator, translateLabels } from 'utils/validator';
import { useOperatorHierarchyQuery } from './graphql/__generated__/OperatorHierarchyQuery';
import { useHierarchyUserBranchesQuery } from './graphql/__generated__/HierarchyUserBranchesQuery';
import { useAddOperatorToBranchMutation } from './graphql/__generated__/AddOperatorToBranchMutation';
import { useRemoveOperatorFromBranchMutation } from './graphql/__generated__/RemoveOperatorFromBranchMutation';
import './OperatorHierarchyBranches.scss';

const attributeLabels = {
  branchType: 'COMMON.BRANCH_TYPE',
  branch: 'COMMON.BRANCH',
};

type FormValues = {
  branchType: string,
  branchUuid: string,
};

type Props = {
  operator: Operator,
  allowToUpdateHierarchy: boolean,
};

const OperatorHierarchyBranches = (props: Props) => {
  const { operator, allowToUpdateHierarchy } = props;

  const operatorUuid = operator.uuid;

  const branchTypesOptions = Object.keys(omit(branchTypes, 'COMPANY'));

  const [isVisibleAddBranchForm, setSsVisibleAddBranchForm] = useState(false);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Requests ===== //
  const operatorHierarchyQuery = useOperatorHierarchyQuery({ variables: { uuid: operator.uuid } });

  const totalSubordinates = operatorHierarchyQuery.data?.userHierarchyById?.statistics?.totalSubordinatesCount || 0;
  const operatorBranches = operatorHierarchyQuery.data?.userHierarchyById?.parentBranches || [];
  const operatorBranchesUuids = operatorBranches.map(({ uuid }) => uuid);

  const hierarchyUserBranchesQuery = useHierarchyUserBranchesQuery({ variables: { withoutBrandFilter: true } });

  const branchesByType: Record<string, HierarchyBranch[] | null> = hierarchyUserBranchesQuery.data?.userBranches || {};

  const [addOperatorToBranchMutation] = useAddOperatorToBranchMutation();

  const [removeOperatorFromBranchMutation] = useRemoveOperatorFromBranchMutation();

  // ===== Handlers ===== //
  const toggleAddBranchFormVisibility = () => {
    setSsVisibleAddBranchForm(!isVisibleAddBranchForm);
  };

  // # As result it must return a chain like: brand -> office -> desk -> ...
  const buildParentsBranchChain = (branch: HierarchyBranch, parentsBranchChain = ''): string => {
    const { branchType, uuid } = branch;

    const { parentBranch } = branchesByType[branchType]?.find(branchItem => branchItem.uuid === uuid) || {};

    return parentBranch && parentBranch.branchType !== 'COMPANY'
      ? buildParentsBranchChain(parentBranch, `${parentBranch.name} → ${parentsBranchChain}`)
      : parentsBranchChain;
  };

  const handleConfirmAction = (branch: HierarchyBranch, action: Function, assign = false) => {
    const actionKey = assign ? 'ASSIGN_BRANCH' : 'UNASSIGN_BRANCH';

    if (totalSubordinates >= 10000) {
      confirmActionModal.show({
        modalTitle: I18n.t(`MODALS.${actionKey}.TITLE`),
        actionText: I18n.t(`MODALS.${actionKey}.DESCRIPTION`, {
          operator: operator.fullName,
          clients: totalSubordinates,
          branch: `${buildParentsBranchChain(branch)} ${branch.name}`,
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
  };

  const handleSubmit = ({ branchUuid, branchType }: FormValues) => {
    const branches = branchesByType[branchType] || [];
    const branch = branches.find(branchItem => branchItem.uuid === branchUuid);

    if (branch) {
      handleConfirmAction(branch, async () => {
        try {
          await addOperatorToBranchMutation({
            variables: {
              branchId: branchUuid,
              operatorId: operatorUuid,
            },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCH_ADDED', { name: branch.name }),
          });

          toggleAddBranchFormVisibility();
          operatorHierarchyQuery.refetch();
        } catch (e) {
          const error = parseErrors(e);

          notify({
            level: LevelType.ERROR,
            title: I18n.t('MODALS.ADD_OPERATOR_TO_BRANCH.NOTIFICATION.FAILED.OPERATOR_ADDED'),
            message: error.message || I18n.t('COMMON.SOMETHING_WRONG'),
          });
        }
      }, true);
    }
  };

  const handleRemoveBranch = (branchItem: HierarchyBranch) => {
    const { name, uuid } = branchItem;

    handleConfirmAction(branchItem, async () => {
      try {
        await removeOperatorFromBranchMutation({
          variables: {
            branchId: uuid,
            operatorId: operatorUuid,
          },
        });

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('OPERATORS.PROFILE.HIERARCHY.SUCCESS_REMOVE_BRANCH', { name }),
        });

        operatorHierarchyQuery.refetch();
      } catch (e) {
        const error = parseErrors(e);

        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: error.message || I18n.t('OPERATORS.PROFILE.HIERARCHY.ERROR_REMOVE_BRANCH'),
        });
      }
    });
  };

  return (
    <div className="OperatorHierarchyBranches">
      {/* Branches list */}
      <div className="OperatorHierarchyBranches__branches">
        <Choose>
          <When condition={!!operatorBranches.length}>
            {operatorBranches.map(branchItem => (
              <div className="OperatorHierarchyBranches__branch" key={branchItem.uuid}>
                <div className="OperatorHierarchyBranches__branch-title">
                  {`${I18n.t(`COMMON.${branchItem.branchType}`)}: ${buildParentsBranchChain(branchItem)}`}

                  <span className="OperatorHierarchyBranches__branch-name">{branchItem.name}</span>
                </div>

                <If condition={operatorBranches.length > 1 && allowToUpdateHierarchy}>
                  <i
                    onClick={() => handleRemoveBranch(branchItem)}
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
              tertiary
              className="OperatorHierarchyBranches__add-button"
              onClick={toggleAddBranchFormVisibility}
            >
              {I18n.t('OPERATORS.PROFILE.HIERARCHY.ADD_BRANCH_LABEL')}
            </Button>
          </When>

          <Otherwise>
            <hr />

            <Formik
              initialValues={{ branchType: '', branchUuid: '' }}
              validate={
                createValidator({
                  branchType: ['required'],
                  branchUuid: ['required'],
                }, translateLabels(attributeLabels))
              }
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values }) => {
                const branches = branchesByType[values.branchType] || [];
                const availableBranches = branches.filter(({ uuid }) => !operatorBranchesUuids.includes(uuid));

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
                        // @ts-ignore prop "search" does not exist for the tag option
                        <option key={branch.uuid} value={branch.uuid} search={branch.name}>
                          {buildParentsBranchChain(branch)}
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
                        secondary
                        className="OperatorHierarchyBranches__form-button"
                        onClick={toggleAddBranchFormVisibility}
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
};

export default React.memo(OperatorHierarchyBranches);
