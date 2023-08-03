import { PaymentDeposit, PlatformType__Enum as PlatformType } from '__generated__/types';

export type FormValues = {
  autoLogout: boolean,
  depositButtons: {
    deposit1: number,
    deposit2: number,
    deposit3: number,
    deposit4: number | null,
    deposit5: number | null,
  },
  restrictedCountries: Array<string>,
  paymentAmounts: Array<number>,
  profileDepositEnable: boolean,
  notificationCleanUpDays: number,
  hideChangePasswordCp: boolean,
  referralEnable: boolean,
  affiliateClientAutoLogoutMinutes: number,
  platformMaxAccounts: Record<PlatformType, number>,
  paymentDeposits: Array<PaymentDeposit>,
  accountAutoCreations: Record<string, boolean>,
};
