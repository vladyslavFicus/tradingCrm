import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { compact } from 'lodash';
import { QueryResult } from '@apollo/client';
import { Config } from '@crm/common';
import { State, TableSelection } from 'types';
import {
  LeadUploadResponse__FailedLeads as FailedLeads,
  AcquisitionStatusTypes__Enum as AcquisitionStatusTypes,
} from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';
import LeadsUploadResultModal, { LeadsUploadResultModalProps } from 'modals/LeadsUploadResultModal';
import LeadsUploadModal, { LeadsUploadModalProps } from 'modals/LeadsUploadModal';
import { LeadsListQuery, LeadsListQueryVariables } from '../graphql/__generated__/LeadsListQuery';
import { useLeadsTotalCountQueryLazyQuery } from '../graphql/__generated__/LeadsTotalCountQuery';

type Props = {
  select: TableSelection | null,
  leadsQuery: QueryResult<LeadsListQuery>,
};

const useLeadsHeader = (props: Props) => {
  const { leadsQuery, select } = props;
  const { data, variables, refetch } = leadsQuery;

  const state = useLocation().state as State<LeadsListQueryVariables['args']>;

  const [loadingTotalCount, setLoadingTotalCount] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowChangeAcquisition = permission.allows(Config.permissions.USER_PROFILE.CHANGE_ACQUISITION);
  const allowUploadLeads = permission.allows(Config.permissions.LEADS.UPLOAD_LEADS_FROM_FILE);

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);
  const leadsUploadResultModal = useModal<LeadsUploadResultModalProps>(LeadsUploadResultModal);
  const leadsUploadModal = useModal<LeadsUploadModalProps>(LeadsUploadModal);

  // ===== Requests ===== //
  const [leadsTotalCountQuery] = useLeadsTotalCountQueryLazyQuery({
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const { content: leads = [], totalElements = 0 } = data?.leads || {};
  const searchLimit = state?.filters?.searchLimit;

  const listCount = (searchLimit && searchLimit < totalElements)
    ? searchLimit
    : totalElements;

  const selectedCount = select?.selected || 0;

  const handleGetLeadsCount = useCallback(async () => {
    setLoadingTotalCount(true);

    try {
      const newVariables = { args: { ...variables?.args, brandId: Config.getBrand().id } };

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
  }, [variables]);

  // ===== Handlers ===== //
  const handleSubmitSuccess = useCallback(async () => {
    refetch();
    select?.reset();
  }, [refetch, select]);

  const handleOpenRepresentativeModal = useCallback(() => {
    const uuids = select?.touched ? compact(select.touched.map(index => leads[index]?.uuid)) : [];

    updateRepresentativeModal.show({
      uuids,
      type: AcquisitionStatusTypes.SALES,
      header: (
        <>
          <div>{I18n.t('LEADS.LEADS_BULK_MODAL.HEADER')}</div>

          <div className="LeadsHeader__modal-subtitle">
            {select?.selected} {I18n.t('LEADS.LEADS_SELECTED')}
          </div>
        </>
      ),
      configs: {
        allRowsSelected: !!select?.all,
        selectedRowsLength: select?.selected || 0,
        multiAssign: true,
        ...state && {
          searchParams: state?.filters || {},
          sorts: state?.sorts || [],
        },
      },
      onSuccess: handleSubmitSuccess,
    });
  }, [state, select, leads, updateRepresentativeModal, handleSubmitSuccess]);

  const handleOpenLeadsUploadModal = useCallback(() => {
    leadsUploadModal.show({
      onSuccess: (failedLeads: Array<FailedLeads>, failedLeadsCount: number, createdLeadsCount: number) => {
        refetch();

        if (failedLeads.length) {
          leadsUploadResultModal.show({ failedLeads, failedLeadsCount, createdLeadsCount });
        }
      },
    });
  }, [leadsUploadModal, leadsUploadResultModal, refetch]);

  return {
    totalElements,
    loadingTotalCount,
    totalCount,
    allowChangeAcquisition,
    allowUploadLeads,
    listCount,
    selectedCount,
    handleGetLeadsCount,
    handleOpenRepresentativeModal,
    handleOpenLeadsUploadModal,
  };
};

export default useLeadsHeader;
