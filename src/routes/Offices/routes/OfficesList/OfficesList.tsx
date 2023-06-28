import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CreateOfficeModal, { CreateOfficeModalProps } from 'modals/CreateOfficeModal';
import OfficesGridFilter from './components/OfficesGridFilter';
import OfficesGrid from './components/OfficesGrid';
import { useOfficesListQuery, OfficesListQueryVariables } from './graphql/__generated__/OfficesListQuery';
import './OfficesList.scss';

const OfficesList = () => {
  const { state } = useLocation<State<OfficesListQueryVariables>>();

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

  // ===== Modals ===== //
  const createOfficeModal = useModal<CreateOfficeModalProps>(CreateOfficeModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useOfficesListQuery({
    variables: {
      ...state?.filters as OfficesListQueryVariables,
      branchType: 'office',
    },
  });

  const officesList = data?.branch || [];
  const totalCount = officesList.length || 0;

  // ===== Handlers ===== //
  const handleOpenAddOfficeModal = () => {
    createOfficeModal.show({
      onSuccess: refetch,
    });
  };


  return (
    <div className="OfficesList">
      <div className="OfficesList__header">
        <div className="OfficesList__title">
          <strong>{totalCount} </strong>

          {I18n.t('OFFICES.OFFICES')}
        </div>

        <If condition={allowCreateBranch}>
          <div className="OfficesList__actions">
            <Button
              tertiary
              onClick={handleOpenAddOfficeModal}
              data-testid="OfficesList-addOfficeButton"
            >
              {I18n.t('OFFICES.ADD_OFFICE')}
            </Button>
          </div>
        </If>
      </div>

      <OfficesGridFilter onRefetch={refetch} />

      <OfficesGrid loading={loading} officesList={officesList} onRefetch={refetch} />
    </div>
  );
};

export default React.memo(OfficesList);
