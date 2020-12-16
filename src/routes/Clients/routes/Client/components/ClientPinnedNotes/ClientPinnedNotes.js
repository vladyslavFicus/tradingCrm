import React, { PureComponent } from 'react';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import PermissionContent from 'components/PermissionContent';
import PinnedNotes from 'components/PinnedNotes';
import './ClientPinnedNotes.scss';

class ClientPinnedNotes extends PureComponent {
  static propTypes = {
    clientUuid: PropTypes.string.isRequired,
  };

  render() {
    const { clientUuid } = this.props;

    return (
      <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
        <div className="ClientPinnedNotes">
          <PinnedNotes targetUUID={clientUuid} targetType={targetTypes.PLAYER} />
        </div>
      </PermissionContent>
    );
  }
}

export default ClientPinnedNotes;
