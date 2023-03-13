import React from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { withModals } from 'hoc';
import { Modal, State, TableSelection } from 'types';
import { LeadUploadResponse__FailedLeads as FailedLeads } from '__generated__/types';
import permissions from 'config/permissions';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { userTypes, deskTypes } from 'constants/hierarchyTypes';
import { Button } from 'components/Buttons';
import Placeholder from 'components/Placeholder';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import LeadsUploadResultModal from 'modals/LeadsUploadResultModal';
import LeadsUploadModal, { LeadsUploadModalProps } from 'modals/LeadsUploadModal';
import { LeadsListQuery, LeadsListQueryVariables } from '../../graphql/__generated__/LeadsListQuery';
import './LeadsHeader.scss';

type Modals = {
  representativeUpdateModal: Modal,
  leadsUploadModal: Modal,
  leadsUploadResultModal: Modal,
};

type Props = {
  select: TableSelection | null,
  leadsQuery: QueryResult<LeadsListQuery>,
  modals: Modals,
};

const LeadsHeader = (props: Props) => {
  const {
    leadsQuery: {
      data,
      refetch,
      loading,
    },
    select,
    modals: {
      representativeUpdateModal,
      leadsUploadResultModal,
    },
  } = props;
  const leads = data?.leads?.content || [];

  const { state } = useLocation<State<LeadsListQueryVariables['args']>>();
  const permission = usePermission();

  const leadsUploadModal = useModal<LeadsUploadModalProps>(LeadsUploadModal);

  const totalElements = data?.leads?.totalElements || 0;
  const searchLimit = state?.filters?.searchLimit;

  const leadsListCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  const handleOpenRepresentativeModal = () => {
    representativeUpdateModal.show({
      uuids: select?.touched.map(index => leads[index]?.uuid),
      userType: userTypes.LEAD_CUSTOMER,
      type: deskTypes.SALES,
      configs: {
        allRowsSelected: select?.all,
        selectedRowsLength: select?.selected,
        multiAssign: true,
        ...state && {
          searchParams: state?.filters,
          sorts: state?.sorts,
        },
      },
      onSuccess: () => {
        refetch();
        select?.reset();
      },
      header: (
        <>
          <div>{I18n.t('LEADS.LEADS_BULK_MODAL.HEADER')}</div>

          <div className="LeadsHeader__modal-subtitle">
            {select?.selected} {I18n.t('LEADS.LEADS_SELECTED')}
          </div>
        </>
      ),
    });
  };

  const handleOpenLeadsUploadModal = () => {
    leadsUploadModal.show({
      onSuccess: (failedLeads: Array<FailedLeads>,
        failedLeadsCount?: number | null, createdLeadsCount?: number | null) => {
        refetch();

        if (failedLeads.length) {
          leadsUploadResultModal.show({ failedLeads, failedLeadsCount, createdLeadsCount });
        }
      },
    });
  };

  const allowChangeAcquisition = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION);
  const allowUploadLeads = permission.allows(permissions.LEADS.UPLOAD_LEADS_FROM_FILE);

  return (
    <div className="LeadsHeader">
      <div className="LeadsHeader__left">
        <Placeholder
          ready={!loading}
          rows={[{ width: 220, height: 20 }, { width: 220, height: 12 }]}
        >
          <Choose>
            <When condition={!!leadsListCount}>
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
        <If condition={allowChangeAcquisition && totalElements !== 0 && selectedCount !== 0}>
          <div className="LeadsHeader__bulk">
            <div className="LeadsHeader__bulk-title">
              {I18n.t('LEADS.BULK_ACTIONS')}
            </div>

            <Button
              tertiary
              onClick={handleOpenRepresentativeModal}
            >
              {I18n.t('COMMON.SALES')}
            </Button>
          </div>
        </If>

        <If condition={allowUploadLeads && selectedCount === 0}>
          <Button
            tertiary
            onClick={handleOpenLeadsUploadModal}
          >
            {I18n.t('COMMON.UPLOAD')}
          </Button>
        </If>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    leadsUploadResultModal: LeadsUploadResultModal,
  }),
)(LeadsHeader);
