import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal, ConfirmationModal } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import GroupNewSecurityModal from '../../modals/GroupNewSecurityModal';
import GroupSecurityCustomizationModal from '../../modals/GroupSecurityCustomizationModal';
import { Group, GroupSecurity } from '../../types';
import './GroupSecuritiesGrid.scss';

interface Props {
  formik: FormikProps<Group>,
  modals: {
    confirmationModal: ConfirmationModal,
    groupNewSecurityModal: Modal<{
      onSuccess: (groupSecurity: GroupSecurity) => void,
      groupSecurities: GroupSecurity[],
    }>,
    groupSecurityCustomizationModal: Modal<{
      onSuccess: (editableGroupSecurity: GroupSecurity) => void,
      editableGroupSecurity: GroupSecurity,
    }>,
  },
}

const GroupSecuritiesGrid = ({ modals, formik }: Props) => {
  const { groupNewSecurityModal, groupSecurityCustomizationModal, confirmationModal } = modals;
  const { values, setFieldValue } = formik;
  const groupSecurities = values?.groupSecurities || [];

  const newGroupSecurity = (groupSecurity: GroupSecurity) => {
    setFieldValue('groupSecurities', [groupSecurity, ...groupSecurities]);
  };

  const editGroupSecurity = (editableGroupSecurity: GroupSecurity) => {
    const modifiedGroupSecurities = groupSecurities.map(groupSecurity => (
      groupSecurity.security.id === editableGroupSecurity.security.id
        ? editableGroupSecurity
        : groupSecurity
    ));
    setFieldValue('groupSecurities', modifiedGroupSecurities);
  };

  const deleteGroupSecurity = (id: string) => {
    const modifiedGroupSecurities = groupSecurities.filter(groupSecurity => groupSecurity.security.id !== id);
    setFieldValue('groupSecurities', modifiedGroupSecurities);
    confirmationModal.hide();
  };

  const handleNewGroupSecurityModal = () => {
    groupNewSecurityModal.show({
      onSuccess: newGroupSecurity,
      groupSecurities,
    });
  };

  const handleEditGroupSecurityModal = (editableGroupSecurity: GroupSecurity) => {
    groupSecurityCustomizationModal.show({
      editableGroupSecurity,
      onSuccess: editGroupSecurity,
    });
  };

  const handleDeleteGroupSecurityModal = ({ security: { name, id } }: GroupSecurity) => {
    confirmationModal.show({
      onSubmit: () => deleteGroupSecurity(id),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { name }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSecuritiesGrid">
      <div className="GroupSecuritiesGrid__header">
        <span className="GroupSecuritiesGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.TITLE')}
        </span>
        <Button
          onClick={handleNewGroupSecurityModal}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.ADD_SECURITY')}
        </Button>
      </div>
      <div id="group-securities-table-scrollable-target">
        <Table
          stickyFromTop={0}
          items={groupSecurities}
          scrollableTarget="group-securities-table-scrollable-target"
        >
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.TYPE')}
            render={({ name, security }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {security?.name || name}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.SPREAD')}
            render={({ spreadDiff }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {spreadDiff}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.COMMISSION')}
            render={({ lotMin, commissionType, commissionLots, lotMax }: GroupSecurity) => (
              <div className="GroupsGrid__cell-primary">
                {`
                ${lotMin} ${I18n.t(`TRADING_ENGINE.GROUP.${commissionType}`)} / 
                ${lotMax} ${I18n.t(`TRADING_ENGINE.GROUP.PER_${commissionLots}`)}
              `}
              </div>
            )}
          />
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.ACTIONS')}
            render={(security: GroupSecurity) => (
              <>
                <EditButton
                  onClick={() => handleEditGroupSecurityModal(security)}
                  className="GroupSecuritiesGrid__edit-button"
                />
                <Button
                  transparent
                  onClick={() => handleDeleteGroupSecurityModal(security)}
                >
                  <i className="fa fa-trash btn-transparent color-danger" />
                </Button>
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
    groupNewSecurityModal: GroupNewSecurityModal,
    groupSecurityCustomizationModal: GroupSecurityCustomizationModal,
  }),
)(GroupSecuritiesGrid);
