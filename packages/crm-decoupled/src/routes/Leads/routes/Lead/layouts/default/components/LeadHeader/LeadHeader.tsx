import React from 'react';
import I18n from 'i18n-js';
import { Constants } from '@crm/common';
import { Button } from 'components';
import { Lead } from '__generated__/types';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import useLeadHeader from 'routes/Leads/routes/Lead/hooks/useLeadHeader';
import './LeadHeader.scss';

type Props = {
  lead: Lead,
  onRefetch: () => void,
};

const LeadHeader = (_props: Props) => {
  const { lead } = _props;
  const { uuid, name, status, country, surname } = lead;

  const {
    allowCreateCallback,
    allowAddNote,
    allowPromoteLead,
    handleOpenAddCallbackModal,
    handleOpenPromoteLeadModal,
  } = useLeadHeader(_props);

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
            data-testid="LeadHeader-addCallbackButton"
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
            targetType={Constants.targetTypes.LEAD}
            placement="bottom-end"
          >
            <Button
              small
              tertiary
              className="LeadHeader__action"
              data-testid="LeadHeader-addNoteButton"
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
            data-testid="LeadHeader-promoteToClientButton"
          >
            {I18n.t('LEAD_PROFILE.HEADER.PROMOTE_TO_CLIENT')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default React.memo(LeadHeader);
