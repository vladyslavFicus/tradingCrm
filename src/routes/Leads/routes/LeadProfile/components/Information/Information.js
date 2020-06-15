import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import AcquisitionStatus from './AcquisitionStatus';
import Personal from './Personal';
import Notes from './Notes';

class Information extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    pinnedNotes: PropTypes.object,
    onEditNoteClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: {},
    pinnedNotes: {},
  };

  render() {
    const { pinnedNotes, onEditNoteClick, data, loading } = this.props;

    return (
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
  }
}

export default Information;
