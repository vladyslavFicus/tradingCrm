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
import './GroupSecuritiesGrid.scss';

interface Props {
  formik: FormikProps<Group>,
  modals: {
    confirmationModal: Modal,
    groupNewSecurityModal: Modal,
    gropuSecurityCustomizationModal: Modal,
  },
}

const renderType = ({ security }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {security.name}
  </div>
);

const renderTrade = ({ securityId }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {securityId}
  </div>
);

const renderExecution = ({ securityId }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {securityId}
  </div>
);

const renderSpread = ({ spreadDiff }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {spreadDiff}
  </div>
);

const renderCommission = ({ lotMin, commissionType, lotMax }: GroupSecurity) => (
  <div className="GroupsGrid__cell-primary">
    {`${lotMin} ${commissionType} / ${lotMax} ${commissionType}`}
  </div>
);

const renderActions = (
  security: GroupSecurity,
  handleDeleteSecurity: (security: GroupSecurity) => void,
  handleEditSecurity: (security: GroupSecurity) => void,
) => (
  <>
    <EditButton
      onClick={() => handleEditSecurity(security)}
      className="GroupSecuritiesGrid__edit-button"
    />
    <Button
      transparent
      onClick={() => handleDeleteSecurity(security)}
    >
      <i className="fa fa-trash btn-transparent color-danger" />
    </Button>
  </>
);

const GroupSecuritiesGrid = ({ modals, formik }: Props) => {
  const { groupNewSecurityModal, gropuSecurityCustomizationModal, confirmationModal } = modals;
  const { values: { groupSecurities }, setFieldValue } = formik;

  const newSecurity = (groupSecurity: GroupSecurity) => {
    setFieldValue('groupSecurities', [...groupSecurities, groupSecurity]);
  };

  const editSecurity = (editableSecurity: GroupSecurity) => {
    const modifiedSecurities = groupSecurities.map(security => (
      security.securityId === editableSecurity.securityId
        ? editableSecurity
        : security
    ));
    setFieldValue('groupSecurities', modifiedSecurities);
  };

  const deleteSecurity = (securityId: number) => {
    const modifiedSecurities = groupSecurities.filter(security => security.securityId !== securityId);
    setFieldValue('groupSecurities', modifiedSecurities);
    confirmationModal.hide();
  };


  const handleNewSecurity = () => {
    groupNewSecurityModal.show({
      onSuccess: newSecurity,
    });
  };

  const handleEditSecurity = (security: GroupSecurity) => {
    gropuSecurityCustomizationModal.show({
      security,
      onSuccess: editSecurity,
    });
  };

  const handleDeleteSecurity = ({ securityId, security: { name } }: GroupSecurity) => {
    confirmationModal.show({
      onSubmit: () => deleteSecurity(securityId),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { name }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSecuritiesGrid">
      <div className="GroupSecuritiesGrid__header">
        <span className="GroupSecuritiesGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.TITLE')}
        </span>
        <Button
          onClick={handleNewSecurity}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.ADD_SECURITY')}
        </Button>
      </div>
      <Table
        stickyFromTop={123}
        items={groupSecurities}
      >
        <Column
          sortBy="type"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.TYPE')}
          render={renderType}
        />
        <Column
          sortBy="trade"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.TRADE')}
          render={renderTrade}
        />
        <Column
          sortBy="execution"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.EXECUTION')}
          render={renderExecution}
        />
        <Column
          sortBy="spread"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.SPREAD')}
          render={renderSpread}
        />
        <Column
          sortBy="commission"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.COMMISSION')}
          render={renderCommission}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SECURITIES_TABLE.ACTIONS')}
          render={(security: GroupSecurity) => renderActions(security, handleDeleteSecurity, handleEditSecurity)}
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
