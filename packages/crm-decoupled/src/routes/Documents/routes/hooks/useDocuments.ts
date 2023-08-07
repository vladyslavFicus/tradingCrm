import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { permissions } from 'config';
import { State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import AddDocumentModal, { AddDocumentModalProps } from 'modals/AddDocumentModal';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
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
  const state = useLocation().state as State<FormValues>;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUploadDocument = permission.allows(permissions.DOCUMENTS.UPLOAD_DOCUMENT);

  // ===== Modals ===== //
  const addDocumentModal = useModal<AddDocumentModalProps>(AddDocumentModal);

  // ===== Requests ===== //
  const { timeZone, uploadDateRange, ...rest } = state?.filters || {} as FormValues;

  const queryVariables = {
    args: {
      ...rest,
      ...(uploadDateRange && { uploadDateRange: {
        ...fieldTimeZoneOffset('from', uploadDateRange?.from, timeZone),
        ...fieldTimeZoneOffset('to', uploadDateRange?.to, timeZone),
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
