import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import GroupNewSecurityModal from '../../modals/GroupNewSecurityModal';
import GropuSecurityCustomizationModal from '../../modals/GropuSecurityCustomizationModal';
import { Group, GroupSecurity } from '../../types';
import { COMMISION_TYPES, COMMISION_LOTS } from '../../constants';
import './GroupSecuritiesGrid.scss';

interface Props {
  formik: FormikProps<Group>,
  modals: {
    confirmationModal: Modal,
    groupNewSecurityModal: Modal,
    gropuSecurityCustomizationModal: Modal,
  },
}

const renderType = ({ name, security }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {security?.name || name}
  </div>
);

const renderSpread = ({ spreadDiff }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {spreadDiff}
  </div>
);

const renderCommission = ({ lotMin, commissionType, commissionLots, lotMax }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {`${lotMin} ${COMMISION_TYPES[commissionType]} / ${lotMax} ${COMMISION_LOTS[commissionLots]}`}
  </div>
);

const renderActions = (
  security: GroupSecurity,
  handleDeleteGroupSecurityModal: (security: GroupSecurity) => void,
  handleEditGroupSecurityModal: (security: GroupSecurity) => void,
) => (
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
);

const GroupSecuritiesGrid = ({ modals, formik }: Props) => {
  const { groupNewSecurityModal, gropuSecurityCustomizationModal, confirmationModal } = modals;
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
    });
  };

  const handleEditGroupSecurityModal = (editableGroupSecurity: GroupSecurity) => {
    gropuSecurityCustomizationModal.show({
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
      <Table
        stickyFromTop={123}
        items={groupSecurities}
        className="GroupSecuritiesGrid__Table"
        withCustomScroll
      >
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.TYPE')}
          render={renderType}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.SPREAD')}
          render={renderSpread}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.COMMISSION')}
          render={renderCommission}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.GROUP.SECURITIES_TABLE.ACTIONS')}
          render={(security: GroupSecurity) => (
            renderActions(security, handleDeleteGroupSecurityModal, handleEditGroupSecurityModal)
          )}
        />
      </Table>
    </div>
  );
};

export default compose(
  withModals({
    confirmationModal: ConfirmActionModal,
    groupNewSecurityModal: GroupNewSecurityModal,
    gropuSecurityCustomizationModal: GropuSecurityCustomizationModal,
  }),
)(React.memo(GroupSecuritiesGrid));
