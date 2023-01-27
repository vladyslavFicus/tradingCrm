import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import { FormikSelectField } from 'components/Formik';
import { OPERATORS_SORT } from './constants';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import {
  useChangeOriginalAgentTradingActivityMutation,
} from './graphql/__generated__/ChangeOriginalAgentTradingActivityMutation';
import './OriginalAgentTradingActivity.scss';

type Agent = {
  uuid: string,
  fullName: string,
};

type FormValues = {
  agentId: string,
};

type Props = {
  originalAgent: Agent,
  tradeId: number,
  platformType: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const ChangeOriginalAgentTradingActivity = (props: Props) => {
  const { originalAgent, tradeId, platformType, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const { data, loading } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const operators = data?.operators?.content || [];

  const [changeOriginalAgentMutation] = useChangeOriginalAgentTradingActivityMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (formValues: FormValues) => {
    try {
      await changeOriginalAgentMutation({
        variables: {
          tradeId,
          agentId: formValues.agentId,
          platformType,
        },
      });

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
    <div className="OriginalAgentTradingActivity">
      <div className="OriginalAgentTradingActivity__label">
        {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
      </div>
      <Formik
        initialValues={{ agentId: originalAgent?.uuid || '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <Field
              searchable
              name="agentId"
              component={FormikSelectField}
              disabled={loading}
            >
              {operators.map(({ uuid, fullName, operatorStatus }) => (
                <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>
                  {fullName}
                </option>
              ))}
            </Field>

            <Button
              primary
              type="submit"
              disabled={!dirty || isSubmitting}
              className="OriginalAgentTradingActivity__button"
            >
              {I18n.t('COMMON.SAVE')}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ChangeOriginalAgentTradingActivity);
