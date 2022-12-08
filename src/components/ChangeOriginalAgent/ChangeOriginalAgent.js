import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { FormikSelectField } from 'components/Formik';
import Button from 'components/UI/Button';
import PropTypes from 'constants/propTypes';
import { ChangeOriginalAgentMutation } from './graphql';
import OperatorsQuery from './graphql/OperatorsQuery';
import './OriginalAgent.scss';

class ChangeOriginalAgent extends PureComponent {
  static propTypes = {
    originalAgent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
    }),
    paymentId: PropTypes.string.isRequired,
    changeOriginalAgent: PropTypes.func.isRequired,
    operators: PropTypes.query({
      operators: PropTypes.shape({
        content: PropTypes.arrayOf(
          PropTypes.shape({
            uuid: PropTypes.string.isRequired,
            fullName: PropTypes.string.isRequired,
          }),
        ),
      }),
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  static defaultProps = {
    originalAgent: null,
  };

  handleChangeOriginalAgent = async ({ agentId }, { resetForm }) => {
    const { paymentId, changeOriginalAgent, onSuccess } = this.props;
    const operatorsList = this.getOperatorsList();

    const { fullName: agentName } = operatorsList.find(({ uuid }) => uuid === agentId);

    try {
      await changeOriginalAgent({
        variables: {
          paymentId,
          agentName,
          agentId,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });

      onSuccess();
      resetForm({ values: { agentId } });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  getOperatorsList = () => {
    const {
      operators,
      originalAgent,
    } = this.props;

    const operatorsList = get(operators, 'data.operators.content', []);

    if (originalAgent?.uuid && !operatorsList.find(({ uuid }) => uuid === originalAgent.uuid)) {
      operatorsList.unshift(originalAgent);
    }

    return operatorsList;
  };

  render() {
    const {
      operators: { loading, error },
      originalAgent,
      permission: {
        permissions: currentPermission,
      },
    } = this.props;

    const operatorsList = this.getOperatorsList();
    const canChangeOriginalAgent = new Permissions(permissions.PAYMENT.CHANGE_ORIGINAL_AGENT).check(currentPermission);

    return (
      <div className="ChangeOriginalAgent">
        <div className="ChangeOriginalAgent__label">
          {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
        </div>
        <Formik
          initialValues={{ agentId: originalAgent?.uuid }}
          onSubmit={this.handleChangeOriginalAgent}
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
                {operatorsList.map(({ uuid, fullName, operatorStatus }) => (
                  <option key={uuid} value={uuid} disabled={operatorStatus !== 'ACTIVE'}>{fullName}</option>
                ))}
              </Field>
              <If condition={canChangeOriginalAgent}>
                <Button
                  disabled={!dirty || error || isSubmitting}
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
  }
}

export default compose(
  withPermission,
  withRequests({
    operators: OperatorsQuery,
    changeOriginalAgent: ChangeOriginalAgentMutation,
  }),
)(ChangeOriginalAgent);
