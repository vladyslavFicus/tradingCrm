import { useCallback } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Config, notify, Types, usePermission, useStorageState, Auth } from '@crm/common';
import { Partner } from '__generated__/types';
import { useUpdatePartnerMutation } from '../graphql/__generated__/UpdatePartnerMutation';

type PartnerPermission = {
  showNotes?: boolean,
  showSalesStatus?: boolean,
  showFTDAmount?: boolean,
  showKycStatus?: boolean,
  showAutologinUrl?: boolean,
  cumulativeDeposit?: boolean,
  minFtdDeposit?: number,
  allowedIpAddresses: Array<string>,
  restrictedSources: Array<string>,
  restrictedReferrals: Array<string>,
  forbiddenCountries?: Array<string>,
};

export type FormValues = {
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  phone: string,
  externalAffiliateId: string,
  public: boolean,
  cdeAffiliate: boolean,
  permission: PartnerPermission,
};

type Props = {
  partner: Partner,
  onRefetch: () => void,
};

type PartnerPersonalInfoForm = {
  deniesUpdate: boolean,
  brand: Record<string, any>,
  department: string,
  role: string,
  minFtdDeposit?: number | null,
  cumulativeDeposit?: boolean | null,
  handleSubmit: (values: FormValues) => void,
};

const usePartnerPersonalInfoForm = (props: Props): PartnerPersonalInfoForm => {
  const {
    partner: {
      uuid,
      permission: partnerPermission,
    },
    onRefetch,
  } = props;

  const { cumulativeDeposit, minFtdDeposit } = partnerPermission || {};

  const brand = Config.getBrand();

  // ===== Storage ===== //
  const [{ role, department }] = useStorageState<Auth>('auth');

  // ===== Permissions ===== //
  const permission = usePermission();
  const deniesUpdate = permission.denies(Config.permissions.PARTNERS.UPDATE_PROFILE);

  // ===== Requests ===== //
  const [updatePartnerMutation] = useUpdatePartnerMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      await updatePartnerMutation({
        variables: {
          uuid,
          ...values,
        },
      });

      onRefetch();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      const error = get(e, 'graphQLErrors.0.extensions.response.body.error');

      if (error === 'error.affiliate.externalId.already.exists') {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
        });

        return;
      }

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  return {
    deniesUpdate,
    brand,
    department,
    role,
    minFtdDeposit,
    cumulativeDeposit,
    handleSubmit,
  };
};

export default usePartnerPersonalInfoForm;
