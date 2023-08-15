import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { compact, intersection, omit } from 'lodash';
import { Config, Utils, Types } from '@crm/common';
import { usePaymentSystemsProviderQuery } from '../graphql/__generated__/PaymentSystemsProviderQuery';
import { useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';
import { useDesksAndTeamsQuery } from '../graphql/__generated__/DesksAndTeamsQuery';
import { usePaymentMethodsQuery } from '../graphql/__generated__/PaymentMethodsQuery';
import { FormValues } from '../types';

type Props = {
  paymentsLoading: boolean,
  clientView?: boolean,
};

const usePaymentsListFilters = (props: Props) => {
  const { paymentsLoading, clientView } = props;

  const state = useLocation().state as Types.State<FormValues>;

  const navigate = useNavigate();

  const initialValues = state?.filters || { accountType: 'LIVE' };

  // ===== Requests ===== //
  const { data: pspData } = usePaymentSystemsProviderQuery({
    variables: {
      args: {
        withFavouriteStatus: true,
        page: {
          from: 0,
          size: 1000,
        },
      },
    },
  });

  const paymentSystemsProvider = pspData?.settings?.paymentSystemsProvider?.content || [];

  const operatorsQuery = useOperatorsQuery({
    variables: {
      page: {
        sorts: [
          { column: 'operatorStatus', direction: 'ASC' },
          { column: 'firstName', direction: 'ASC' },
          { column: 'lastName', direction: 'ASC' },
        ],
      },
    },
    fetchPolicy: 'cache-and-network',
    context: { batch: false },
  });

  const { data: operatorsData, loading: operatorsLoading } = operatorsQuery;
  const operators = operatorsData?.operators?.content || [];

  const desksAndTeamsQuery = useDesksAndTeamsQuery();
  const { loading: desksAndTeamsLoading } = desksAndTeamsQuery;

  const desksList = desksAndTeamsQuery.data?.userBranches?.DESK || [];
  const teamsList = desksAndTeamsQuery.data?.userBranches?.TEAM || [];

  const paymentMethodsQuery = usePaymentMethodsQuery();
  const { data: paymentMethodsData, loading: paymentMethodsLoading } = paymentMethodsQuery;

  const paymentMethods = paymentMethodsData?.paymentMethods || [];

  const currencies = Config.getBrand().currencies.supported;

  const platformTypes = Utils.getAvailablePlatformTypes();

  const checkIsDirty = useCallback((values: FormValues) => (
    !(Object.keys(values).length === 1 && values.accountType === 'LIVE')
  ), []);

  const omitFilterValues = useCallback((values: FormValues) => {
    if (clientView) {
      return omit(values, ['countries', 'affiliateUuids']);
    }

    return values;
  }, [clientView]);

  const filterOperatorsByBranch = useCallback((uuids: Array<string>) => (
    operators.filter((operator) => {
      const partnerBranches = operator?.hierarchy?.parentBranches || [];
      const branches = partnerBranches.map(({ uuid }) => uuid);

      return intersection(branches, uuids).length;
    })
  ), [operators]);

  const filterOperators = useCallback(({ desks, teams }: FormValues) => {
    if (teams && teams.length) {
      return filterOperatorsByBranch(compact(teams));
    }

    if (desks && desks.length) {
      // If desk chosen -> find all teams of these desks to filter operators
      const teamsByDesks = teamsList
        .filter(team => team.parentBranch && desks.includes(team.parentBranch.uuid)).map(({ uuid }) => uuid);
      const uuids = [...desks, ...teamsByDesks];

      return filterOperatorsByBranch(compact(uuids));
    }

    return operators;
  }, [teamsList, filterOperatorsByBranch]);

  // ===== Handlers ===== //
  const handleSubmit = useCallback((values: FormValues) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: Utils.decodeNullValues(omitFilterValues(values)),
      },
    });
  }, [state]);

  const handleReset = useCallback(() => {
    if (paymentsLoading) return;

    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
        selectedFilterSet: null,
      },
    });
  }, [paymentsLoading, state]);

  return {
    initialValues,
    paymentSystemsProvider,
    operatorsLoading,
    desksAndTeamsLoading,
    teamsList,
    desksList,
    paymentMethodsLoading,
    paymentMethods,
    currencies,
    platformTypes,
    checkIsDirty,
    filterOperators,
    handleSubmit,
    handleReset,
  };
};

export default usePaymentsListFilters;
