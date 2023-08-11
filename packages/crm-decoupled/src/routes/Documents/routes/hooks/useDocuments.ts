import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Config, Utils, Types, usePermission, useModal } from '@crm/common';
import AddDocumentModal, { AddDocumentModalProps } from 'modals/AddDocumentModal';
import { FormValues } from '../types';
import {
  DocumentSearchQuery,
  DocumentSearchQueryVariables,
  useDocumentSearchQuery,
} from '../graphql/__generated__/DocumentSearchQuery';

type DocumentsList = DocumentSearchQuery['documentSearch']['content'];

type Documents = {
  allowUploadDocument: boolean,
  totalElements: number,
  content: DocumentsList,
  last?: boolean,
  loading: boolean,
  refetch: () => void,
  handleAddDocumentModal: () => void,
  handlePageChanged: () => void,
};

const useDocuments = (): Documents => {
  const state = useLocation().state as Types.State<FormValues>;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUploadDocument = permission.allows(Config.permissions.DOCUMENTS.UPLOAD_DOCUMENT);

  // ===== Modals ===== //
  const addDocumentModal = useModal<AddDocumentModalProps>(AddDocumentModal);

  // ===== Requests ===== //
  const { timeZone, uploadDateRange, ...rest } = state?.filters || {} as FormValues;

  const queryVariables = {
    args: {
      ...rest,
      ...(uploadDateRange && { uploadDateRange: {
        ...Utils.fieldTimeZoneOffset('from', uploadDateRange?.from, timeZone),
        ...Utils.fieldTimeZoneOffset('to', uploadDateRange?.to, timeZone),
      } }),
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts,
      },
    },
  };

  const { data, fetchMore, loading, refetch, variables } = useDocumentSearchQuery({
    variables: queryVariables as DocumentSearchQueryVariables,
  });

  const { content = [], last, number = 0, totalElements = 0 } = data?.documentSearch || {};

  // ===== Handlers ===== //
  const handleAddDocumentModal = useCallback(() => {
    addDocumentModal.show({ onSuccess: refetch });
  }, []);

  const handlePageChanged = useCallback(() => {
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: number + 1,
            size,
            sorts,
          },
        },
      },
    });
  }, [number, state, variables]);

  return {
    allowUploadDocument,
    content,
    last,
    loading,
    totalElements,
    refetch,
    handleAddDocumentModal,
    handlePageChanged,
  };
};

export default useDocuments;
