import React, { PureComponent } from 'react';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import PermissionContent from 'components/PermissionContent';
import PinnedNotes from 'components/Note/PinnedNotes';
import './LeadPinnedNotes.scss';

class LeadPinnedNotes extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
  };

  render() {
    const { uuid } = this.props;

    return (
      <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
        <div className="LeadPinnedNotes">
          <PinnedNotes targetUUID={uuid} targetType={targetTypes.LEAD} />
        </div>
      </PermissionContent>
    );
  }
}

export default LeadPinnedNotes;
