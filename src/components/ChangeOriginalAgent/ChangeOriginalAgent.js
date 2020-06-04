import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
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
    agentId: PropTypes.string.isRequired,
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
    notify: PropTypes.func.isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

  handleChangeOriginalAgent = async ({ agentId }, { resetForm }) => {
    const { paymentId, notify, operators, changeOriginalAgent } = this.props;
    const operatorsList = get(operators, 'data.operators.data.content') || [];

    const { fullName: agentName } = operatorsList.find(({ uuid }) => uuid === agentId);

    const { data: { payment: { changeOriginalAgent: { success } } } } = await changeOriginalAgent({
      variables: {
        paymentId,
        agentName,
        agentId,
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t('PAYMENT_DETAILS_MODAL.ORIGINAL_AGENT'),
      message: success
        ? I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY')
        : I18n.t('COMMON.SOMETHING_WRONG'),
    });

    if (success) {
      resetForm({ values: { agentId } });
    }
  };

  render() {
    const {
      operators: { loading, error },
      operators,
      agentId,
      permission: {
        permissions: currentPermission,
      },
    } = this.props;

    const operatorsList = get(operators, 'data.operators.data.content', []);
    const canChangeOriginalAgent = new Permissions(permissions.PAYMENT.CHANGE_ORIGINAL_AGENT).check(currentPermission);

    return (
      <div className="ChangeOriginalAgent">
        <div className="ChangeOriginalAgent__label">
          {I18n.t('CHANGE_ORIGINAL_AGENT.TITLE')}
        </div>
        <Formik
          initialValues={{ agentId }}
          onSubmit={this.handleChangeOriginalAgent}
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <Field
                name="agentId"
                component={FormikSelectField}
                className="ChangeOriginalAgent__select"
                disabled={!canChangeOriginalAgent || loading}
              >
                {operatorsList.map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>{fullName}</option>
                ))}
              </Field>
              <If condition={canChangeOriginalAgent}>
                <Button
                  disabled={!dirty || !error || isSubmitting}
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
  withNotifications,
  withRequests({
    operators: OperatorsQuery,
    changeOriginalAgent: ChangeOriginalAgentMutation,
  }),
)(ChangeOriginalAgent);
