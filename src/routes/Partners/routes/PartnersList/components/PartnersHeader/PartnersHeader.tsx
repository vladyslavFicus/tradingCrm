import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import CreatePartnerModal from 'modals/CreatePartnerModal';
import { Button } from 'components/UI';
import PartnersBulkActions from '../PartnersBulkActions/PartnersBulkActions';
import './PartnersHeader.scss';

type Props = {
  modals: {
    createPartnerModal: Modal,
  },
  onRefetch: () => void,
  partnersUuids: Array<string>,
  selected: number,
  totalElements?: number,
}

const PartnersHeader = (props: Props) => {
  const {
    totalElements,
    modals: { createPartnerModal },
    selected,
    onRefetch,
    partnersUuids,
  } = props;

  const permission = usePermission();

  const handleOpenCreatePartnerModal = () => {
    createPartnerModal.show();
  };

  return (
    <div className="PartnersHeader">
      <div className="PartnersHeader__left">
        <Choose>
          <When condition={!!totalElements}>
            <div className="PartnersList__title">
              <strong>{totalElements} </strong>
              {I18n.t('COMMON.PARTNERS_FOUND')}
            </div>
          </When>

          <Otherwise>
            <div className="PartnersHeader__title">{I18n.t('PARTNERS.HEADING')}</div>
          </Otherwise>
        </Choose>

        <div className="PartnersHeader__selected">
          <b>{selected}</b> {I18n.t('COMMON.PARTNERS_SELECTED')}
        </div>
      </div>

      <div className="PartnersHeader__right">
        <If condition={permission.allows(permissions.PARTNERS.BULK_CHANGE_AFFILIATES_STATUSES)}>
          <If condition={!!selected}>
            <PartnersBulkActions onRefetch={onRefetch} partnersUuids={partnersUuids} />
          </If>
        </If>

        <If condition={permission.allows(permissions.PARTNERS.CREATE)}>
          <Button
            onClick={handleOpenCreatePartnerModal}
            tertiary
          >
            {I18n.t('PARTNERS.CREATE_PARTNER_BUTTON')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    createPartnerModal: CreatePartnerModal,
  }),
)(PartnersHeader);
