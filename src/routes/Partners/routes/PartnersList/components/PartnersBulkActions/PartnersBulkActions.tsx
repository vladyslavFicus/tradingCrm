import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal } from 'types';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { Button } from 'components/Buttons';
import { statusActions, actionStatus } from '../../../../constants';
import { useBulkChangeAffiliatesStatusMutation } from './graphql/__generated__/bulkChangeAffiliatesStatus';
import './PartnersBulkActions.scss';

type Props = {
  uuids: Array<string>,
  modals: {
    changeAccountStatusModal: Modal,
  },
  onRefetch: () => void,
};

type Reason = {
  reason: string,
};

const PartnersBulkActions = (props: Props) => {
  const {
    uuids,
    modals: { changeAccountStatusModal },
    onRefetch,
  } = props;

  // ===== Requests ===== //
  const [bulkChangeAffiliatesStatusMutation] = useBulkChangeAffiliatesStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ reason }: Reason, status: actionStatus) => {
    try {
      await bulkChangeAffiliatesStatusMutation({ variables: { uuids, reason, status } });
    } catch (e) {
      // do nothing
    }

    onRefetch();
    changeAccountStatusModal.hide();
  };

  const handleShowUpdateStatusModal = (reasons: Record<string, string>, status: actionStatus) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: Reason) => handleSubmit(values, status),
    });
  };

  return (
    <div className="PartnersBulkActions">
      <div className="PartnersBulkActions__title">
        {I18n.t('PARTNERS.BULK_ACTIONS')}
      </div>

      {statusActions
        .map(({ label, reasons, action }) => (
          <Button
            key={action}
            tertiary
            className={classNames('PartnersBulkActions__button', {
              'PartnersBulkActions__button--active': action === actionStatus.ACTIVE,
              'PartnersBulkActions__button--closed': action === actionStatus.CLOSED,
            })}
            onClick={() => handleShowUpdateStatusModal(reasons, action)}
          >
            {I18n.t(label)}
          </Button>
        ))
      }
    </div>
  );
};

export default compose(
  React.memo,
  withModals({ changeAccountStatusModal: ChangeAccountStatusModal }),
)(PartnersBulkActions);
