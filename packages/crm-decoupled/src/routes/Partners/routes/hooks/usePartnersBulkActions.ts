import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Config, usePermission, useModal, LevelType, notify } from '@crm/common';
import { State } from 'types';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps } from 'modals/ChangeAccountStatusModal';
import RestrictedCountriesModal, {
  RestrictedCountriesModalProps,
  TypesRestrictedCountriesModal,
} from 'modals/RestrictedCountriesModal';
import { actionStatus } from '../../constants';
import { useBulkChangeAffiliatesStatusMutation } from '../graphql/__generated__/BulkChangeAffiliatesStatus';
import {
  useBulkPartnersAddForbiddenCountriesMutation,
} from '../graphql/__generated__/BulkPartnersAddForbiddenCountriesMutation';
import {
  useBulkPartnersDeleteForbiddenCountriesMutation,
} from '../graphql/__generated__/BulkPartnersDeleteForbiddenCountriesMutation';

type Props = {
  uuids: Array<string>,
  selected: number,
  selectAll: boolean,
  onRefetch: () => void,
};

type FormValue = {
  forbiddenCountries: Array<string>,
}

type Reason = {
  reason: string,
};

type PartnersBulkActions = {
  allowChangeAffiliatesStatuses: boolean,
  allowChangeAffiliatesCountries: boolean,
  updateStatuses: (reasons: Record<string, string>, status: actionStatus) => void,
  handleAddRestrictedCountriesModal: () => void,
  handleDeleteRestrictedCountriesModal: () => void,
};

const usePartnersBulkActions = (props: Props): PartnersBulkActions => {
  const {
    uuids,
    selectAll,
    selected,
    onRefetch,
  } = props;

  const state = useLocation().state as State;

  const searchParams = state?.filters;

  const sorts = state?.sorts;
  const permission = usePermission();
  const allowChangeAffiliatesStatuses = permission.allows(Config.permissions.PARTNERS.BULK_CHANGE_AFFILIATES_STATUSES);
  const allowChangeAffiliatesCountries = permission.allows(
    Config.permissions.PARTNERS.BULK_CHANGE_AFFILIATES_COUNTRIES,
  );

  // ===== Modals ===== //

  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);
  const restrictedCountriesModal = useModal<RestrictedCountriesModalProps>(RestrictedCountriesModal);

  // ===== Requests ===== //
  const [bulkChangeAffiliatesStatusMutation] = useBulkChangeAffiliatesStatusMutation();
  const [bulkPartnersAddForbiddenCountriesMutation] = useBulkPartnersAddForbiddenCountriesMutation();
  const [bulkPartnersDeleteForbiddenCountriesMutation] = useBulkPartnersDeleteForbiddenCountriesMutation();

  // ===== Handlers ===== //
  const submitNewStatuses = useCallback(async ({ reason }: Reason, status: actionStatus) => {
    try {
      await bulkChangeAffiliatesStatusMutation({
        variables: {
          uuids,
          reason,
          status,
          bulkSize: selectAll ? selected : 0,
          searchParams: selectAll && searchParams ? searchParams : {},
          sorts: selectAll && sorts?.length ? sorts : [],
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.CHANGE_ACCOUNT_STATUS_MODAL.NOTIFICATIONS.ERROR'),
      });
    }

    onRefetch();
    changeAccountStatusModal.hide();
  }, [uuids, selected, selectAll, sorts]);

  const updateStatuses = useCallback((reasons: Record<string, string>, status: actionStatus) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: Reason) => submitNewStatuses(values, status),
    });
  }, []);

  const submitAddCountries = useCallback(async ({ forbiddenCountries }: FormValue) => {
    try {
      await bulkPartnersAddForbiddenCountriesMutation({
        variables: {
          args: {
            uuids,
            forbiddenCountries,
            bulkSize: selectAll ? selected : 0,
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.RESTRICTED_COUNTRIES.NOTIFICATIONS.SUCCESS_ADD'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.RESTRICTED_COUNTRIES.NOTIFICATIONS.ERROR_ADD'),
      });
    }

    onRefetch();
    restrictedCountriesModal.hide();
  }, [uuids, selected, selectAll]);

  const submitDeleteCountries = useCallback(async ({ forbiddenCountries }: FormValue) => {
    try {
      await bulkPartnersDeleteForbiddenCountriesMutation({
        variables: {
          args: {
            uuids,
            forbiddenCountries,
            bulkSize: selectAll ? selected : 0,
          },
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.RESTRICTED_COUNTRIES.NOTIFICATIONS.SUCCESS_DELETE'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.RESTRICTED_COUNTRIES.NOTIFICATIONS.ERROR_DELETE'),
      });
    }

    onRefetch();
    restrictedCountriesModal.hide();
  }, [uuids, selected, selectAll]);

  const handleAddRestrictedCountriesModal = useCallback(() => restrictedCountriesModal.show({
    type: TypesRestrictedCountriesModal.ADD,
    onSuccess: submitAddCountries,
  }), []);

  const handleDeleteRestrictedCountriesModal = useCallback(() => restrictedCountriesModal.show({
    type: TypesRestrictedCountriesModal.DELETE,
    onSuccess: submitDeleteCountries,
  }), []);

  return {
    allowChangeAffiliatesStatuses,
    allowChangeAffiliatesCountries,
    updateStatuses,
    handleAddRestrictedCountriesModal,
    handleDeleteRestrictedCountriesModal,
  };
};

export default usePartnersBulkActions;
