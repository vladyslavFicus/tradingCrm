import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import PromoteLeadModal from 'modals/PromoteLeadModal';
import NoteAction from 'components/Note/NoteAction';
import CreateLeadCallbackModal from 'modals/CreateLeadCallbackModal';
import './LeadHeader.scss';

class LeadHeader extends PureComponent {
  static propTypes = {
    lead: PropTypes.lead.isRequired,
    modals: PropTypes.shape({
      promoteLeadModal: PropTypes.modalType,
      createLeadCallbackModal: PropTypes.modalType,
    }).isRequired,
  }

  handleOpenAddCallbackModal = () => {
    const { modals: { createLeadCallbackModal } } = this.props;

    createLeadCallbackModal.show();
  };

  handlePromoteLead = async () => {
    const {
      lead: { uuid },
      modals: { promoteLeadModal },
    } = this.props;

    promoteLeadModal.show({ uuid });
  };

  render() {
    const { lead } = this.props;
    const { uuid, name, status, country, surname } = lead || {};

    return (
      <div className="LeadHeader">
        <div className="LeadHeader__topic">
          <div className="LeadHeader__title">{`${name} ${surname}`}</div>
          <div className="LeadHeader__uuid">
            <If condition={uuid}>
              <Uuid uuid={uuid} uuidPrefix="LE" />
            </If>

            <If condition={country}>
              <span>- {country}</span>
            </If>
          </div>
        </div>

        <div className="LeadHeader__actions">

          <PermissionContent permissions={permissions.LEAD_PROFILE.CREATE_CALLBACK}>
            <Button
              data-testid="addCallbackButton"
              small
              tertiary
              className="LeadHeader__action"
              onClick={this.handleOpenAddCallbackModal}
            >
              {I18n.t('LEAD_PROFILE.ADD_CALLBACK')}
            </Button>
          </PermissionContent>

          <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
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
          </PermissionContent>

          <If condition={status && status !== 'CONVERTED'}>
            <PermissionContent permissions={permissions.LEADS.PROMOTE_LEAD}>
              <Button
                small
                tertiary
                className="LeadHeader__action"
                onClick={this.handlePromoteLead}
              >
                {I18n.t('LEAD_PROFILE.HEADER.PROMOTE_TO_CLIENT')}
              </Button>
            </PermissionContent>
          </If>
        </div>
      </div>
    );
  }
}

export default withModals({
  promoteLeadModal: PromoteLeadModal,
  createLeadCallbackModal: CreateLeadCallbackModal,
})(LeadHeader);
