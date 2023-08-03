import React, { useState } from 'react';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import Modal from 'components/Modal';
import { useDeleteBranchMutation } from './graphql/__generated__/DeleteBranchMutation';
import './DeleteBranchModal.scss';

type Errors = Array<{
  key: string,
  count: number,
}>;

export type Props = {
  uuid: string,
  name: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const DeleteBranchModal = (props: Props) => {
  const { uuid, name, onSuccess, onCloseModal } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorsList, setErrorsList] = useState<Errors>([]);

  // ===== Requests ===== //
  const [deleteBranchMutation] = useDeleteBranchMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    if (!isSubmitting) {
      try {
        setIsSubmitting(true);
        setErrorsList([]);

        await deleteBranchMutation({ variables: { uuid } });

        notify({
          level: LevelType.SUCCESS,
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('MODALS.DELETE_BRANCH_MODAL.SUCCESS', { name }),
        });

        onCloseModal();

        onSuccess();
      } catch (e) {
        const { errorParameters } = parseErrors(e);

        const errors = [];

        if (errorParameters?.subbranches > 0) {
          errors.push({
            key: errorParameters.subbranches > 1 ? 'SUBBRANCHES' : 'SUBBRANCH',
            count: errorParameters.subbranches,
          });
        }

        if (errorParameters?.operators > 0) {
          errors.push({
            key: errorParameters.operators > 1 ? 'OPERATORS' : 'OPERATOR',
            count: errorParameters.operators,
          });
        }

        if (errorParameters?.rules > 0) {
          errors.push({
            key: errorParameters.rules > 1 ? 'RULES' : 'RULE',
            count: errorParameters.rules,
          });
        }

        setErrorsList(errors);
      }

      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      onCloseModal={onCloseModal}
      title={I18n.t('MODALS.DELETE_BRANCH_MODAL.TITLE')}
      styleButton="danger"
      buttonTitle={I18n.t('COMMON.BUTTONS.DELETE')}
      disabled={isSubmitting || !!errorsList.length}
      clickSubmit={handleSubmit}
    >
      <div className="DeleteBranchModal__row DeleteBranchModal__action-text">
        {I18n.t('MODALS.DELETE_BRANCH_MODAL.DESCRIPTION', { name })}
      </div>

      <If condition={!!errorsList.length}>
        <div className="DeleteBranchModal__errors">
          <div>{I18n.t('MODALS.DELETE_BRANCH_MODAL.ERRORS.COMMON', { name })}</div>

          <ul className="DeleteBranchModal__errors-list">
            {errorsList.map(({ key, count }, index) => (
              <li key={index}>
                {I18n.t(`MODALS.DELETE_BRANCH_MODAL.ERRORS.${key}`, { count })}
              </li>
            ))}
          </ul>
        </div>
      </If>
    </Modal>
  );
};

export default React.memo(DeleteBranchModal);
