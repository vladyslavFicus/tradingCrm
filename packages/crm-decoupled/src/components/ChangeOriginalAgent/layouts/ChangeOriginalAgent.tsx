import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Button, FormikSingleSelectField } from 'components';
import { Agent } from 'components/ChangeOriginalAgent/types';
import useChangeOriginalAgent from 'components/ChangeOriginalAgent/hooks/useChangeOriginalAgent';
import './ChangeOriginalAgent.scss';

type Props = {
  originalAgent: Agent,
  paymentId: string,
  onSuccess: () => void,
};

const ChangeOriginalAgent = (_props: Props) => {
  const { originalAgent } = _props;

  const {
    handleSubmit,
    canChangeOriginalAgent,
    loading,
    error,
    operators,
  } = useChangeOriginalAgent(_props);

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
              component={FormikSingleSelectField}
              className="ChangeOriginalAgent__select"
              disabled={!canChangeOriginalAgent || loading}
              options={operators.map(({ uuid, fullName, operatorStatus }) => ({
                label: fullName,
                value: uuid,
                disabled: operatorStatus !== 'ACTIVE',
              }))}
            />

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
