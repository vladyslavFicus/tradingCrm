import React from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import CreateOfficeModal from 'modals/CreateOfficeModal';
import OfficesGridFilter from './components/OfficesGridFilter';
import OfficesGrid from './components/OfficesGrid';
import { useOfficesListQuery, OfficesListQueryVariables } from './graphql/__generated__/OfficesListQuery';

import './OfficesList.scss';

type Props = {
  modals: {
    createOfficeModal: Modal,
  },
};

const OfficesList = (props: Props) => {
  const { modals: { createOfficeModal } } = props;

  const { state } = useLocation<State<OfficesListQueryVariables>>();

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

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

export default compose(
  React.memo,
  withModals({
    createOfficeModal: CreateOfficeModal,
  }),
)(OfficesList);
