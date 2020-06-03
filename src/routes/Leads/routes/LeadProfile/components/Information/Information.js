import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import PinnedNotesList from 'components/PinnedNotesList';
import AcquisitionStatus from './AcquisitionStatus';
import Personal from './Personal';

class Information extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    data: {},
  };

  render() {
    const { data, loading } = this.props;

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
              <PinnedNotesList targetUUID={data.uuid} targetType={targetTypes.LEAD} />
            </div>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default Information;
