import React from 'react';
import I18n from 'i18n-js';
import { Lead } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { targetTypes } from 'constants/note';
import Uuid from 'components/Uuid';
import { Button } from 'components/Buttons';
import CreateLeadCallbackModal, { CreateLeadCallbackModalProps } from 'modals/CreateLeadCallbackModal';
import PromoteLeadModal, { PromoteLeadModalProps } from 'modals/PromoteLeadModal';
import NoteAction from 'components/Note/NoteAction';
import './LeadHeader.scss';

type Props = {
  lead: Lead,
};

const LeadHeader = (props: Props) => {
  const { lead } = props;
  const { uuid, name, status, country, surname } = lead;

  // ===== Modals ===== //
  const createLeadCallbackModal = useModal<CreateLeadCallbackModalProps>(CreateLeadCallbackModal);
  const promoteLeadModal = useModal<PromoteLeadModalProps>(PromoteLeadModal);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCreateCallback = permission.allows(permissions.LEAD_PROFILE.CREATE_CALLBACK);
  const allowAddNote = permission.allows(permissions.NOTES.ADD_NOTE);
  const allowPromoteLead = permission.allows(permissions.LEADS.PROMOTE_LEAD);

  // ===== Handlers ===== //
  const handleOpenAddCallbackModal = () => {
    createLeadCallbackModal.show({
      userId: uuid,
    });
  };

  const handleOpenPromoteLeadModal = () => {
    promoteLeadModal.show({ lead });
  };

  return (
    <div className="LeadHeader">
      <div className="LeadHeader__topic">
        <div className="LeadHeader__title">
          {`${name} ${surname}`}
        </div>

        <div className="LeadHeader__uuid">
          <Uuid uuid={uuid} uuidPrefix="LE" />

          <If condition={!!country}>
            <span>- {country}</span>
          </If>
        </div>
      </div>

      <div className="LeadHeader__actions">
        <If condition={allowCreateCallback}>
          <Button
            data-testid="addCallbackButton"
            small
            tertiary
            className="LeadHeader__action"
            onClick={handleOpenAddCallbackModal}
          >
            {I18n.t('LEAD_PROFILE.ADD_CALLBACK')}
          </Button>
        </If>

        <If condition={allowAddNote}>
          <NoteAction
            playerUUID={uuid}
            targetUUID={uuid}
            targetType={targetTypes.LEAD}
            placement="bottom-end"
          >
            <Button
              small
              tertiary
              className="LeadHeader__action"
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.HEADER.ADD_NOTE')}
            </Button>
          </NoteAction>
        </If>

        <If condition={allowPromoteLead && !!status && status !== 'CONVERTED'}>
          <Button
            small
            tertiary
            className="LeadHeader__action"
            onClick={handleOpenPromoteLeadModal}
          >
            {I18n.t('LEAD_PROFILE.HEADER.PROMOTE_TO_CLIENT')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(LeadHeader);
