import React from 'react';
import { useLocation } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import permissions from 'config/permissions';
import { LevelType, notify } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import RestrictedCountriesModal, {
  RestrictedCountriesModalProps, TypesRestrictedCountriesModal,
} from 'modals/RestrictedCountriesModal';
import { Button } from 'components/Buttons';
import { actionStatus, statusActions } from '../../../../constants';
import { useBulkChangeAffiliatesStatusMutation } from './graphql/__generated__/BulkChangeAffiliatesStatus';
import {
  useBulkPartnersAddForbiddenCountriesMutation,
} from './graphql/__generated__/BulkPartnersAddForbiddenCountriesMutation';
import {
  useBulkPartnersDeleteForbiddenCountriesMutation,
} from './graphql/__generated__/BulkPartnersDeleteForbiddenCountriesMutation';
import './PartnersBulkActions.scss';

type Props = {
  uuids: Array<string>,
  selected: number,
  selectAll: boolean,
  modals: {
    changeAccountStatusModal: Modal,
  },
  onRefetch: () => void,
};

type FormValue = {
  forbiddenCountries: Array<string>,
}

type Reason = {
  reason: string,
};

const PartnersBulkActions = (props: Props) => {
  const {
    uuids,
    selectAll,
    selected,
    modals: { changeAccountStatusModal },
    onRefetch,
  } = props;

  const { state } = useLocation<State>();

  const searchParams = state?.filters;
  const sorts = state?.sorts;

  const permission = usePermission();

  // ===== Modals ===== //
  const restrictedCountriesModal = useModal<RestrictedCountriesModalProps>(RestrictedCountriesModal);

  // ===== Requests ===== //
  const [bulkChangeAffiliatesStatusMutation] = useBulkChangeAffiliatesStatusMutation();
  const [bulkPartnersAddForbiddenCountriesMutation] = useBulkPartnersAddForbiddenCountriesMutation();
  const [bulkPartnersDeleteForbiddenCountriesMutation] = useBulkPartnersDeleteForbiddenCountriesMutation();

  // ===== Handlers ===== //
  const submitNewStatuses = async ({ reason }: Reason, status: actionStatus) => {
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
  };

  const updateStatuses = (reasons: Record<string, string>, status: actionStatus) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: Reason) => submitNewStatuses(values, status),
    });
  };

  const submitAddCountries = async ({ forbiddenCountries }: FormValue) => {
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
  };

  const submitDeleteCountries = async ({ forbiddenCountries }: FormValue) => {
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
  };

  return (
    <div className="PartnersBulkActions">
      <div className="PartnersBulkActions__title">
        {I18n.t('PARTNERS.BULK_ACTIONS')}
      </div>

      <If condition={permission.allows(permissions.PARTNERS.BULK_CHANGE_AFFILIATES_STATUSES)}>
        {statusActions
          .map(({ label, reasons, action }) => (
            <Button
              key={action}
              tertiary
              className={classNames('PartnersBulkActions__button', {
                'PartnersBulkActions__button--success': action === actionStatus.ACTIVE,
                'PartnersBulkActions__button--danger': action === actionStatus.CLOSED,
              })}
              onClick={() => updateStatuses(reasons, action)}
            >
              {I18n.t(label)}
            </Button>
          ))
        }
      </If>

      <If condition={permission.allows(permissions.PARTNERS.BULK_CHANGE_AFFILIATES_COUNTRIES)}>
        <Button
          className="PartnersBulkActions__button PartnersBulkActions__button--success"
          tertiary
          onClick={() => restrictedCountriesModal.show({
            type: TypesRestrictedCountriesModal.ADD, onSuccess: submitAddCountries,
          })}
        >
          {I18n.t('PARTNERS.ALLOW_COUNTRIES')}
        </Button>

        <Button
          tertiary
          className="PartnersBulkActions__button PartnersBulkActions__button--danger"
          onClick={() => restrictedCountriesModal.show({
            type: TypesRestrictedCountriesModal.DELETE, onSuccess: submitDeleteCountries,
          })}
        >
          {I18n.t('PARTNERS.RESTRICT_COUNTRIES')}
        </Button>
      </If>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({ changeAccountStatusModal: ChangeAccountStatusModal }),
)(PartnersBulkActions);
