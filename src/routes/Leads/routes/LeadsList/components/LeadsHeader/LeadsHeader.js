import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withNotifications, withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { userTypes, deskTypes } from 'constants/hierarchyTypes';
import { Button } from 'components/UI';
import Placeholder from 'components/Placeholder';
import PermissionContent from 'components/PermissionContent';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import LeadsUploadResultModal from 'modals/LeadsUploadResultModal';
import LeadsUploadModal from '../LeadsUploadModal';
import './LeadsHeader.scss';

class LeadsHeader extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    select: PropTypes.TableSelection,
    leadsQuery: PropTypes.query({
      leads: PropTypes.pageable(PropTypes.lead),
    }).isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
      leadsUploadModal: PropTypes.modalType,
      leadsUploadResultModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps = {
    select: null,
  };

  handleOpenRepresentativeModal = () => {
    const {
      leadsQuery,
      select,
      location: { state },
      modals: { representativeUpdateModal },
    } = this.props;

    const leads = leadsQuery.data?.leads?.content || [];

    representativeUpdateModal.show({
      uuids: select.touched.map(index => leads[index].uuid),
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      configs: {
        allRowsSelected: select.all,
        selectedRowsLength: select.selected,
        multiAssign: true,
        ...state && {
          searchParams: state.filters,
          sorts: state.sorts,
        },
      },
      onSuccess: () => {
        leadsQuery.refetch();
        select.reset();
      },
      header: (
        <>
          <div>{I18n.t('LEADS.LEADS_BULK_MODAL.HEADER')}</div>
          <div className="LeadsHeader__modal-subtitle">
            {select.selected} {I18n.t('LEADS.LEADS_SELECTED')}
          </div>
        </>
      ),
    });
  };

  handleOpenLeadsUploadModal = () => {
    const {
      leadsQuery,
      modals: {
        leadsUploadModal,
        leadsUploadResultModal,
      },
    } = this.props;

    leadsUploadModal.show({
      onSuccess: (failedLeads, failedLeadsCount, createdLeadsCount) => {
        leadsQuery.refetch();

        if (failedLeads.length) {
          leadsUploadResultModal.show({ failedLeads, failedLeadsCount, createdLeadsCount });
        }
      },
    });
  };

  render() {
    const {
      leadsQuery,
      location,
      select,
    } = this.props;

    const totalElements = leadsQuery.data?.leads?.totalElements;
    const searchLimit = location.state?.filters?.searchLimit;

    const leadsListCount = (searchLimit && searchLimit < totalElements)
      ? searchLimit
      : totalElements;

    const selectedCount = select?.selected || 0;

    return (
      <div className="LeadsHeader">
        <div className="LeadsHeader__left">
          <Placeholder
            ready={!leadsQuery.loading}
            rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
          >
            <Choose>
              <When condition={leadsListCount}>
                <div>
                  <div className="LeadsHeader__title">
                    <b>{leadsListCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                  </div>

                  <div className="LeadsHeader__selected">
                    <b>{selectedCount}</b> {I18n.t('LEADS.LEADS_SELECTED')}
                  </div>
                </div>
              </When>
              <Otherwise>
                <div className="LeadsHeader__title">
                  {I18n.t('LEADS.LEADS')}
                </div>
              </Otherwise>
            </Choose>
          </Placeholder>
        </div>

        <div className="LeadsHeader__right">
          <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION}>
            <If condition={totalElements !== 0 && selectedCount !== 0}>
              <div className="LeadsHeader__bulk">
                <div className="LeadsHeader__bulk-title">
                  {I18n.t('LEADS.BULK_ACTIONS')}
                </div>

                <Button
                  tertiary
                  onClick={this.handleOpenRepresentativeModal}
                >
                  {I18n.t('COMMON.SALES')}
                </Button>
              </div>
            </If>
          </PermissionContent>
          <PermissionContent permissions={permissions.LEADS.UPLOAD_LEADS_FROM_FILE}>
            <If condition={selectedCount === 0}>
              <Button
                tertiary
                onClick={this.handleOpenLeadsUploadModal}
              >
                {I18n.t('COMMON.UPLOAD')}
              </Button>
            </If>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    leadsUploadModal: LeadsUploadModal,
    leadsUploadResultModal: LeadsUploadResultModal,
  }),
)(LeadsHeader);
