import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import { intersection, sortBy } from 'lodash';
import Trackify from '@hrzn/trackify';
import { Config, Types, useStorage, Auth, usePermission } from '@crm/common';
import usePrevious from 'hooks/usePrevious';
import {
  PARTNERS_SORT,
  OPERATORS_SORT,
  storageKey,
  oldFilters,
  defaultFilters,
} from '../constants';
import { FormValues } from '../types';
import { usePartnersQueryLazyQuery } from '../graphql/__generated__/PartnersQuery';
import { useOperatorsQueryLazyQuery } from '../graphql/__generated__/OperatorsQuery';
import { useAcquisitionStatusesQueryLazyQuery } from '../graphql/__generated__/AcquisitionStatusesQuery';
import { useDesksAndTeamsQueryLazyQuery } from '../graphql/__generated__/DesksAndTeamsQuery';
import { useAffiliateReferralsQueryLazyQuery } from '../graphql/__generated__/AffiliateReferralsQuery';

const useClientsGridFilter = () => {
  const storage = useStorage();
  const { role, department } = storage.get('auth') as Auth;
  const isOldClientsGridFilterPanel = !!storage.get('isOldClientsGridFilterPanel');
  const state = useLocation().state as Types.State<FormValues>;
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const prevFiltersFields = usePrevious(state?.filtersFields);

  const permission = usePermission();
  const allowPartnersListView = permission.allows(Config.permissions.PARTNERS.PARTNERS_LIST_VIEW);
  const allowAffiliateReferrals = permission.allows(Config.permissions.PARTNERS.AFFILIATE_REFERRALS);

  const [getPartnersQuery, {
    data: partnersData, loading: isPartnersLoading,
  }] = usePartnersQueryLazyQuery({ variables: { page: { sorts: PARTNERS_SORT } } });

  const [getOperatorsQuery, {
    data: operatorsData, loading: isOperatorsLoading,
  }] = useOperatorsQueryLazyQuery({ variables: { page: { sorts: OPERATORS_SORT } } });

  const [getDesksAndTeamsQuery, {
    data: desksAndTeamsData, loading: isDesksAndTeamsLoading,
  }] = useDesksAndTeamsQueryLazyQuery();

  const [getAcquisitionStatusesQuery, {
    data: acquisitionStatusesData, loading: isAcquisitionStatusesLoading,
  }] = useAcquisitionStatusesQueryLazyQuery({ variables: { brandId: Config.getBrand().id } });

  const [getAffiliateReferralsQuery, {
    data: affiliateReferralsData, loading: isAffiliateReferralsLoading,
  }] = useAffiliateReferralsQueryLazyQuery();

  // For field affiliateUuids
  const handleFetchPartners = useCallback(() => {
    if (!partnersData) getPartnersQuery();
  }, [getPartnersQuery, partnersData]);

  // For field affiliate referrals
  const handleFetchAffiliateReferrals = () => {
    if (!affiliateReferralsData) getAffiliateReferralsQuery();
  };

  // For fields salesOperators, operators, retentionOperators
  const handleFetchOperators = useCallback(() => {
    if (!operatorsData) getOperatorsQuery();
  }, [getOperatorsQuery, operatorsData]);

  // For fields desks, teams
  const handleFetchDesksAndTeamsQuery = useCallback(() => {
    if (!desksAndTeamsData) getDesksAndTeamsQuery();
  }, [desksAndTeamsData, getDesksAndTeamsQuery]);

  // For fields salesStatuses, retentionStatuses
  const handleFetchAcquisitionStatuses = useCallback(() => {
    if (!acquisitionStatusesData) getAcquisitionStatusesQuery();
  }, [acquisitionStatusesData, getAcquisitionStatusesQuery]);

  const operators = useMemo(() => operatorsData?.operators?.content || [], [operatorsData?.operators?.content]);

  const filterOperatorsByBranch = useCallback((uuids: Array<string | null>) => (
    operators.filter((operator) => {
      const partnerBranches = operator.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  ), [operators]);

  const filterOperators = useCallback(({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(teams);
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsList = desksAndTeamsData?.userBranches?.TEAM || [];
      const teamsByDesks = teamsList.filter(team => desks.includes(team.parentBranch?.uuid as string))
        .map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(uuids);
    }

    return operators;
  }, [desksAndTeamsData?.userBranches?.TEAM, filterOperatorsByBranch, operators]);

  /**
   * Handle showing filters new or old implementation
   *
   * @param enabled
   */
  const handleToggleFilterPanel = useCallback((enabled: boolean) => {
    Trackify.click('CLIENTS_GRID_SWITCH_TO_OLD_FILTER_PANEL', { eventValue: enabled.toString() });

    storage.set('isOldClientsGridFilterPanel', enabled);

    const prevFilters = [...new Set([
      ...(state?.selectedFilterSet?.fields || []),
      ...defaultFilters,
      ...Object.keys(state?.filters || []),
    ])];

    navigate('.', {
      replace: true,
      state: {
        ...state,
        filtersFields: enabled ? oldFilters : prevFilters,
      },
    });
  }, [navigate, state, storage]);

  useEffect(() => {
    // Set default filters fields list if no filters fields list was applied before and the current history operation
    // isn't "replace" state to prevent set default filters list if user cleared select with filters list
    if (!state?.filtersFields?.length && navigationType !== 'REPLACE') {
      const storedFilters = storage.get(storageKey) || [];
      const filtersFields = storedFilters.length ? storedFilters : defaultFilters;

      navigate('.', {
        replace: true,
        state: {
          ...state,
          filtersFields,
        },
      });
    }

    // Save to persistent storage if list with filters fields was changed
    if (storageKey && prevFiltersFields !== state?.filtersFields) {
      storage.set(storageKey, state?.filtersFields);
    }
  }, [state?.filtersFields]);

  const offices = desksAndTeamsData?.userBranches?.OFFICE || [];
  const desks = desksAndTeamsData?.userBranches?.DESK || [];
  const teams = desksAndTeamsData?.userBranches?.TEAM || [];
  const partners = partnersData?.partners?.content || [];
  const affiliateReferrals = affiliateReferralsData?.affiliateReferrals?.referrals || [];
  const salesStatuses = sortBy(acquisitionStatusesData?.settings.salesStatuses || [], 'status');
  const retentionStatuses = sortBy(acquisitionStatusesData?.settings.retentionStatuses || [], 'status');

  return {
    allowPartnersListView,
    allowAffiliateReferrals,
    offices,
    desks,
    teams,
    partners,
    affiliateReferrals,
    salesStatuses,
    retentionStatuses,
    role,
    department,
    isOldClientsGridFilterPanel,
    isPartnersLoading,
    isAffiliateReferralsLoading,
    isOperatorsLoading,
    isDesksAndTeamsLoading,
    isAcquisitionStatusesLoading,
    handleFetchPartners,
    handleFetchAffiliateReferrals,
    handleFetchOperators,
    handleFetchDesksAndTeamsQuery,
    handleFetchAcquisitionStatuses,
    filterOperators,
    handleToggleFilterPanel,
  };
};

export default useClientsGridFilter;
