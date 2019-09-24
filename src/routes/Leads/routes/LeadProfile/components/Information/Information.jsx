import React from 'react';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Personal from './Personal';
import PropTypes from '../../../../../../constants/propTypes';
import AcquisitionStatus from './AcquisitionStatus';
import Notes from './Notes';

const Information = ({ pinnedNotes, onEditNoteClick, data, loading }) => (
  <div className="account-details">
    <div className="row">
      <div className="col-md-4">
        <Personal
          data={data}
          loading={loading}
        />
      </div>
      <div className="col-md-3">
        <AcquisitionStatus
          data={data}
          loading={loading}
        />
      </div>
      <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
        <div className="col">
          <Notes
            notes={pinnedNotes}
            onEditNoteClick={onEditNoteClick}
          />
        </div>
      </PermissionContent>
    </div>
  </div>
);

Information.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  pinnedNotes: PropTypes.object,
  onEditNoteClick: PropTypes.func.isRequired,
};

Information.defaultProps = {
  data: {},
  pinnedNotes: {},
};

export default Information;
