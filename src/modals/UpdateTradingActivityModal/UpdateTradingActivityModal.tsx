import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Operator } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { FormikSelectField } from 'components/Formik';
import { OPERATORS_SORT } from './constants';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import { useUpdateTradingActivityMutation } from './graphql/__generated__/UpdateTradingActivityMutation';

type FormValues = {
  agentId: string,
};

export type Props = {
  tradeId: number,
  originalAgent?: Operator,
  platformType?: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTradingActivityModal = (props: Props) => {
  const { tradeId, originalAgent, platformType = null, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const { data, loading } = useOperatorsQuery({ variables: { page: { sorts: OPERATORS_SORT } } });

  const operators = data?.operators?.content || [];

  const [UpdateTradingActivityMutation] = useUpdateTradingActivityMutation();

  // ===== Handlers ===== //
  const handleSubmit = async ({ agentId }: FormValues) => {
    try {
      await UpdateTradingActivityMutation({ variables: { tradeId, agentId, platformType } });

      onSuccess();
      onCloseModal();

      notify({
        title: I18n.t('TRADING_ACTIVITY_MODAL.TITLE'),
        level: LevelType.SUCCESS,
        message: I18n.t('TRADING_ACTIVITY_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        title: I18n.t('TRADING_ACTIVITY_MODAL.TITLE'),
        level: LevelType.ERROR,
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ agentId: originalAgent?.uuid || '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ACTIVITY_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
              <Field
                searchable
                name="agentId"
                component={FormikSelectField}
                label={I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
                disabled={loading}
              >
                {operators.map(({ uuid, fullName, operatorStatus }) => (
                  <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>
                    {fullName}
                  </option>
                ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                primary
                type="submit"
                disabled={!dirty || isSubmitting}
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateTradingActivityModal);