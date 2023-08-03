import { useCallback } from 'react';
import { FormikProps, getIn } from 'formik';
import I18n from 'i18n-js';
import { sortBy } from 'lodash';
import { AcquisitionStatus, BrandConfig, Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { FormValues, Partner } from 'routes/DistributionRules/types';
import { useBrandsQuery } from '../graphql/__generated__/BrandsQuery';
import { usePartnersCdeQuery } from '../graphql/__generated__/PartnersCdeQuery';
import { useOperatorsByBrandQuery, OperatorsByBrandQuery } from '../graphql/__generated__/OperatorsByBrandQuery';
import { useClientsAmountWithTargetBrandQuery } from '../graphql/__generated__/ClientsAmountWithTargetBrandQuery';
import { useAcquisitionStatusesQuery } from '../graphql/__generated__/AcquisitionStatusesQuery';

type Props = {
  formik: FormikProps<FormValues>,
};

type OperatorsByBrand = OperatorsByBrandQuery['operatorsByBrand'];

type UseDistributionRuleTargetBrandForm = {
  isClientsAmountAvailable: boolean,
  isEditEnabled: boolean,
  brandsLoading: boolean,
  clientsAmountLoading: boolean,
  clientsAmountError: boolean,
  acquisitionStatusesLoading: boolean,
  partnersLoading: boolean,
  operatorsByBrandLoading: boolean,
  totalTargetClientsAmount: number,
  brands: Array<BrandConfig>,
  partners: Array<Partner>,
  operators: OperatorsByBrand,
  salesStatuses: Array<AcquisitionStatus>,
  validateQuantity: (value: number) => void,
  onChangeBrand: (value: string) => void,
};

const useDistributionRuleTargetBrandForm = (props: Props): UseDistributionRuleTargetBrandForm => {
  const {
    formik: {
      values: {
        sourceBrandConfig,
        targetBrandConfig,
      },
      errors,
      setFieldValue,
    },
  } = props;

  // If target source form enabled to edit
  const isEditEnabled = !!sourceBrandConfig?.brand
    && !!sourceBrandConfig?.salesStatuses?.length
    && !!sourceBrandConfig?.countries?.length
    && !!sourceBrandConfig?.languages?.length
    && !getIn(errors, 'sourceBrandConfig');

  // We should fetching and showing clients count only in case when filled all mandatory fields
  const isClientsAmountAvailable = isEditEnabled && !!targetBrandConfig?.brand;

  // Get list of brands
  const { data: brandsData, loading: brandsLoading } = useBrandsQuery();

  // Get all cde partners
  const { data: partnersData, loading: partnersLoading } = usePartnersCdeQuery();

  // Get operators by brand depends on chosen brand
  const { data: operatorsByBrandData, loading: operatorsByBrandLoading } = useOperatorsByBrandQuery({
    variables: {
      brandId: targetBrandConfig?.brand as string,
      hierarchyTypeGroup: DeskTypesEnum.SALES,
    },
    // Skip query if brand wasn't chosen
    skip: !targetBrandConfig?.brand,
  });

  // Get clients amount depends on chosen fields
  const clientsAmountQuery = useClientsAmountWithTargetBrandQuery({
    variables: {
      sourceBrand: sourceBrandConfig?.brand as string,
      targetBrand: targetBrandConfig?.brand as string,
      salesStatuses: sourceBrandConfig?.salesStatuses || null,
      countries: sourceBrandConfig?.countries || null,
      languages: sourceBrandConfig?.languages || null,
      affiliateUuids: sourceBrandConfig?.affiliateUuids || null,
      registrationPeriodInHours: sourceBrandConfig?.registrationPeriodInHours || null,
      registrationDateRange: sourceBrandConfig?.registrationDateRange || null,
      lastNotePeriodInHours: sourceBrandConfig?.lastNotePeriodInHours || null,
      lastNoteDateRange: sourceBrandConfig?.lastNoteDateRange || null,
      timeInCurrentStatusInHours: sourceBrandConfig?.timeInCurrentStatusInHours || null,
      firstTimeDeposit: sourceBrandConfig?.firstTimeDeposit || null,
      desks: sourceBrandConfig?.desks || null,
      teams: sourceBrandConfig?.teams || null,
    },
    // Skip query if fetching amount of clients isn't available
    skip: !isClientsAmountAvailable,
  });

  // Get sales statuses
  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: targetBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !targetBrandConfig?.brand,
  });
  const acquisitionStatusesLoading = acquisitionStatusesQuery.loading;

  const brands = (brandsData?.brands || []).filter(({ brandId }) => brandId !== sourceBrandConfig?.brand);

  const partners = (partnersData?.cdePartners || [])
    .filter(({ brand }) => targetBrandConfig?.brand === brand);

  const operators = operatorsByBrandData?.operatorsByBrand || [];

  const clientsAmount = clientsAmountQuery.data?.distributionRuleClientsAmount || 0;
  const clientsAmountLoading = clientsAmountQuery.loading;
  const clientsAmountError = !!clientsAmountQuery.error;

  const salesStatuses = sortBy(acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [], 'status');

  // Calculating right amount of clients for migration
  let totalTargetClientsAmount = Math.min(sourceBrandConfig?.distributionUnit?.quantity as number, clientsAmount);

  if (sourceBrandConfig?.distributionUnit?.baseUnit === 'PERCENTAGE' && sourceBrandConfig?.distributionUnit?.quantity) {
    totalTargetClientsAmount = Math.floor(clientsAmount / 100 * sourceBrandConfig.distributionUnit.quantity);
  }

  const { distributionUnit: { baseUnit } } = targetBrandConfig;

  // Quantity field validation
  const validateQuantity = useCallback((value: number) => {
    if ((baseUnit === 'AMOUNT' && value > totalTargetClientsAmount)
      || (baseUnit === 'PERCENTAGE' && value > 100)) {
      return I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.MAX_AVAILABLE_CLIENTS', {
        max: totalTargetClientsAmount,
      });
    }

    return null;
  }, [baseUnit, totalTargetClientsAmount]);

  const onChangeBrand = useCallback((value: string) => {
    setFieldValue('targetBrandConfig.brand', value);
    setFieldValue('targetBrandConfig.affiliateUuid', '');
  }, []);

  return {
    isClientsAmountAvailable,
    isEditEnabled,
    brandsLoading,
    clientsAmountLoading,
    clientsAmountError,
    acquisitionStatusesLoading,
    partnersLoading,
    operatorsByBrandLoading,
    totalTargetClientsAmount,
    brands,
    partners,
    operators,
    salesStatuses,
    validateQuantity,
    onChangeBrand,
  };
};

export default useDistributionRuleTargetBrandForm;
