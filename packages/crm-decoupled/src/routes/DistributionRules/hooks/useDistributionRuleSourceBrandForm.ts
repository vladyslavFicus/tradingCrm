import { useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { sortBy } from 'lodash';
import { BrandConfig, AcquisitionStatus } from '__generated__/types';
import { FormValues, Desk, Partner, Team } from 'routes/DistributionRules/types';
import { useBrandsQuery } from '../graphql/__generated__/BrandsQuery';
import { useHierarchyBranchesQuery } from '../graphql/__generated__/HierarchyBranchesQuery';
import { usePartnersWithBrandIdQuery } from '../graphql/__generated__/PartnersWithBrandIdQuery';
import { useClientsAmountQuery, ClientsAmountQuery } from '../graphql/__generated__/ClientsAmountQuery';
import { useAcquisitionStatusesQuery } from '../graphql/__generated__/AcquisitionStatusesQuery';

type SourceBrandConfig = FormValues['sourceBrandConfig'];

type UseDistributionRuleSourceBrandForm = {
  isClientsAmountAvailable: boolean,
  acquisitionStatusesLoading: boolean,
  brandsLoading: boolean,
  brands: Array<BrandConfig>,
  partnersLoading: boolean,
  partners: Array<Partner>,
  hierarchyBranchesLoading: boolean,
  desks: Array<Desk>,
  clientsAmount: number,
  clientsAmountData?: ClientsAmountQuery,
  clientsAmountLoading: boolean,
  clientsAmountError: boolean,
  salesStatuses: Array<AcquisitionStatus>,
  filteredTeams: Array<Team>,
  validateQuantity: (value: number) => void,
};

const useDistributionRuleSourceBrandForm = (
  sourceBrandConfig: SourceBrandConfig,
): UseDistributionRuleSourceBrandForm => {
  // We should fetching and showing clients count only in case when filled all mandatory fields
  const isClientsAmountAvailable = !!sourceBrandConfig?.brand
    && !!sourceBrandConfig?.salesStatuses?.length
    && !!sourceBrandConfig?.countries?.length
    && !!sourceBrandConfig?.languages?.length;

  // Get list of brands
  const brandsQuery = useBrandsQuery();

  // Get partners depends on chosen brand
  const partnersQuery = usePartnersWithBrandIdQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
      page: {
        from: 0,
        size: 10000,
        sorts: [
          { column: 'status', direction: 'ASC' },
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  // Get hierarchy branches depends on chosen brand
  const hierarchyBranchesQuery = useHierarchyBranchesQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  // Get clients amount depends on chosen fields
  const clientsAmountQuery = useClientsAmountQuery({
    variables: {
      sourceBrand: sourceBrandConfig?.brand as string,
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
  const {
    data: dataAcquisitionStatuses,
    loading: acquisitionStatusesLoading,
  } = useAcquisitionStatusesQuery({
    variables: {
      brandId: sourceBrandConfig?.brand as string,
    },
    // Skip query if brand wasn't chosen
    skip: !sourceBrandConfig?.brand,
  });

  const brands = brandsQuery.data?.brands || [];
  const brandsLoading = brandsQuery.loading;

  const partners = partnersQuery.data?.partners.content || [];
  const partnersLoading = partnersQuery.loading;

  const desks = hierarchyBranchesQuery.data?.userBranches?.DESK || [];
  const teams = hierarchyBranchesQuery.data?.userBranches?.TEAM || [];
  const hierarchyBranchesLoading = hierarchyBranchesQuery.loading;

  const clientsAmount = clientsAmountQuery.data?.distributionRuleClientsAmount || 0;
  const clientsAmountData = clientsAmountQuery.data;
  const clientsAmountLoading = clientsAmountQuery.loading;
  const clientsAmountError = !!clientsAmountQuery.error;
  const salesStatuses = useMemo(
    () => sortBy(dataAcquisitionStatuses?.settings.acquisitionStatuses || [], 'status'),
    [dataAcquisitionStatuses],
  );

  // Filter teams depends on selected desk
  const filteredTeams = useMemo(() => (sourceBrandConfig?.desks?.length
    ? teams.filter(({ parentBranch }) => parentBranch && sourceBrandConfig?.desks?.includes(parentBranch.uuid))
    : teams), [sourceBrandConfig?.desks]);

  const { distributionUnit: { baseUnit } } = sourceBrandConfig;

  // Quantity field validation
  const validateQuantity = useCallback((value: number) => {
    if ((baseUnit === 'AMOUNT' && value > clientsAmount)
      || (baseUnit === 'PERCENTAGE' && value > 100)) {
      return I18n.t('CLIENTS_DISTRIBUTION.RULE.MODAL.MAX_AVAILABLE_CLIENTS', {
        max: clientsAmount,
      });
    }

    return null;
  }, [baseUnit, clientsAmount]);

  return {
    isClientsAmountAvailable,
    acquisitionStatusesLoading,
    brandsLoading,
    brands,
    partnersLoading,
    partners,
    hierarchyBranchesLoading,
    desks,
    clientsAmount,
    clientsAmountData,
    clientsAmountLoading,
    clientsAmountError,
    salesStatuses,
    filteredTeams,
    validateQuantity,
  };
};

export default useDistributionRuleSourceBrandForm;
