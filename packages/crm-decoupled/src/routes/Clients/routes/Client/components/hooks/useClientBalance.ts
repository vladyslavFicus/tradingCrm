import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { getBrand } from 'config';
import { Profile } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { usePaymentGeneralStatisticQuery } from '../graphql/__generated__/PaymentGeneralStatisticQuery';

type Props = {
  profile: Profile,
};

const useClientBalance = (props: Props) => {
  const { profile } = props;

  const {
    uuid: profileId,
    profileView,
    registrationDetails: {
      registrationDate,
    },
    tradingAccounts,
  } = profile;

  const amount = profileView?.balance?.amount || 0;
  const credit = profileView?.balance?.credit || 0;

  const baseCurrency = getBrand().currencies.base;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowBalance = permission.allows(permissions.USER_PROFILE.BALANCE);

  // ===== Requests ===== //
  const { data, refetch: refetchPaymentGeneralStatistic } = usePaymentGeneralStatisticQuery({
    variables: {
      profileId,
      dateFrom: moment(registrationDate || '').utc().format(),
      dateTo: moment().utc().add(2, 'day').startOf('day')
        .format(),
    },
  });

  const {
    totalAmount: depositAmount,
    totalCount: depositCount,
    first: firstDepositDate,
    last: lastDepositDate,
  } = data?.paymentsGeneralStatistic?.deposits || {};

  const {
    totalAmount: withdrawAmount,
    totalCount: withdrawCount,
    first: firstWithdrawDate,
    last: lastWithdrawDate,
  } = data?.paymentsGeneralStatistic?.withdrawals || {};

  const toggleDropdown = useCallback(() => setIsDropDownOpen(prevIsDropDownOpen => !prevIsDropDownOpen), []);

  const getFormattedDate = useCallback(
    (value?: string | null) => (value ? moment(value).format('DD.MM.YYYY') : ''),
    [],
  );

  // ===== Handlers ===== //
  const handleDateChange = useCallback(async (value: string) => {
    setSelectedDate(value);

    const refetchData = {
      // If we have 'All the time' selected, just provide registration date for request
      dateFrom: moment.utc(value || registrationDate || '').format(),
      dateTo: moment().add(2, 'day').startOf('day').utc()
        .format(),
    };

    await refetchPaymentGeneralStatistic(refetchData);
  }, [registrationDate]);


  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetchPaymentGeneralStatistic);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetchPaymentGeneralStatistic);
    };
  }, []);

  return {
    tradingAccounts,
    amount,
    credit,
    baseCurrency,
    selectedDate,
    allowBalance,
    isDropDownOpen,
    depositAmount,
    depositCount,
    withdrawAmount,
    withdrawCount,
    firstDepositDate,
    firstWithdrawDate,
    lastDepositDate,
    lastWithdrawDate,
    getFormattedDate,
    handleDateChange,
    toggleDropdown,
  };
};

export default useClientBalance;
