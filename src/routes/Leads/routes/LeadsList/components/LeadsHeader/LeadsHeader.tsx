import React, { useState } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { withModals } from 'hoc';
import { Modal, State, TableSelection } from 'types';
import { getBrand } from 'config';
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
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { LeadsListQuery, LeadsListQueryVariables } from '../../graphql/__generated__/LeadsListQuery';
import {
  useLeadsTotalCountQueryLazyQuery,
} from './graphql/__generated__/LeadsTotalCountQuery';
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

const MAX_QUERY_LEADS = 10000;

const LeadsHeader = (props: Props) => {
  const {
    leadsQuery: {
      data,
      refetch,
      loading,
      variables,
    },
    select,
    modals: {
      representativeUpdateModal,
      leadsUploadResultModal,
    },
  } = props;

  // ===== Requests ===== //
  const [leadsTotalCountQuery] = useLeadsTotalCountQueryLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const leads = data?.leads?.content || [];

  const [loadingTotalCount, setLoadingTotalCount] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const { state } = useLocation<State<LeadsListQueryVariables['args']>>();
  const permission = usePermission();

  const leadsUploadModal = useModal<LeadsUploadModalProps>(LeadsUploadModal);

  const totalElements = data?.leads?.totalElements || 0;
  const searchLimit = state?.filters?.searchLimit;

  const listCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  const handleGetLeadsCount = async () => {
    setLoadingTotalCount(true);

    try {
      const newVariables = { args: { ...variables?.args, brandId: getBrand().id } };

      const { data: totalCountData } = await leadsTotalCountQuery({
        variables: newVariables as LeadsListQueryVariables,
      });

      if (totalCountData?.leadsTotalCount) {
        setTotalCount(totalCountData.leadsTotalCount);
      }
    } catch (e) {
      // Do nothing...
    }

    setLoadingTotalCount(false);
  };

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
            <When condition={!!listCount}>
              <div>
                <div className="LeadsHeader__title">
                  <Choose>
                    <When condition={listCount === MAX_QUERY_LEADS && !totalCount}>
                      <>
                        <Placeholder
                          ready={!loadingTotalCount}
                          rows={[{ width: 75, height: 20 }]}
                        >
                          <span
                            className="LeadsHeader__active-text"
                            onClick={handleGetLeadsCount}
                            id="leadsTotalCount"
                          >
                            {`${listCount} +`}
                          </span>
                        </Placeholder>

                        <If condition={!loadingTotalCount}>
                          <UncontrolledTooltip
                            placement="bottom-start"
                            target="leadsTotalCount"
                            delay={{ show: 350, hide: 250 }}
                            fade={false}
                          >
                            {I18n.t('CLIENTS.TOTAL_COUNT_TOOLTIP')}
                          </UncontrolledTooltip>
                        </If>

                        &nbsp;{I18n.t('LEADS.LEADS_FOUND')}
                      </>
                    </When>

                    <When condition={totalCount === MAX_QUERY_LEADS && !!totalCount}>
                      <b>{totalCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                    </When>

                    <Otherwise>
                      <b>{listCount} </b> {I18n.t('LEADS.LEADS_FOUND')}
                    </Otherwise>
                  </Choose>
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
