import { useCallback, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { omit } from 'lodash';
import { parseErrors, notify, LevelType, useModal } from '@crm/common';
import { Operator, HierarchyBranch } from '__generated__/types';
import { SetFieldValue } from 'types/formik';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { branchTypes } from 'constants/hierarchyTypes';
import { useOperatorHierarchyQuery, OperatorHierarchyQuery } from '../graphql/__generated__/OperatorHierarchyQuery';
import { useBrandsQuery } from '../graphql/__generated__/BrandsQuery';
import { useUserBrandHierarchyQueryLazyQuery } from '../graphql/__generated__/UserBrandHierarchyQuery';
import { useAddOperatorToBranchMutation } from '../graphql/__generated__/AddOperatorToBranchMutation';
import { useRemoveOperatorFromBranchMutation } from '../graphql/__generated__/RemoveOperatorFromBranchMutation';

type FormValues = {
  brandId: string,
  branchType: string,
  branchUuid: string,
};

type branches = ExtractApolloTypeFromArray<OperatorHierarchyQuery['userBranchesTreeUp']['branches']>;

type Props = {
  operator: Operator,
};

type UseOperatorHierarchyBranches = {
  operatorBranches: Array<HierarchyBranch>,
  buildOperatorParentsBranchChain: (branch: HierarchyBranch, parentsBranchChain?: string) => string,
  isVisibleAddBranchForm: boolean,
  brandsLoading: boolean,
  hierarchyLoading: boolean,
  operatorBranchesUuids: Array<string>,
  brandsList: Array<HierarchyBranch>,
  branchTypesOptions: Array<string>,
  buildHierarchyParentsBranchChain: (branch: HierarchyBranch, parentsBranchChain?: string) => string,
  toggleAddBranchFormVisibility: () => void,
  getBranchTypeList: (branchType: string) => Array<HierarchyBranch>,
  handleSubmit: (formValues: FormValues) => void,
  handleRemoveBranch: (branchItem: HierarchyBranch) => void,
  handleBranchTypeChange: (branchType: string, setFieldValue: SetFieldValue<FormValues>) => void,
  handleBrandChange: (brandId: string, setFieldValue: SetFieldValue<FormValues>) => void,
};

const useOperatorHierarchyBranches = (props: Props): UseOperatorHierarchyBranches => {
  const { operator } = props;

  const operatorUuid = operator.uuid;

  const branchTypesOptions = Object.keys(omit(branchTypes, 'COMPANY'));

  const [userBrandHierarchy, setUserBrandHierarchy] = useState<Record<string, HierarchyBranch[] | null>>({});
  const [isVisibleAddBranchForm, setSsVisibleAddBranchForm] = useState(false);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Requests ===== //
  const { data, refetch } = useOperatorHierarchyQuery({ variables: { userUUID: operator.uuid } });

  const totalSubordinates = data?.userBranchesTreeUp.statistics.totalSubordinatesCount || 0;
  const operatorBranches = data?.userBranchesTreeUp.branches || [];
  const operatorBranchesUuids = useMemo(() => operatorBranches
    .map(({ uuid }: branches) => uuid), [operatorBranches]);

  const brandsQuery = useBrandsQuery({ variables: { branchType: 'brand' } });
  const brandsList = brandsQuery.data?.branch || [];
  const brandsLoading = brandsQuery.loading;

  const [userBrandHierarchyQuery, { loading: hierarchyLoading }] = useUserBrandHierarchyQueryLazyQuery();

  const [addOperatorToBranchMutation] = useAddOperatorToBranchMutation();

  const [removeOperatorFromBranchMutation] = useRemoveOperatorFromBranchMutation();

  const getBranchTypeList = (branchType: string) => userBrandHierarchy[branchType] || [];

  // ===== Handlers ===== //
  const toggleAddBranchFormVisibility = useCallback(() => {
    setSsVisibleAddBranchForm(prevIsVisibleAddBranchForm => !prevIsVisibleAddBranchForm);
  }, []);

  // # As result it must return a chain like: office -> desk -> team
  const buildHierarchyParentsBranchChain = useCallback((branch: HierarchyBranch, parentsBranchChain = ''): string => {
    const { branchType, uuid } = branch;

    const { parentBranch } = getBranchTypeList(branchType).find(branchItem => branchItem.uuid === uuid) || {};

    return parentBranch && parentBranch.branchType !== 'COMPANY'
      ? buildHierarchyParentsBranchChain(parentBranch, `${parentBranch.name} → ${parentsBranchChain}`)
      : parentsBranchChain;
  }, []);

  // # As result it must return a chain like: brand -> office -> desk -> team
  const buildOperatorParentsBranchChain = useCallback((branch: HierarchyBranch, parentsBranchChain = ''): string => {
    const { parentBranch } = branch;

    return parentBranch && parentBranch.branchType !== 'COMPANY'
      ? buildOperatorParentsBranchChain(parentBranch, `${parentBranch.name} → ${parentsBranchChain}`)
      : parentsBranchChain;
  }, []);

  const handleConfirmAction = useCallback((branch: HierarchyBranch, action: Function, assign = false) => {
    const actionKey = assign ? 'ASSIGN_BRANCH' : 'UNASSIGN_BRANCH';

    if (totalSubordinates >= 10000) {
      confirmActionModal.show({
        modalTitle: I18n.t(`MODALS.${actionKey}.TITLE`),
        actionText: I18n.t(`MODALS.${actionKey}.DESCRIPTION`, {
          operator: operator.fullName,
          clients: totalSubordinates,
          branch: branch.name,
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
  }, [totalSubordinates, operator.fullName]);

  const handleSubmit = useCallback(({ brandId, branchType, branchUuid }: FormValues) => {
    const branchId = branchType === 'BRAND' ? brandId : branchUuid;
    const branches = branchType === 'BRAND' ? brandsList : getBranchTypeList(branchType);
    const branch = branches.find((branchItem: HierarchyBranch) => branchItem.uuid === branchId);

    if (branch) {
      handleConfirmAction(branch, async () => {
        try {
          await addOperatorToBranchMutation({
            variables: { branchId, operatorId: operatorUuid },
          });

          notify({
            level: LevelType.SUCCESS,
            title: I18n.t('COMMON.SUCCESS'),
            message: I18n.t('OPERATORS.PROFILE.HIERARCHY.BRANCH_ADDED', { name: branch.name }),
          });

          toggleAddBranchFormVisibility();
          refetch();
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
  }, [operatorUuid]);

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

        refetch();
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

  const handleBranchTypeChange = useCallback((branchType: string, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('branchType', branchType);

    // Clear branchUuid field while new Branch Type chosen
    setFieldValue('branchUuid', '');
  }, []);

  const handleBrandChange = useCallback(async (brandId: string, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('brandId', brandId);

    // Clear branchUuid field while new Brand chosen
    setFieldValue('branchUuid', '');

    const brand = brandsList.find((item: HierarchyBranch) => item.uuid === brandId);

    if (brand) {
      try {
        const { data: dataUserBrand } = await userBrandHierarchyQuery({ variables: { brandId: brand.name } });

        setUserBrandHierarchy(dataUserBrand?.userBranches || {});
      } catch {
        setUserBrandHierarchy({});
      }
    }
  }, []);

  return {
    operatorBranches,
    buildOperatorParentsBranchChain,
    isVisibleAddBranchForm,
    brandsLoading,
    hierarchyLoading,
    operatorBranchesUuids,
    brandsList,
    branchTypesOptions,
    buildHierarchyParentsBranchChain,
    toggleAddBranchFormVisibility,
    getBranchTypeList,
    handleSubmit,
    handleRemoveBranch,
    handleBranchTypeChange,
    handleBrandChange,
  };
};

export default useOperatorHierarchyBranches;
