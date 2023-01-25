import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal } from 'types';
import ChangeAccountStatusModal from 'modals/ChangeAccountStatusModal';
import { Button } from 'components/UI';
import { statusActions, actionStatus } from '../../../../constants';
import { useBulkChangeAffiliatesStatusMutation } from './graphql/__generated__/bulkChangeAffiliatesStatus';
import './PartnersBulkActions.scss';

type Props = {
  onRefetch: () => void,
  partnersUuids: Array<string>,
  modals: {
    changeAccountStatusModal: Modal,
  },
}

type Reason = {
  reason: string,
}

const PartnersBulkActions = (props: Props) => {
  const {
    partnersUuids,
    onRefetch,
    modals: { changeAccountStatusModal },
  } = props;
  const [bulkChangeAffiliatesStatusMutation] = useBulkChangeAffiliatesStatusMutation();

  const submitNewStatuses = async ({ reason }: Reason, status: actionStatus) => {
    try {
      await bulkChangeAffiliatesStatusMutation({
        variables: {
          uuids: partnersUuids,
          reason,
          status,
        },
      });
    } catch (e) {
      // do nothing
    }

    onRefetch();
    changeAccountStatusModal.hide();
  };

  const updateStatuses = (reasons: Record<string, string>, status: actionStatus) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: Reason) => submitNewStatuses(values, status),
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
            onClick={() => updateStatuses(reasons, action)}
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
