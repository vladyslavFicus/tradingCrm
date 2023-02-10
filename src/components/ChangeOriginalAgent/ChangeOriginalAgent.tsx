import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { OPERATORS_SORT } from './constants';
import { useOperatorsQuery } from './graphql/__generated__/OperatorsQuery';
import { useChangeOriginalAgentMutation } from './graphql/__generated__/ChangeOriginalAgentMutation';
import './OriginalAgent.scss';

type Agent = {
  uuid: string,
  fullName: string,
};

type FormValues = {
  agentId: string,
};

type Props = {
  originalAgent: Agent,
  paymentId: string,
  onSuccess: () => void,
};

const ChangeOriginalAgent = (props: Props) => {
  const { originalAgent, paymentId, onSuccess } = props;

  const permission = usePermission();
  const canChangeOriginalAgent = permission.allows(permissions.PAYMENT.CHANGE_ORIGINAL_AGENT);

  // ===== Requests ===== //
  const { data, loading, error } = useOperatorsQuery({
    variables: { page: { sorts: OPERATORS_SORT } },
  });

  const operators = data?.operators?.content || [];
  if (originalAgent && !operators.find(({ uuid }) => uuid === originalAgent.uuid)) {
    operators.push({ ...originalAgent, operatorStatus: 'ACTIVE' });
  }

  const [changeOriginalAgentMutation] = useChangeOriginalAgentMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    const { agentId } = values;

    const newAgent = operators.find(({ uuid }) => uuid === agentId);
    const agentName = newAgent?.fullName || null;

    try {
      await changeOriginalAgentMutation({
        variables: {
          paymentId,
          agentName,
          agentId,
        },
      });

      onSuccess();
      resetForm({ values: { agentId } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <div className="ChangeOriginalAgent">
      <div className="ChangeOriginalAgent__label">
        {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
      </div>

      <Formik
        initialValues={{ agentId: originalAgent?.uuid || '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <Field
              name="agentId"
              searchable
              component={FormikSelectField}
              className="ChangeOriginalAgent__select"
              disabled={!canChangeOriginalAgent || loading}
            >
              {operators.map(({ uuid, fullName, operatorStatus }) => (
                <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>{fullName}</option>
              ))}
            </Field>

            <If condition={canChangeOriginalAgent}>
              <Button
                disabled={!dirty || !!error || isSubmitting}
                className="ChangeOriginalAgent__button"
                type="submit"
                primary
                small
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </If>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(ChangeOriginalAgent);
